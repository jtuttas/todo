export interface User {
  id: number;
  username: string;
  role: 'Administrator' | 'Abteilungsleiter' | 'Mitarbeiter';
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  done: boolean;
  priority_id?: number;
  project_id?: number;
  user_id?: number;
}

export interface Priority {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
}
