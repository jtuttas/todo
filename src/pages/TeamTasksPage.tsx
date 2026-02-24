import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getTasks } from '../services/taskService';
import { getProjects } from '../services/projectService';
import { getPriorities } from '../services/priorityService';
import { getUsers } from '../services/userService';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TeamTasksPage() {
  const [filterUser, setFilterUser] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const { data: tasks, isLoading } = useQuery({ queryKey: ['tasks'], queryFn: getTasks, refetchInterval: 30000 });
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  const { data: priorities = [] } = useQuery({ queryKey: ['priorities'], queryFn: getPriorities });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  let list = tasks ?? [];
  if (filterUser) list = list.filter(t => String(t.user_id) === filterUser);
  if (filterProject) list = list.filter(t => String(t.project_id) === filterProject);
  if (filterPriority) list = list.filter(t => String(t.priority_id) === filterPriority);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Team-Aufgaben</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <select value={filterUser} onChange={e => setFilterUser(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Alle Mitarbeiter</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
        </select>
        <select value={filterProject} onChange={e => setFilterProject(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Alle Projekte</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Alle Prioritäten</option>
          {priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {(filterUser || filterProject || filterPriority) && (
          <button onClick={() => { setFilterUser(''); setFilterProject(''); setFilterPriority(''); }} className="text-sm text-accent hover:underline">Zurücksetzen</button>
        )}
      </div>
      {isLoading ? <LoadingSpinner /> : list.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Keine Aufgaben</div>
      ) : (
        <div className="space-y-2">{list.map(t => <TaskCard key={t.id} task={t} priorities={priorities} projects={projects} users={users} />)}</div>
      )}
    </div>
  );
}
