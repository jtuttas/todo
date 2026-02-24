import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../services/taskService';
import { getProjects } from '../services/projectService';
import { getPriorities } from '../services/priorityService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: tasks, isLoading } = useQuery({ queryKey: ['tasks'], queryFn: getTasks });
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  const { data: priorities = [] } = useQuery({ queryKey: ['priorities'], queryFn: getPriorities });

  const task = tasks?.find(t => t.id === Number(id));
  const project = projects.find(p => p.id === task?.project_id);
  const priority = priorities.find(p => p.id === task?.priority_id);

  if (isLoading) return <LoadingSpinner />;
  if (!task) return <div className="text-center py-16 text-gray-400">Aufgabe nicht gefunden</div>;

  return (
    <div className="max-w-xl">
      <Link to="/tasks" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> Zurück
      </Link>
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>
        {task.description && <p className="text-gray-600 text-sm">{task.description}</p>}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-500">Status:</span> <span className={task.done ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>{task.done ? 'Erledigt' : 'Offen'}</span></div>
          {priority && <div><span className="text-gray-500">Priorität:</span> <span className="font-medium">{priority.name}</span></div>}
          {project && <div><span className="text-gray-500">Projekt:</span> <span className="font-medium">{project.name}</span></div>}
          {task.dueDate && <div><span className="text-gray-500">Fällig:</span> <span className="font-medium">{task.dueDate}</span></div>}
        </div>
      </div>
    </div>
  );
}
