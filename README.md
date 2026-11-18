# Notes App

A simple, functional note-taking web application built with React and Vite. It allows users to register, log in, and manage their personal notes with complete privacy.

## GitHub Repository

- **Repository**: https://github.com/tusharinqueue/infraAssignment

## Features

- **User Authentication**:
  - Sign up with email and password.
  - Log in with existing credentials.
  - Form validation (checks for valid email format, passwords match, and minimum password length of 6 characters).
  - Clear error messages if credentials don't match or fields are missing.
- **Privacy & User Isolation**:
  - Notes are tied directly to the user who created them (`userId`).
  - Users can only view, edit, search, and delete their own notes.
  - When a user logs out, their notes are removed from the active view.
- **Full Notes CRUD**:
  - **Create**: Add new notes with a title and optional description/content.
  - **Read**: View notes in reverse chronological order with creation dates.
  - **Update**: Edit note title and content in a focused popup modal.
  - **Delete**: Remove notes with a browser confirmation prompt to avoid accidental deletion.
- **Search & Filtering**:
  - Quick client-side search bar to filter notes by title or content keywords in real-time.
- **Clean & Functional UI**:
  - Distraction-free, responsive layout.
  - Minimal CSS styling.

## Tech Stack

- **Frontend Library**: React (v18)
- **Tooling & Dev Server**: Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Plain CSS
- **Data Persistence**: Browser `localStorage`

## Project Structure

```text
assignment/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── README.md               # Setup and documentation
└── src/
    ├── main.jsx            # Application bootstrap
    ├── App.jsx             # Main logic (auth state, note CRUD, routing)
    ├── index.css           # Minimal styles
    └── components/
        ├── Navbar.jsx      # Navigation bar with user greeting and logout
        ├── NoteItem.jsx    # Card representing an individual note
        └── EditModal.jsx   # Modal for editing an existing note
```

## Getting Started Locally

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18 or newer recommended).

### 1. Clone the repository

```bash
git clone https://github.com/tusharinqueue/infraAssignment.git
cd infraAssignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL shown in your terminal (usually `http://localhost:5173`) in your browser.

### 4. Build for Production

```bash
npm run build
```

## Testing User Isolation (Multi-User Test)

You can verify that user notes are strictly isolated:

1. Click **Sign up here** and register an account (e.g., `alice@example.com` / `password123`).
2. Add a couple of notes (e.g., "Alice's First Note").
3. Click **Log Out** in the top navigation.
4. Click **Sign up here** and create a second account (e.g., `bob@example.com` / `password123`).
5. Notice that Bob's notes list is completely empty.
6. Create a note as Bob (e.g., "Bob's Secret Note").
7. Log out and log back in as `alice@example.com` — you will only see Alice's notes, and Bob's note will not be visible.
