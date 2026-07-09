# AI-Powered CRM (Lead Management System)

A modern CRM (Customer Relationship Management) application built to manage leads efficiently with AI-assisted features, dashboard analytics, lead tracking, follow-up management, activity timeline, and automation.

## Features

- Dashboard with CRM analytics
- Lead Management (Create, View, Edit, Delete)
- Employee Management
- Lead Search
- Quick & Advanced Filters
- Pagination
- Lead Activity Timeline
- Stage & Sub-Stage Management
- Follow-up Tracking
- Dashboard Charts
- AI-assisted Lead Information Extraction (Bonus)
- Automated Follow-up Reminder
- Responsive UI

---

# Tech Stack

## Frontend

- React.js
- React Router
- Axios
- CSS
- Recharts
- Lucide React

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Automation

- Node Cron

---

# Project Structure

```
project-root
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   ├── utils
│   └── package.json
│
└── README.md
```

---

# Prerequisites

Make sure the following are installed:

- Node.js (v18 or above)
- npm
- MongoDB (Local or MongoDB Atlas)
- Git

---

# Installation

## 1. Clone the Repository

```bash
git clone <repository-url>
```

```bash
cd <project-folder>
```

---

## 2. Install Backend Dependencies

```bash
cd backend
```

```bash
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd ../frontend
```

```bash
npm install
```

---

# Environment Variables

Create a `.env` file inside the **backend** folder.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

Update the values according to your environment.

---

# Running the Backend

Open a terminal.

```bash
cd backend
```

Development

```bash
npm run dev
```

or

```bash
npm start
```

Backend runs on

```
http://localhost:5000
```

---

# Running the Frontend

Open another terminal.

```bash
cd frontend
```

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# Automation

This project includes an automated follow-up reminder system.

- Runs using **node-cron**
- Automatically checks overdue follow-ups
- Marks overdue leads
- Updates the activity timeline
- Displays overdue reminders within the CRM

---

# Dashboard

The dashboard provides:

- Total Leads
- New Leads Today
- New Leads This Week
- Converted Leads
- Pending Follow-ups
- Leads by Status Chart
- Leads by Source Chart

---

# Lead Management

Users can:

- Create Lead
- View Lead
- Edit Lead
- Delete Lead
- Manage Follow-ups
- Track Lead Status
- Update Stage & Sub-Stage
- View Activity Timeline

---

# AI Features

The CRM includes AI-assisted capabilities to improve productivity.

Examples:

- Extract lead details from unstructured text
- Auto-fill lead forms
- Generate structured lead information
- Reduce manual data entry

Users can review and edit extracted information before saving.

---

# API Base URL

```
http://localhost:5000/api
```

---

# Available Scripts

Backend

```bash
npm install
npm run dev
npm start
```

Frontend

```bash
npm install
npm run dev
npm run build
```

---

# Future Improvements

Some planned enhancements include:

- Email Notifications
- Browser Notifications
- CSV Export
- Bulk Actions
- Authentication & Role Management
- Advanced AI Suggestions
- Mobile Responsive Improvements

---

# Notes

- The project is developed using React, Express.js, MongoDB, and Node.js.
- The architecture follows a modular structure for easy maintenance.
- Existing components are reused wherever possible to keep the code clean and scalable.

---

# Author

**Dharaneesh S**

Full Stack Developer
