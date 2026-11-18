import React from 'react';

function NoteItem({ note, onEdit, onDelete }) {
  return (
    <div className="note-card">
      <div className="note-card-title">{note.title}</div>
      {note.content && (
        <div className="note-card-content">{note.content}</div>
      )}
      <div className="note-card-footer">
        <span className="note-date">Created on {note.createdAt}</span>
        <div className="note-actions">
          <button
            className="btn btn-secondary btn-small"
            onClick={() => onEdit(note)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-small"
            onClick={() => onDelete(note.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteItem;
