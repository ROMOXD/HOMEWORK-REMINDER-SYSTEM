import type { Subject } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { getItem, setItem, StorageKeys } from "@/lib/storage";
import supabase, { hasSupabase } from "@/lib/supabase";
import type { AppNotification, Task } from "@/types";
import * as Notifications from "expo-notifications";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type TaskInput = {
  title: string;
  subject: Subject;
  description: string;
  dueDate: Date;
  reminderTime: Date;
};

type TaskContextValue = {
  tasks: Task[];
  notifications: AppNotification[];
  isLoading: boolean;
  addTask: (input: TaskInput) => Promise<void>;
  updateTask: (id: string, input: TaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
};

const TaskContext = createContext<TaskContextValue | null>(null);

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const randomValue =
      typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function"
        ? crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f
        : Math.floor(Math.random() * 16);
    const value = c === "x" ? randomValue : (randomValue & 0x3) | 0x8;
    return value.toString(16);
  });
}

function toDateString(date: Date) {
  return date.toISOString();
}

function isExpectedSupabaseNotificationError(err: unknown) {
  const message = err instanceof Error ? err.message : String(err ?? "");
  return message.includes("foreign key constraint") || message.includes("violates foreign key constraint");
}

async function scheduleReminder(task: Task, enabled: boolean) {
  if (!enabled) return;

  const reminderDate = new Date(task.reminderTime);
  if (reminderDate.getTime() <= Date.now()) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Homework Reminder",
      body: `${task.title} (${task.subject}) is due soon.`,
      data: { taskId: task.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
    },
  });
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const persistTasks = useCallback(async (next: Task[]) => {
    if (hasSupabase && supabase && user) {
      try {
        const dbTasksRes = await supabase.from("tasks").select("id").eq("user_id", user.id);
        if (dbTasksRes.error) {
          console.error("Supabase task select failed:", dbTasksRes.error);
          throw dbTasksRes.error;
        }

        const dbTasks = Array.isArray(dbTasksRes.data) ? dbTasksRes.data.map((r: any) => r.id) : [];
        const nextIds = next.map((t) => t.id);

        const upserts = next.map((t) => ({
          id: t.id,
          user_id: t.userId,
          title: t.title,
          subject: t.subject,
          description: t.description,
          due_date: t.dueDate,
          reminder_time: t.reminderTime,
          completed: t.completed,
          completed_at: t.completedAt ?? null,
          created_at: t.createdAt,
        }));

        const upsertRes = await supabase.from("tasks").upsert(upserts);
        if (upsertRes.error) {
          console.error("Supabase task upsert failed:", upsertRes.error);
          throw upsertRes.error;
        }

        const toDelete = dbTasks.filter((id: string) => !nextIds.includes(id));
        if (toDelete.length > 0) {
          const deleteRes = await supabase.from("tasks").delete().in("id", toDelete);
          if (deleteRes.error) {
            console.error("Supabase task delete failed:", deleteRes.error);
            throw deleteRes.error;
          }
        }

        return;
      } catch (err: any) {
        console.error("Supabase persistence failed, falling back to local storage:", err.message ?? err);
      }
    }

    const all = await getItem<Task[]>(StorageKeys.tasks, []);
    const others = all.filter((task) => task.userId !== user?.id);
    await setItem(StorageKeys.tasks, [...others, ...next]);
  }, [user?.id]);

  const persistNotifications = useCallback(
    async (next: AppNotification[]) => {
      if (hasSupabase && supabase && user) {
        try {
          const dbNotificationsRes = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", user.id);

          if (dbNotificationsRes.error) {
            console.error("Supabase notifications select failed:", dbNotificationsRes.error);
            throw dbNotificationsRes.error;
          }

          const dbNotifications = Array.isArray(dbNotificationsRes.data)
            ? dbNotificationsRes.data.map((r: any) => r.id)
            : [];
          const nextIds = next.map((item) => item.id);

          const upserts = next.map((item) => ({
            id: item.id,
            user_id: item.userId,
            task_id: item.taskId ?? null,
            title: item.title,
            message: item.message,
            type: item.type,
            read: item.read,
            created_at: item.createdAt,
          }));

          const upsertRes = await supabase.from("notifications").upsert(upserts);
          if (upsertRes.error) {
            console.error("Supabase notification upsert failed:", upsertRes.error);
            throw upsertRes.error;
          }

          const toDelete = dbNotifications.filter((id: string) => !nextIds.includes(id));
          if (toDelete.length > 0) {
            const deleteRes = await supabase.from("notifications").delete().in("id", toDelete);
            if (deleteRes.error) {
              console.error("Supabase notification delete failed:", deleteRes.error);
              throw deleteRes.error;
            }
          }

          return;
        } catch (err: any) {
          if (!isExpectedSupabaseNotificationError(err)) {
            console.error(
              "Supabase notification persistence failed, falling back to local storage:",
              err.message ?? err,
            );
          }
        }
      }

      const all = await getItem<AppNotification[]>(StorageKeys.notifications, []);
      const others = all.filter((item) => item.userId !== user?.id);
      await setItem(StorageKeys.notifications, [...others, ...next]);
    },
    [user?.id],
  );

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    (async () => {
      if (hasSupabase && supabase) {
        try {
          const [tasksRes, notificationsRes] = await Promise.all([
            supabase.from("tasks").select("*").eq("user_id", user.id),
            supabase.from("notifications").select("*").eq("user_id", user.id),
          ]);

          if (!tasksRes.error && Array.isArray(tasksRes.data)) {
            const mappedTasks: Task[] = tasksRes.data.map((t: any) => ({
              id: t.id,
              userId: t.user_id,
              title: t.title,
              subject: t.subject,
              description: t.description,
              dueDate: t.due_date,
              reminderTime: t.reminder_time,
              completed: !!t.completed,
              completedAt: t.completed_at ?? undefined,
              createdAt: t.created_at,
            }));
            setTasks(mappedTasks);
          } else {
            if (tasksRes.error) console.error("Supabase task fetch failed:", tasksRes.error);
            setTasks([]);
          }

          if (!notificationsRes.error && Array.isArray(notificationsRes.data)) {
            const mappedNotifications: AppNotification[] = notificationsRes.data.map((n: any) => ({
              id: n.id,
              userId: n.user_id,
              taskId: n.task_id ?? undefined,
              title: n.title,
              message: n.message,
              type: n.type,
              read: !!n.read,
              createdAt: n.created_at,
            }));
            setNotifications(mappedNotifications);
          } else {
            if (notificationsRes.error) console.error("Supabase notification fetch failed:", notificationsRes.error);
            setNotifications([]);
          }
        } catch (err: any) {
          console.error("Supabase task/notification load failed:", err.message ?? err);
          setTasks([]);
          setNotifications([]);
        }
      } else {
        const [allTasks, allNotifications] = await Promise.all([
          getItem<Task[]>(StorageKeys.tasks, []),
          getItem<AppNotification[]>(StorageKeys.notifications, []),
        ]);

        setTasks(allTasks.filter((task) => task.userId === user.id));
        setNotifications(
          allNotifications.filter((item) => item.userId === user.id),
        );
      }

      setIsLoading(false);
    })();
  }, [user]);

  const addNotification = useCallback(
    async (item: Omit<AppNotification, "id" | "userId" | "createdAt" | "read">) => {
      if (!user) return;

      const entry: AppNotification = {
        ...item,
        id: createId(),
        userId: user.id,
        read: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications((current) => {
        const next = [entry, ...current];
        void persistNotifications(next);
        return next;
      });
    },
    [persistNotifications, user],
  );

  const addTask = useCallback(
    async (input: TaskInput) => {
      if (!user) return;

      const task: Task = {
        id: createId(),
        userId: user.id,
        title: input.title.trim(),
        subject: input.subject,
        description: input.description.trim(),
        dueDate: toDateString(input.dueDate),
        reminderTime: toDateString(input.reminderTime),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      setTasks((current) => {
        const nextTasks = [task, ...current];
        void persistTasks(nextTasks);
        return nextTasks;
      });

      await addNotification({
        taskId: task.id,
        title: "Assignment Added",
        message: `"${task.title}" was added with due date ${new Date(task.dueDate).toLocaleDateString()}.`,
        type: "alert",
      });

      await scheduleReminder(task, settings.notificationsEnabled);
    },
    [addNotification, persistTasks, settings.notificationsEnabled, user],
  );

  const updateTask = useCallback(
    async (id: string, input: TaskInput) => {
      if (!user) return;

      setTasks((current) => {
        const next = current.map((task) =>
          task.id === id
            ? {
                ...task,
                title: input.title.trim(),
                subject: input.subject,
                description: input.description.trim(),
                dueDate: toDateString(input.dueDate),
                reminderTime: toDateString(input.reminderTime),
              }
            : task,
        );
        void persistTasks(next);
        return next;
      });

      const updated = tasks.find((task) => task.id === id);
      if (updated) {
        const merged = {
          ...updated,
          title: input.title.trim(),
          subject: input.subject,
          description: input.description.trim(),
          dueDate: toDateString(input.dueDate),
          reminderTime: toDateString(input.reminderTime),
        };
        await scheduleReminder(merged, settings.notificationsEnabled);
      }
    },
    [persistTasks, settings.notificationsEnabled, tasks, user],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      setTasks((current) => {
        const next = current.filter((task) => task.id !== id);
        void persistTasks(next);
        return next;
      });

      setNotifications((current) => {
        const next = current.filter((item) => item.taskId !== id);
        void persistNotifications(next);
        return next;
      });
    },
    [persistNotifications, persistTasks],
  );

  const toggleComplete = useCallback(
    async (id: string) => {
      setTasks((current) => {
        const next = current.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : undefined,
              }
            : task,
        );
        void persistTasks(next);
        return next;
      });

      const task = tasks.find((entry) => entry.id === id);
      if (task && !task.completed) {
        await addNotification({
          taskId: id,
          title: "Task Completed",
          message: `"${task.title}" has been marked as completed.`,
          type: "reminder",
        });
      }
    },
    [addNotification, persistTasks, tasks],
  );

  const markNotificationRead = useCallback(
    async (id: string) => {
      setNotifications((current) => {
        const next = current.map((item) =>
          item.id === id ? { ...item, read: true } : item,
        );
        void persistNotifications(next);
        return next;
      });
    },
    [persistNotifications],
  );

  const value = useMemo(
    () => ({
      tasks,
      notifications,
      isLoading,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      markNotificationRead,
    }),
    [
      tasks,
      notifications,
      isLoading,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      markNotificationRead,
    ],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
}
