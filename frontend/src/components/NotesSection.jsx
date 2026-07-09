import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import api from '../services/api';

const NotesSection = ({ leadId, notes, onNotesChange, employees }) => {
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');
  const [error, setError] = useState(null);

  const [selectedUserId, setSelectedUserId] = useState(
    employees.length > 0 ? employees[0]._id : ''
  );

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      setError('Note cannot be empty');
      return;
    }
    
    setError(null);
    try {
      const payload = { note: newNote };
      if (selectedUserId) {
        payload.createdBy = selectedUserId;
      }

      const { data } = await api.post(`/lead/${leadId}/notes`, payload);
      onNotesChange([...notes, data]);
      setNewNote('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note._id);
    setEditNoteText(note.note);
  };

  const handleSaveEdit = async (noteId) => {
    if (!editNoteText.trim()) return;
    try {
      const { data } = await api.put(`/lead/${leadId}/notes/${noteId}`, {
        note: editNoteText,
      });
      onNotesChange(notes.map((n) => (n._id === noteId ? data : n)));
      setEditingNoteId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/lead/${leadId}/notes/${noteId}`);
      onNotesChange(notes.filter((n) => n._id !== noteId));
    } catch (err) {
      setError(err.message);
    }
  };

  React.useEffect(() => {
    if (employees.length > 0 && !selectedUserId) {
      setSelectedUserId(employees[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees]);

  return (
    <div className="notes-section">
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Notes</h3>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '8px', fontSize: '12px' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <textarea
          className="input"
          style={{ flex: '1 1 100%', resize: 'vertical', minHeight: '40px' }}
          placeholder="Add a new note..."
          value={newNote}
          onChange={(e) => { setNewNote(e.target.value); setError(null); }}
        />
        <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'flex-end' }}>
          {employees.length > 0 && (
            <select 
              className="select" 
              value={selectedUserId} 
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="">Select Author...</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.username}</option>
              ))}
            </select>
          )}
          <button
            className="btn btn-primary"
            onClick={handleAddNote}
          >
            Add Note
          </button>
        </div>
      </div>

      <div>
        {notes.length === 0 ? (
          <div className="empty-state">No Notes Available.</div>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="note-card">
              <div className="note-header">
                <span style={{ fontWeight: 600 }}>
                  {note.createdBy?.username || 'Unknown'}
                </span>
                <span>{format(new Date(note.createdAt), 'dd MMM yyyy, hh:mm a')}</span>
              </div>
              {editingNoteId === note._id ? (
                <div>
                  <textarea
                    className="input"
                    style={{ width: '100%', marginBottom: '8px' }}
                    value={editNoteText}
                    onChange={(e) => setEditNoteText(e.target.value)}
                  />
                  <div className="note-actions">
                    <button className="btn-icon" onClick={() => handleSaveEdit(note._id)} style={{ color: 'var(--secondary)' }}>
                      <Check size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => setEditingNoteId(null)} style={{ color: 'var(--text-muted)' }}>
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="note-text">{note.note}</div>
                  <div className="note-actions">
                    <button className="btn-icon" onClick={() => handleEditNote(note)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => handleDeleteNote(note._id)} style={{ color: 'var(--danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesSection;
