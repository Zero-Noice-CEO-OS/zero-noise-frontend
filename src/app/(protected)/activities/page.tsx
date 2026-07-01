'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, Filter } from 'lucide-react'
import Modal from '@/components/Modal'

const sampleActivities = [
  { id: 1, title: 'Strategic Planning', category: 'Strategy', duration: 90, value: 9 },
  { id: 2, title: 'Client Meeting', category: 'Operations', duration: 60, value: 7 },
  { id: 3, title: 'Product Design', category: 'Learning', duration: 75, value: 8 },
  { id: 4, title: 'Team Standup', category: 'Operations', duration: 30, value: 6 },
  { id: 5, title: 'Deep Research', category: 'Learning', duration: 120, value: 9 },
]

export default function Activities() {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[30px] font-bold">Activities</h1>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2"><Filter size={16} strokeWidth={1.5} /> Filter</button>
          <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2"><Plus size={18} strokeWidth={1.5} /> Add Activity</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-light dark:bg-gray-800">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">Title</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">Category</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">Duration</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-text-muted">Value</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleActivities.map(a => (
              <tr key={a.id} className="border-t border-border-light dark:border-border-dark hover:bg-surface-light/50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 font-medium">{a.title}</td>
                <td className="px-6 py-4 text-text-muted">{a.category}</td>
                <td className="px-6 py-4">{a.duration} min</td>
                <td className="px-6 py-4"><span className="text-success font-semibold">{a.value}/10</span></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setEditOpen(true)} className="p-1.5 hover:bg-surface-light dark:hover:bg-gray-700 rounded transition-colors"><Pencil size={16} strokeWidth={1.5} className="text-text-muted" /></button>
                  <button onClick={() => setDeleteOpen(true)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors ml-1"><Trash2 size={16} strokeWidth={1.5} className="text-destructive" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={addOpen || editOpen} onClose={() => { setAddOpen(false); setEditOpen(false) }} title={editOpen ? 'Edit Activity' : 'Add Activity'}>
        <form className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Title</label><input className="input-field" placeholder="Activity name" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Category</label><select className="input-field"><option>Strategy</option><option>Operations</option><option>Learning</option><option>Health</option></select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Duration (min)</label><input type="number" className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Value (1-10)</label><input type="number" className="input-field" min="1" max="10" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setAddOpen(false); setEditOpen(false) }} className="btn-secondary">Cancel</button>
            <button type="button" onClick={() => { setAddOpen(false); setEditOpen(false) }} className="btn-primary">Save</button>
          </div>
        </form>
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Activity">
        <div className="space-y-4">
          <p className="text-sm text-text-muted">Are you sure you want to delete this activity? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => setDeleteOpen(false)} className="btn-destructive">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
