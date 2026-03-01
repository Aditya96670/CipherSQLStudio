# CipherSQLStudio

##  Overview
CipherSQLStudio is a browser-based SQL learning platform where users can practice SQL queries against pre-configured assignments with real-time execution and AI-powered hints.

This platform is designed to simulate a real SQL sandbox experience while ensuring security and guided learning.

---

##  Features

- Assignment Listing Page (difficulty, title, description)
- SQL Editor (Monaco Editor)
- Real-time query execution (PostgreSQL)
- AI-powered hint generation (Gemini API)
- Query validation & sanitization (only SELECT allowed)
- Responsive mobile-first UI (SCSS)

---

## Tech Stack

### Frontend
- React.js
- SCSS (mobile-first, BEM naming)
- Monaco Editor

### Backend
- Node.js
- Express.js
- PostgreSQL (Sandbox DB)
- MongoDB (User attempts persistence)
- Gemini LLM API

---

## Folder Structure

```
CipherSQLStudio/
 ├── client/
 ├── server/
 ├── .env.example
 └── README.md
```

---

##  Setup Instructions

###  Clone Repository

```
git clone <your-repo-link>
cd CipherSQLStudio
```

###  Install Dependencies

For backend:

```
cd server
npm install
```

For frontend:

```
cd client
npm install
```

###  Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```
PORT=
MONGO_URI=
POSTGRES_URI=
GEMINI_API_KEY=
```

###  Run Project

Start backend:

```
npm run dev
```

Start frontend:

```
npm run dev
```

---

## Security Measures

- Only SELECT queries allowed
- Query sanitization implemented
- Environment variables protected using `.env`
- AI prompt engineered to provide hints only (not full solutions)

---

## LLM Prompt Strategy

The Gemini API is instructed to:
- Provide guidance
- Avoid revealing full SQL solutions
- Encourage logical thinking

---

## Data Flow (High-Level)

User → React → Express API → PostgreSQL → Response → React State Update → UI Render

Hint Flow:
User → Express → Gemini API → Hint Response → UI Update

---

## Responsive Design

- Mobile-first approach
- SCSS variables, mixins, nesting
- Breakpoints: 320px, 641px, 1024px, 1281px