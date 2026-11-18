import React, { useState } from 'react';

function EditModal({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    onSave({
      ...note,
      title: title.trim(),
      content: content.trim()
    });
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-window">
        <div className="modal-header">
          <h3>Edit Note</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Note Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title..."
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Note Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Content..."
              rows={4}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
