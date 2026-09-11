# HireTrack Frontend

A modern React-based frontend application for the HireTrack Applicant Tracking & Recruitment Management System. The application provides role-based access for Recruiters, Interviewers, and Administrators to efficiently manage job postings, candidate pipelines, interview scheduling, feedback submissions, and recruitment analytics through a clean and responsive user interface.

---

## Features

### Authentication
- JWT-based Authentication
- Role-Based Authorization (Admin, Recruiter, Interviewer)
- Protected Routes
- Secure Logout & Token Management

### Recruiter Module
- Recruiter Dashboard & Analytics
- Job Opening Management (Create, Update, Change Status)
- Candidate Management & Pipeline Tracking
- Resume Upload & Attachment Management
- Interview Scheduling & Rescheduling
- Candidate Stage Progression

### Interviewer Module
- Interviewer Dashboard Overview
- My Scheduled Interviews List
- Complete & Cancel Interview Actions
- Submit Candidate Feedback & Hiring Recommendations (Select, Hold, Reject)
- View Historical Candidate Feedbacks

### Administrator Module
- Comprehensive Dashboard Analytics
- User Management
- Job & Candidate Oversight
- Interview & Feedback Monitoring
- System-wide Metrics Overview

---

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM (v7)
- Redux Toolkit
- RTK Query
- Chakra UI (v2)
- Framer Motion
- Recharts
- React Icons
- React Hook Form & Zod Validation
- Axios

### State Management
- Redux Toolkit
- RTK Query

### Styling
- Chakra UI
- Responsive Design
- Reusable Design System Components & Custom Tokens

---

## Project Structure

```text
src
│
├── api
│   ├── api.js
│   ├── authApi.js
│   ├── candidatesApi.js
│   ├── dashboardApi.js
│   ├── feedbackApi.js
│   ├── interviewApi.js
│   └── jobsApi.js
│
├── components
│   │
│   ├── candidates
│   │   ├── AddCandidateModal.jsx
│   │   ├── CandidateCard.jsx
│   │   ├── CandidateStatusBadge.jsx
│   │   ├── CandidateStatusMenu.jsx
│   │   ├── StageCard.jsx
│   │   └── UploadResumeModal.jsx
│   │
│   ├── common
│   │   └── Pagination.jsx
│   │
│   ├── dashboard
│   │   └── DashboardCard.jsx
│   │
│   ├── feedback
│   │   ├── FeekbackBadge.jsx
│   │   └── SubmitFeedbackModal.jsx
│   │
│   ├── interview
│   │   ├── InterviewCard.jsx
│   │   ├── InterviewStatusBadge.jsx
│   │   └── RescheduleInterviewModal.jsx
│   │
│   ├── interviews
│   │   └── ScheduleInterviewModal.jsx
│   │
│   ├── jobs
│   │   ├── CreateJobModal.jsx
│   │   └── StatusBadge.jsx
│   │
│   └── layout
│       └── TopNav.jsx
│
├── pages
│   ├── CandidatesPage.jsx
│   ├── DashboardPage.jsx
│   ├── InterviewsPage.jsx
│   ├── JobsPage.jsx
│   ├── LoginPage.jsx
│   └── MyInterviewsPage.jsx
│
├── routes
│   └── ProtectedRoute.jsx
│
├── store
│   └── store.js
│
├── theme.js
├── App.jsx
└── main.jsx
```

---

## Installation

### Clone Repository

```bash
git clone <frontend-repository-url>
cd hiretrack-frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_BASE_URL=http://localhost:8080
```

Example:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Available Scripts

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## User Roles

### Recruiter

```text
Dashboard
Jobs Management
Candidates Pipeline
Interviews Management
```

### Interviewer

```text
Dashboard
My Scheduled Interviews
Submit Feedback
```

### Administrator

```text
Dashboard
Jobs Management
Candidates Management
Interviews Overview
User Management
```

---

## Reusable Components

### DashboardCard

Used for dashboard KPI metrics.

Examples:

```text
Total Jobs
Open Jobs
Candidates in Pipeline
Interviews This Week
Pending Feedback
```

---

### CandidateStatusBadge & StatusBadge

Supported statuses:

```text
APPLIED
SHORTLISTED
INTERVIEW_SCHEDULED
SELECTED
REJECTED
OPEN
ON_HOLD
CLOSED
SCHEDULED
RESCHEDULED
CANCELLED
COMPLETED
```

---

### FeedbackBadge

Supported recommendations:

```text
SELECT
HOLD
REJECT
PENDING
```

---

### Dialogs & Modals

Used across the application for:

```text
Add Candidate
Upload Resume
Create Job Opening
Schedule Interview
Reschedule Interview
Submit Feedback
```

---

## Dashboard Analytics

The dashboard includes:

- KPI Metrics (Total Jobs, Open Jobs, Candidates in Pipeline, Weekly Interviews, Pending Feedback)
- Role-based Quick Actions
- Candidate Pipeline Metrics
- Interview Schedule Overview
- Real-time Data from Backend APIs

---

## Backend Dependency

This frontend application depends on the HireTrack System Backend API.

Required backend modules:

```text
Authentication
Jobs
Candidates
Interviews
Feedback
Dashboard
Users
```

Ensure the backend server is running before accessing the frontend application.

---

## Recording




https://github.com/user-attachments/assets/6f0c0d52-95c0-40b3-abd9-1caebbf4e8a7






---

## Author

**Vishnu Divakar**

HireTrack Frontend developed using:

- React 19
- Redux Toolkit
- RTK Query
- Chakra UI
- Recharts
- Framer Motion
- Vite

---

## License

This project is intended for educational and learning purposes.

