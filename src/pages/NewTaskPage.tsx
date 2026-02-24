import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../services/taskService';
import { getProjects } from '../services/projectService';
import { getPriorities } from '../services/priorityService';
import { getUsers } from '../services/userService';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const schema = z.object({
  title: z.string().min(3, 'Titel muss mind. 3 Zeichen lang sein').max(100),
  description: z.string().optional(),
  dueDate: z.string().optional().refine(val => {
    if (!val) return true;
    const today = new Date(); today.setHours(0,0,0,0);
    return new Date(val) >= today;
  }, 'Datum darf nicht in der Vergangenheit liegen'),
  user_id: z.string().min(1, 'Mitarbeiter ist erforderlich'),
  priority_id: z.string().min(1, 'Priorität ist erforderlich'),
  project_id: z.string().min(1, 'Projekt ist erforderlich'),
});
type FormData = z.infer<typeof schema>;

export default function NewTaskPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  const { data: priorities = [] } = useQuery({ queryKey: ['priorities'], queryFn: getPriorities });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { mutate } = useMutation({
    mutationFn: (data: FormData) => createTask({ ...data, user_id: Number(data.user_id), priority_id: Number(data.priority_id), project_id: Number(data.project_id), done: false }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); toast.success('Aufgabe erstellt'); navigate('/team/tasks'); },
    onError: () => toast.error('Fehler beim Erstellen'),
  });

  const field = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
  const err = 'text-xs text-accent mt-1';
  const label = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="max-w-lg">
      <Link to="/team/tasks" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> Zurück
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Neue Aufgabe</h1>
      <form onSubmit={handleSubmit(d => mutate(d))} className="bg-white rounded-xl border p-6 space-y-4">
        <div><label className={label}>Titel *</label><input {...register('title')} className={field} />{errors.title && <p className={err}>{errors.title.message}</p>}</div>
        <div><label className={label}>Beschreibung</label><textarea {...register('description')} rows={3} className={field} /></div>
        <div><label className={label}>Fälligkeitsdatum</label><input {...register('dueDate')} type="date" className={field} />{errors.dueDate && <p className={err}>{errors.dueDate.message}</p>}</div>
        <div>
          <label className={label}>Mitarbeiter *</label>
          <select {...register('user_id')} className={field}><option value="">Auswählen...</option>{users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}</select>
          {errors.user_id && <p className={err}>{errors.user_id.message}</p>}
        </div>
        <div>
          <label className={label}>Priorität *</label>
          <select {...register('priority_id')} className={field}><option value="">Auswählen...</option>{priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          {errors.priority_id && <p className={err}>{errors.priority_id.message}</p>}
        </div>
        <div>
          <label className={label}>Projekt *</label>
          <select {...register('project_id')} className={field}><option value="">Auswählen...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          {errors.project_id && <p className={err}>{errors.project_id.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50">
          {isSubmitting ? 'Speichern...' : 'Aufgabe erstellen'}
        </button>
      </form>
    </div>
  );
}
