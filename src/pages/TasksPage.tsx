import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getTasks } from '../services/taskService';
import { getProjects } from '../services/projectService';
import { getPriorities } from '../services/priorityService';
import { useAuth } from '../hooks/useAuth';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TasksPage() {
  const { user } = useAuth();
  const [filterProject, setFilterProject] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState('');

  const { data: tasks, isLoading: tl } = useQuery({ queryKey: ['tasks'], queryFn: getTasks, refetchInterval: 30000 });
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  const { data: priorities = [] } = useQuery({ queryKey: ['priorities'], queryFn: getPriorities });

  let myTasks = (tasks ?? []).filter(t => t.user_id === user?.id);
  if (filterProject) myTasks = myTasks.filter(t => String(t.project_id) === filterProject);
  if (filterPriority) myTasks = myTasks.filter(t => String(t.priority_id) === filterPriority);
  if (sortBy === 'priority') myTasks = [...myTasks].sort((a, b) => (a.priority_id ?? 99) - (b.priority_id ?? 99));
  if (sortBy === 'date') myTasks = [...myTasks].sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Meine Aufgaben</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Alle Projekte</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Alle Prioritäten</option>
          {priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Sortierung</option>
          <option value="priority">Nach Priorität</option>
          <option value="date">Nach Datum</option>
        </select>
        {(filterProject || filterPriority || sortBy) && (
          <button onClick={() => { setFilterProject(''); setFilterPriority(''); setSortBy(''); }} className="text-sm text-accent hover:underline">Filter zurücksetzen</button>
        )}
      </div>
      {tl ? <LoadingSpinner /> : myTasks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">Keine Aufgaben vorhanden</p>
        </div>
      ) : (
        <div className="space-y-2">{myTasks.map(t => <TaskCard key={t.id} task={t} priorities={priorities} projects={projects} />)}</div>
      )}
    </div>
  );
}
