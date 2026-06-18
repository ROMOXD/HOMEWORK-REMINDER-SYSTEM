import { DEFAULT_SUBJECTS, mergeSubjects } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { getItem, setItem, StorageKeys } from "@/lib/storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CustomSubjectsMap = Record<string, string[]>;

type SubjectsContextValue = {
  subjects: string[];
  addCustomSubject: (name: string) => Promise<string | null>;
  isLoading: boolean;
};

const SubjectsContext = createContext<SubjectsContextValue | null>(null);

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [customByUser, setCustomByUser] = useState<CustomSubjectsMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getItem<CustomSubjectsMap>(StorageKeys.customSubjects, {}).then((stored) => {
      setCustomByUser(stored);
      setIsLoading(false);
    });
  }, []);

  const customSubjects = user ? (customByUser[user.id] ?? []) : [];

  const taskSubjects = useMemo(
    () => tasks.map((task) => task.subject),
    [tasks],
  );

  const subjects = useMemo(
    () => mergeSubjects(DEFAULT_SUBJECTS, customSubjects, taskSubjects),
    [customSubjects, taskSubjects],
  );

  const persistCustom = useCallback(async (next: CustomSubjectsMap) => {
    setCustomByUser(next);
    await setItem(StorageKeys.customSubjects, next);
  }, []);

  const addCustomSubject = useCallback(
    async (name: string) => {
      if (!user) return "Please log in to add subjects";

      const trimmed = name.trim();
      if (!trimmed) return "Please enter a subject name";
      if (trimmed.length > 30) return "Subject name is too long";

      const exists = subjects.some(
        (subject) => subject.toLowerCase() === trimmed.toLowerCase(),
      );
      if (exists) return "This subject already exists";

      const next = {
        ...customByUser,
        [user.id]: [...(customByUser[user.id] ?? []), trimmed],
      };
      await persistCustom(next);
      return null;
    },
    [customByUser, persistCustom, subjects, user],
  );

  const value = useMemo(
    () => ({ subjects, addCustomSubject, isLoading }),
    [subjects, addCustomSubject, isLoading],
  );

  return (
    <SubjectsContext.Provider value={value}>{children}</SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (!context) {
    throw new Error("useSubjects must be used within SubjectsProvider");
  }
  return context;
}
