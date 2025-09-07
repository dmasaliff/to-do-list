export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
}