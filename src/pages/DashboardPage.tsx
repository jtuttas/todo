import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../services/taskService';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckSquare, Clock, AlertCircle, ListTodo } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: tasks, isLoading } = useQuery({ queryKey: ['tasks'], queryFn: getTasks, refetchInterval: 30000 });

  const myTasks = tasks?.filter(t => t.user_id === user?.id) ?? [];
  const open = myTasks.filter(t => !t.done).length;
  const done = myTasks.filter(t => t.done).length;
  const overdue = myTasks.filter(t => !t.done && t.dueDate && new Date(t.dueDate) < new Date()).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      {isLoading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Meine Aufgaben', value: myTasks.length, icon: ListTodo, color: 'text-blue-600 bg-blue-50' },
            { label: 'Offen', value: open, icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50' },
            { label: 'Erledigt', value: done, icon: CheckSquare, color: 'text-green-600 bg-green-50' },
            { label: 'Überfällig', value: overdue, icon: Clock, color: 'text-accent bg-red-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${color}`}><Icon className="w-5 h-5" /></div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
