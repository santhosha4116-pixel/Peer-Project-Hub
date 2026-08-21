# Peer Project Hub

A beginner-friendly MERN stack college assessment project.

## Features

- Firebase Email + Password signup/login
- Create, read, update and delete own projects
- Project feed with newest projects first
- Search by title, description or tags
- Pagination
- Comments/reviews
- 1–5 star rating
- Bookmarks/favorites
- Responsive Tailwind CSS UI
- Express REST API
- MongoDB + Mongoose
- Firebase token verification on the backend

## Tech Stack

Frontend: React + Vite + Tailwind CSS + React Router + Axios  
Backend: Node.js + Express + MongoDB + Mongoose  
Authentication: Firebase Authentication

## 1. Install

From the root folder:

```bash
npm install
npm run install-all
```

## 2. Firebase setup

Create a Firebase project.

Enable:
Authentication -> Sign-in method -> Email/Password.

Create a Web App and copy its configuration into:

`client/.env`

Use the keys shown in `client/.env.example`.

Create a Firebase service account for the backend and put its credentials in `server/.env`.
For a simple college project, the easiest method is to use the service account JSON values as environment variables.

## 3. MongoDB

Create a MongoDB Atlas database and put the connection string in:

`server/.env`

## 4. Run

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Simple project flow

1. User creates a Firebase account.
2. React gets the Firebase ID token.
3. Axios sends that token to Express.
4. Express verifies the token with Firebase Admin.
5. Express uses the Firebase UID to identify the user.
6. MongoDB stores projects, comments and bookmarks.

## Important API routes

### Projects
GET `/api/projects`
GET `/api/projects/:id`
POST `/api/projects`
PUT `/api/projects/:id`
DELETE `/api/projects/:id`

### Comments
GET `/api/projects/:id/comments`
POST `/api/projects/:id/comments`
DELETE `/api/comments/:commentId`

### Bookmarks
GET `/api/bookmarks`
POST `/api/bookmarks/:projectId`
DELETE `/api/bookmarks/:projectId`

## Beginner explanation

Firebase handles passwords and login.  
MongoDB stores application data.  
Express protects API routes and talks to MongoDB.  
React displays the data and sends requests with Axios.

This project intentionally avoids Redux and other advanced patterns so a fresher can explain it clearly in a college viva.
