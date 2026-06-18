export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  reminderTime: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
};

export type AppNotification = {
  id: string;
  userId: string;
  taskId?: string;
  title: string;
  message: string;
  type: "deadline" | "reminder" | "alert";
  read: boolean;
  createdAt: string;
};

export type AppSettings = {
  notificationsEnabled: boolean;
  darkMode: boolean;
  language: "en" | "fil";
};

export type ResetCode = {
  email: string;
  code: string;
  expiresAt: number;
};
