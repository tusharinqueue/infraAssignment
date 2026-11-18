import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NoteItem from './components/NoteItem';
import EditModal from './components/EditModal';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [noteError, setNoteError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        setCurrentUser(userObj);
        loadUserNotes(userObj.id);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  function loadUserNotes(userId) {
    const storedNotes = JSON.parse(localStorage.getItem('notes_db') || '[]');
    const userNotes = storedNotes.filter(item => item.userId === userId);
    setNotes(userNotes);
  }

  function handleLogin(e) {
    e.preventDefault();
    setAuthError('');

    if (!email.trim() || !password) {
      setAuthError('Please fill in both email and password.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!foundUser) {
      setAuthError('Invalid email or password.');
      return;
    }

    const userSession = { id: foundUser.id, email: foundUser.email };
    setCurrentUser(userSession);
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    loadUserNotes(userSession.id);

    setEmail('');
    setPassword('');
  }

  function handleSignup(e) {
    e.preventDefault();
    setAuthError('');

    if (!email.trim() || !password) {
      setAuthError('All fields are required.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    const alreadyExists = users.some(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (alreadyExists) {
      setAuthError('An account with this email already exists.');
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      email: email.trim(),
      password: password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users_db', JSON.stringify(users));

    const userSession = { id: newUser.id, email: newUser.email };
    setCurrentUser(userSession);
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    loadUserNotes(userSession.id);

    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  function handleLogout() {
    setCurrentUser(null);
    setNotes([]);
    setSearchQuery('');
    localStorage.removeItem('currentUser');
  }

  function handleAddNote(e) {
    e.preventDefault();
    setNoteError('');

    if (!newTitle.trim()) {
      setNoteError('Please enter a note title.');
      return;
    }

    const newNote = {
      id: 'note_' + Date.now(),
      userId: currentUser.id,
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    const allNotes = JSON.parse(localStorage.getItem('notes_db') || '[]');
    allNotes.unshift(newNote);
    localStorage.setItem('notes_db', JSON.stringify(allNotes));

    setNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
  }

  function handleSaveEdit(updatedNote) {
    const allNotes = JSON.parse(localStorage.getItem('notes_db') || '[]');
    const updatedAllNotes = allNotes.map(item => {
      if (item.id === updatedNote.id && item.userId === currentUser.id) {
        return {
          ...item,
          title: updatedNote.title,
          content: updatedNote.content
        };
      }
      return item;
    });

    localStorage.setItem('notes_db', JSON.stringify(updatedAllNotes));
    loadUserNotes(currentUser.id);
    setEditingNote(null);
  }

  function handleDeleteNote(noteId) {
    const userConfirmed = window.confirm('Are you sure you want to delete this note?');
    if (!userConfirmed) return;

    const allNotes = JSON.parse(localStorage.getItem('notes_db') || '[]');
    const remainingNotes = allNotes.filter(
      item => !(item.id === noteId && item.userId === currentUser.id)
    );

    localStorage.setItem('notes_db', JSON.stringify(remainingNotes));
    setNotes(notes.filter(item => item.id !== noteId));
  }

  const displayedNotes = notes.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q)
    );
  });

  if (!currentUser) {
    return (
      <div>
        <Navbar />

        <div className="auth-wrapper">
          <div className="auth-box">
            <h2>{isLoginView ? 'Welcome Back' : 'Create an Account'}</h2>
            <p className="auth-subtitle">
              {isLoginView
                ? 'Log in to view and manage your notes'
                : 'Sign up to start writing and saving notes'}
            </p>

            {authError && <div className="alert alert-error">{authError}</div>}

            <form onSubmit={isLoginView ? handleLogin : handleSignup}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>

              {!isLoginView && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full">
                {isLoginView ? 'Log In' : 'Sign Up'}
              </button>
            </form>

            <div className="auth-toggle">
              {isLoginView ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setIsLoginView(false);
                      setAuthError('');
                    }}
                  >
                    Sign up here
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setIsLoginView(true);
                      setAuthError('');
                    }}
                  >
                    Log in here
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar userEmail={currentUser.email} onLogout={handleLogout} />

      <main className="container">
        <div className="create-note-box">
          <h3>Create a Note</h3>
          {noteError && <div className="alert alert-error">{noteError}</div>}
          <form onSubmit={handleAddNote}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Note title (e.g., Shopping List, Project Ideas)"
              />
            </div>

            <div className="form-group">
              <label>Description / Content</label>
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Write your note details here..."
                rows={3}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Note
            </button>
          </form>
        </div>

        <div className="notes-toolbar">
          <div className="notes-heading">
            <h2>Your Notes</h2>
            <span className="notes-counter">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
            </span>
          </div>

          {notes.length > 0 && (
            <div className="search-wrap">
              <input
                type="text"
                className="search-input"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="empty-message">
            <p>You haven't written any notes yet.</p>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>
              Fill in the form above and click "Save Note" to create one.
            </span>
          </div>
        ) : displayedNotes.length === 0 ? (
          <div className="empty-message">
            <p>No notes matched "{searchQuery}"</p>
          </div>
        ) : (
          <div className="notes-grid">
            {displayedNotes.map(item => (
              <NoteItem
                key={item.id}
                note={item}
                onEdit={setEditingNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </main>

      {editingNote && (
        <EditModal
          note={editingNote}
          onSave={handleSaveEdit}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
}

export default App;
