import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { getItem, setItem, StorageKeys } from "@/lib/storage";
import type { AppNotification, Task } from "@/types";
import type { Subject } from "@/constants/theme";
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
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toDateString(date: Date) {
  return date.toISOString();
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
    const all = await getItem<Task[]>(StorageKeys.tasks, []);
    const others = all.filter((task) => task.userId !== user?.id);
    await setItem(StorageKeys.tasks, [...others, ...next]);
  }, [user?.id]);

  const persistNotifications = useCallback(
    async (next: AppNotification[]) => {
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

    Promise.all([
      getItem<Task[]>(StorageKeys.tasks, []),
      getItem<AppNotification[]>(StorageKeys.notifications, []),
    ]).then(([allTasks, allNotifications]) => {
      setTasks(allTasks.filter((task) => task.userId === user.id));
      setNotifications(
        allNotifications.filter((item) => item.userId === user.id),
      );
      setIsLoading(false);
    });
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
        const next = [task, ...current];
        void persistTasks(next);
        return next;
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
