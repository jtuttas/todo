import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, createProject, updateProject, deleteProject } from '../services/projectService';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ProjectsPage() {
  const qc = useQueryClient();
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: projects = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: getProjects });

  const inv = () => qc.invalidateQueries({ queryKey: ['projects'] });
  const createM = useMutation({ mutationFn: createProject, onSuccess: () => { inv(); setNewName(''); toast.success('Projekt erstellt'); }, onError: () => toast.error('Fehler') });
  const updateM = useMutation({ mutationFn: ({ id, name }: { id: number; name: string }) => updateProject(id, { name }), onSuccess: () => { inv(); setEditId(null); toast.success('Projekt aktualisiert'); }, onError: () => toast.error('Fehler') });
  const deleteM = useMutation({ mutationFn: deleteProject, onSuccess: () => { inv(); setDeleteId(null); toast.success('Projekt gelöscht'); }, onError: () => toast.error('Fehler') });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Projekte</h1>
      <div className="flex gap-2 mb-4">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Neues Projekt..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <button onClick={() => newName.trim() && createM.mutate({ name: newName.trim() })} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary">
          <Plus className="w-4 h-4" /> Hinzufügen
        </button>
      </div>
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl border divide-y">
          {projects.length === 0 && <p className="p-4 text-gray-400 text-sm text-center">Keine Projekte</p>}
          {projects.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3">
              {editId === p.id ? (
                <>
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                  <button onClick={() => updateM.mutate({ id: p.id, name: editName })} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setEditId(null)} className="p-1 text-gray-400 hover:bg-gray-50 rounded"><X className="w-4 h-4" /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-900">{p.name}</span>
                  <button onClick={() => { setEditId(p.id); setEditName(p.name); }} className="p-1 text-gray-400 hover:text-primary hover:bg-gray-50 rounded"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(p.id)} className="p-1 text-gray-400 hover:text-accent hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {deleteId !== null && <ConfirmDialog message="Projekt wirklich löschen?" onConfirm={() => deleteM.mutate(deleteId!)} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
