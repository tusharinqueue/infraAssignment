import React from 'react';

function Navbar({ userEmail, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Notes App</div>
      {userEmail && (
        <div className="navbar-user">
          <span className="user-email">{userEmail}</span>
          <button className="btn btn-secondary btn-small" onClick={onLogout}>
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
