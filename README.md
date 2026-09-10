```markdown
# HireTrack Frontend

A modern React-based frontend application for the HireTrack Recruitment Platform. The application provides role-based access for Admins, Recruiters, and Interviewers to efficiently manage jobs, candidates, interviews, and feedback through a clean, responsive, and enterprise-grade user interface.

---

## Features

### Authentication
- JWT-based Authentication
- Role-Based Authorization (ADMIN, RECRUITER, INTERVIEWER)
- Protected Routes with Route Guards
- Secure Logout with Token Clearance

### Admin Module
- Organization-wide Dashboard Analytics
- User Management
- All Jobs & Candidates Overview
- System Reports & Audit Logs

### Recruiter Module
- Recruiter Dashboard with Pipeline Metrics
- Job Management (Create, Edit, Update Status)
- Candidate Pipeline Management
- Interview Scheduling with Conflict Prevention
- Feedback Review & Hiring Decisions

### Interviewer Module
- Personal Dashboard with Assigned Interviews
- My Interviews View (Upcoming & Past)
- Mark Interviews as Complete
- Submit Structured Feedback (Ratings + Recommendations)

---

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM v6
- Redux Toolkit
- RTK Query
- Chakra UI 2.8
- Recharts
- React Hook Form + Zod

### State Management
- Redux Toolkit (Auth + UI State)
- RTK Query (API Caching + Auto Refetch)

### Styling
- Chakra UI Component System
- Responsive Design (Mobile → Desktop)
- Glass-morphism Design Tokens
- Reusable Component Library

---

## Project Structure

```text
src
│
├── api
│   │
│   ├── api.js                    # Root API config + JWT interceptor
│   ├── auth/authApi.js           # Login endpoint
│   ├── dashboard/dashboardApi.js # Dashboard stats
│   ├── jobs/jobsApi.js           # Jobs CRUD + status updates
│   ├── candidates/candidatesApi.js # Candidates + resume upload
│   ├── interviews/interviewsApi.js # Interviews + scheduling + reschedule
│   └── feedback/feedbackApi.js   # Feedback submission + retrieval
│
├── components
│   │
│   ├── common
│   │   ├── StatusBadge.jsx       # Reusable status indicator
│   │   ├── Pagination.jsx        # Server-side pagination
│   │   └── ConfirmDialog.jsx     # Reusable confirmation modal
│   │
│   ├── layout
│   │   ├── TopNav.jsx            # Role-aware navigation bar
│   │   └── ProtectedRoute.jsx    # Auth + role validation
│   │
│   ├── jobs
│   │   ├── CreateJobModal.jsx    # Job creation form
│   │   └── StatusDropdown.jsx    # Inline status changer
│   │
│   ├── candidates
│   │   ├── AddCandidateModal.jsx # Candidate creation form
│   │   ├── UploadResumeModal.jsx # File upload with progress
│   │   ├── CandidateStatusMenu.jsx # Status change dropdown
│   │   └── CandidateCard.jsx     # Pipeline card view
│   │
│   ├── interviews
│   │   ├── ScheduleInterviewModal.jsx # Scheduling form
│   │   ├── RescheduleInterviewModal.jsx # Reschedule form
│   │   └── InterviewCard.jsx     # Interview list item
│   │
│   └── feedback
│       └── SubmitFeedbackModal.jsx # Rating + recommendation form
│
├── pages
│   │
│   ├── auth
│   │   └── LoginPage.jsx         # Authentication screen
│   │
│   ├── dashboard
│   │   └── DashboardPage.jsx     # Role-adaptive dashboard
│   │
│   ├── jobs
│   │   └── JobsPage.jsx          # Jobs list + filters + create
│   │
│   ├── candidates
│   │   └── CandidatesPage.jsx    # Pipeline view + add/upload
│   │
│   ├── interviews
│   │   ├── InterviewsPage.jsx    # All interviews (Admin/Recruiter)
│   │   └── MyInterviewsPage.jsx  # Assigned interviews (Interviewer)
│   │
│   └── feedback
│       └── FeedbackPage.jsx      # Feedback history view
│
├── routes
│   └── AppRoutes.jsx             # Centralized route configuration
│
├── store
│   │
│   ├── store.js                  # Redux store + auth slice
│   └── selectors.js              # Reusable state selectors
│
├── utils
│   ├── formatters.js             # Date/number formatters
│   └── validators.js             # Shared validation logic
│
├── theme.js                      # Chakra UI theme configuration
├── App.jsx                       # Main router + layout wrapper
└── main.jsx                      # Entry point + providers
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/HireTrackFrontend.git
cd HireTrackFrontend
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

### Administrator

```text
Dashboard (Org-wide metrics)
Jobs Management
Candidates Management
Interviews Management
User Management
System Reports
```

### Recruiter

```text
Dashboard (Pipeline metrics)
Jobs Management (Create/Edit/Status)
Candidates Management (Add/Upload/Status)
Interview Scheduling
Feedback Review
```

### Interviewer

```text
Dashboard (Personal metrics)
My Interviews (View/Complete)
Submit Feedback
Profile Management
```

---

## Reusable Components

### StatusBadge

Supported statuses across modules:

```text
Jobs: OPEN, ON_HOLD, CLOSED
Candidates: APPLIED, SHORTLISTED, INTERVIEW_SCHEDULED, SELECTED, REJECTED
Interviews: SCHEDULED, RESCHEDULED, CANCELLED, COMPLETED
Feedback: SELECT, HOLD, REJECT, PENDING
```

### CustomTable

Reusable table component supporting:

- Server-side Pagination
- Search + Filter Integration
- Loading + Empty States
- Role-based Action Columns
- Click-to-navigate Rows

### ConfirmDialog

Used across the application for:

```text
Cancel Interview
Delete Job
Reject Candidate
Reschedule Session
Remove User
```

### GlassCard

Base card component with:

- Backdrop blur effect
- Subtle border + shadow
- Hover lift animation
- Responsive padding

---

## Dashboard Analytics

The dashboard includes role-scoped metrics:

- **Admin**: Total Users, Org-wide Jobs, Pipeline Health, System Activity
- **Recruiter**: My Open Jobs, Candidates in Pipeline, Upcoming Interviews, Pending Feedback
- **Interviewer**: Assigned Interviews, Completed Sessions, Feedback Submissions

Visualizations powered by **Recharts**:
- Bar charts for status distribution
- Line charts for hiring velocity
- Funnel charts for pipeline progression

---

## Backend Dependency

This frontend application depends on the HireTrack Backend API.

Required backend modules:

```text
Authentication (/auth/login)
Dashboard (/dashboard)
Jobs (/jobs)
Candidates (/candidates)
Interviews (/interviews, /interviews/my)
Feedback (/interviews/{id}/feedback)
```

Ensure the backend server is running at `http://localhost:8080` before accessing the frontend.

### CORS Configuration

For local development, ensure backend CORS allows:
```java
config.addAllowedOrigin("http://localhost:5173");
config.addAllowedOrigin("http://localhost:5174");
```

---

## Demo Credentials

```text
Admin:       admin@test.com       / password123
Recruiter:   recruiter@test.com   / password123
Interviewer: interviewer@test.com / password123
```

---

## Recording

[![HireTrack Demo](https://img.shields.io/badge/Demo-Video-00A86B?style=flat)](https://github.com/user-attachments/assets/your-video-link)

---

## Author

**Vishnu Divakar**

HireTrack Frontend developed using:

- React 18
- Redux Toolkit
- RTK Query
- Chakra UI 2.8
- Recharts
- Vite

---

## License

MIT © Vishnu Divakar

```
