import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markTaskDone } from '../services/taskService';
import { toast } from 'sonner';
import type { Task, Priority, Project, User } from '../types';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
  task: Task;
  priorities: Priority[];
  projects: Project[];
  users?: User[];
}

const priorityColor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('hoch') || n.includes('high') || n.includes('urgent')) return 'bg-red-100 text-red-700';
  if (n.includes('mittel') || n.includes('medium') || n.includes('normal')) return 'bg-yellow-100 text-yellow-700';
  if (n.includes('niedrig') || n.includes('low')) return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-700';
};

export default function TaskCard({ task, priorities, projects, users }: Props) {
  const qc = useQueryClient();
  const priority = priorities.find(p => p.id === task.priority_id);
  const project = projects.find(p => p.id === task.project_id);
  const assignee = users?.find(u => u.id === task.user_id);

  const { mutate } = useMutation({
    mutationFn: (done: boolean) => markTaskDone(task.id, done),
    onMutate: async (done) => {
      await qc.cancelQueries({ queryKey: ['tasks'] });
      const prev = qc.getQueryData<Task[]>(['tasks']);
      qc.setQueryData<Task[]>(['tasks'], old => old?.map(t => t.id === task.id ? { ...t, done } : t));
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['tasks'], ctx.prev);
      toast.error('Fehler beim Aktualisieren der Aufgabe');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return (
    <div className={clsx('bg-white rounded-xl border p-4 flex gap-3 items-start', task.done && 'opacity-60')}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => mutate(e.target.checked)}
        className="mt-1 w-4 h-4 accent-primary cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <Link to={`/tasks/${task.id}`} className="font-medium text-gray-900 hover:text-primary text-sm block truncate">
          <span className={clsx(task.done && 'line-through text-gray-400')}>{task.title}</span>
        </Link>
        <div className="flex flex-wrap gap-2 mt-1.5">
          {priority && <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', priorityColor(priority.name))}>{priority.name}</span>}
          {project && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{project.name}</span>}
          {assignee && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{assignee.username}</span>}
          {task.dueDate && <span className="text-xs text-gray-500">{task.dueDate}</span>}
        </div>
      </div>
    </div>
  );
}
