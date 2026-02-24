import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerUser } from '../../services/userService';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const schema = z.object({
  username: z.string().min(3, 'Mind. 3 Zeichen').regex(/^[a-zA-Z0-9]+$/, 'Nur alphanumerische Zeichen'),
  password: z.string().min(8, 'Mind. 8 Zeichen').regex(/[0-9]/, 'Mind. eine Zahl').regex(/[^a-zA-Z0-9]/, 'Mind. ein Sonderzeichen'),
  passwordConfirm: z.string(),
  role: z.enum(['Administrator', 'Abteilungsleiter', 'Mitarbeiter']),
}).refine(d => d.password === d.passwordConfirm, { message: 'Passwörter stimmen nicht überein', path: ['passwordConfirm'] });
type FormData = z.infer<typeof schema>;

export default function NewUserPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { mutate } = useMutation({
    mutationFn: (d: FormData) => registerUser({ username: d.username, password: d.password, role: d.role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Benutzer erstellt'); navigate('/admin/users'); },
    onError: () => toast.error('Fehler beim Erstellen'),
  });

  const f = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
  const e = 'text-xs text-accent mt-1';
  const l = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="max-w-md">
      <Link to="/admin/users" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-4"><ArrowLeft className="w-4 h-4" /> Zurück</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Neuer Benutzer</h1>
      <form onSubmit={handleSubmit(d => mutate(d))} className="bg-white rounded-xl border p-6 space-y-4">
        <div><label className={l}>Benutzername *</label><input {...register('username')} className={f} />{errors.username && <p className={e}>{errors.username.message}</p>}</div>
        <div><label className={l}>Passwort *</label><input {...register('password')} type="password" className={f} />{errors.password && <p className={e}>{errors.password.message}</p>}</div>
        <div><label className={l}>Passwort bestätigen *</label><input {...register('passwordConfirm')} type="password" className={f} />{errors.passwordConfirm && <p className={e}>{errors.passwordConfirm.message}</p>}</div>
        <div>
          <label className={l}>Rolle *</label>
          <select {...register('role')} className={f}>
            <option value="">Auswählen...</option>
            <option value="Mitarbeiter">Mitarbeiter</option>
            <option value="Abteilungsleiter">Abteilungsleiter</option>
            <option value="Administrator">Administrator</option>
          </select>
          {errors.role && <p className={e}>{errors.role.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50">
          {isSubmitting ? 'Erstellen...' : 'Benutzer erstellen'}
        </button>
      </form>
    </div>
  );
}
