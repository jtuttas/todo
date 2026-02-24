import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUser } from '../../services/userService';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const schema = z.object({
  role: z.enum(['Administrator', 'Abteilungsleiter', 'Mitarbeiter']),
  password: z.string().optional().refine(v => !v || v.length >= 8, 'Mind. 8 Zeichen').refine(v => !v || /[0-9]/.test(v), 'Mind. eine Zahl').refine(v => !v || /[^a-zA-Z0-9]/.test(v), 'Mind. ein Sonderzeichen'),
});
type FormData = z.infer<typeof schema>;

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const user = users?.find(u => u.id === Number(id));

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: user ? { role: user.role, password: '' } : undefined,
  });

  const { mutate } = useMutation({
    mutationFn: (d: FormData) => updateUser(Number(id), d.password ? { role: d.role, password: d.password } : { role: d.role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Benutzer aktualisiert'); navigate('/admin/users'); },
    onError: () => toast.error('Fehler'),
  });

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <div className="text-center py-16 text-gray-400">Benutzer nicht gefunden</div>;

  const f = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
  const e = 'text-xs text-accent mt-1';
  const l = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="max-w-md">
      <Link to="/admin/users" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-4"><ArrowLeft className="w-4 h-4" /> Zurück</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Benutzer bearbeiten</h1>
      <form onSubmit={handleSubmit(d => mutate(d))} className="bg-white rounded-xl border p-6 space-y-4">
        <div><label className={l}>Benutzername</label><input value={user.username} disabled className={`${f} bg-gray-50 text-gray-500`} /></div>
        <div>
          <label className={l}>Rolle *</label>
          <select {...register('role')} className={f}>
            <option value="Mitarbeiter">Mitarbeiter</option>
            <option value="Abteilungsleiter">Abteilungsleiter</option>
            <option value="Administrator">Administrator</option>
          </select>
          {errors.role && <p className={e}>{errors.role.message}</p>}
        </div>
        <div><label className={l}>Neues Passwort (optional)</label><input {...register('password')} type="password" className={f} placeholder="Leer lassen um nicht zu ändern" />{errors.password && <p className={e}>{errors.password.message}</p>}</div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50">
          {isSubmitting ? 'Speichern...' : 'Speichern'}
        </button>
      </form>
    </div>
  );
}
