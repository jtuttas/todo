import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const qc = useQueryClient();

  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const deleteM = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setDeleteId(null); toast.success('Benutzer gelöscht'); },
    onError: () => toast.error('Fehler beim Löschen'),
  });

  const filtered = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Benutzerverwaltung</h1>
        <Link to="/admin/users/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary">
          <Plus className="w-4 h-4" /> Neuer Benutzer
        </Link>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suchen..." className="mb-4 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary" />
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Benutzername</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Rolle</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{u.username}</td>
                  <td className="px-4 py-3 text-gray-600">{u.role}</td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <Link to={`/admin/users/${u.id}/edit`} className="p-1 text-gray-400 hover:text-primary rounded"><Pencil className="w-4 h-4" /></Link>
                    {u.id !== currentUser?.id && (
                      <button onClick={() => setDeleteId(u.id)} className="p-1 text-gray-400 hover:text-accent rounded"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {deleteId !== null && <ConfirmDialog message="Benutzer wirklich löschen?" onConfirm={() => deleteM.mutate(deleteId!)} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
