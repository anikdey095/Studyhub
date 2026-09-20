<div align="center">

# 🎓 StudyHub — Next-Gen Academic Collaboration Platform

**An enterprise-grade, peer-to-peer university learning hub, study material repository, and career gateway.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Features](#-key-features) • [University Departments](#-university-departments) • [Course Creation](#-dynamic-course-creation) • [Admin Hub](#-admin-management-hub) • [Tech Stack](#-tech-stack--architecture) • [Getting Started](#-getting-started) • [API Reference](#-api-reference)

---

</div>

## 🌟 Overview

**StudyHub** connects university scholars, researchers, and students across disciplines into a unified collaborative ecosystem. Built with a high-performance **Next.js 14** frontend and a fault-tolerant **Express.js + Prisma ORM + PostgreSQL** backend, StudyHub enables instant academic knowledge exchange, verified study material sharing, student career discovery, and research preprint publishing.

---

## 🚀 Key Features

### 1. 📚 Academic Study Notes & Syllabus Repository
- **Instant Document Downloads & Clean PDF Rendering**: Download verified lecture summaries, cheat sheets, and past question solutions directly to your device or view instant client-side generated PDFs.
- **Smart Filtering & Search**: Instant full-text search across titles, summaries, tags, and course codes with real-time sorting by popularity, highest ratings, and recent submissions.
- **Rich Multi-format Uploads**: Upload notes from your local machine, phone gallery, or link external resources with file format validation (`.pdf`, `.docx`, `.png`, `.jpg`).

### 2. 🏛️ Official University Departments
Tailored for modern academic disciplines with dedicated course directories:
- **Computer Science & Engineering (CSE)**
- **Software Engineering (SWE)**
- **English (ENG)**
- **Electrical Engineering (EEE)**
- **Economics (ECO)**
- **Data Science (DS)**

### 3. ✍️ Dynamic Course Creation for Every Student
- **No Friction Uploads**: Any user uploading study material can either select from existing university courses or click **"+ Add New Course"** to type their custom course code and course title (e.g. `SWE 312: Software Testing & QA`).
- **Automatic Catalog Registration**: When a student introduces a new course, it is automatically cataloged under that department so that other students can immediately discover and select it for future uploads.

### 4. 🛡️ Dynamic Admin Management Hub (`/admin`)
- **Master Passkey Gateway**: Protected by passkey authentication (`admin123`) or verified `admin` role accounts.
- **Live Department Administration**: Admins can add new university departments (Name, Short Code, Description) and delete faculties in real-time.
- **Live Course Registration**: Admins can register official curriculum courses under any department.
- **Career & Tuition Management**: Post and manage undergraduate jobs, private home tutoring requests, and industry internships.
- **Research Preprints Publication**: Publish academic research papers with DOI, citation tracking, author metadata, and preprint links.

### 5. 💼 Career, Tuition & Internship Gateway (`/jobs`)
- **Local & Remote Tuitions**: Discover private home tutoring offers and peer mentorship sessions with transparent monthly pay and class level info (e.g. HSC, O-Levels, SSC, University C++/DSA).
- **Tech Jobs & Internships**: Explore summer research internships and software engineering roles.

### 6. 🔬 Academic Research & Preprints Portal (`/research`)
- Read cutting-edge student and faculty preprints in AI, Quantum Computing, Distributed Systems, and Biotechnology with integrated DOI links.

### 7. 👤 Student Profiles & Peer Network (`/profile`, `/network`)
- Academic portfolio showcase, customizable university department/major, student ID, bio, research links, GitHub, and LinkedIn profiles.

---

## 🏛️ University Departments

StudyHub comes pre-configured with the following academic faculties and curated course catalogs:

| Department | Code | Core Curriculum Courses Highlight |
| :--- | :---: | :--- |
| **Computer Science & Engineering** | `CSE` | CSE 110: Programming I, CSE 220: Data Structures & Algorithms, CSE 321: Operating Systems, CSE 420: Compiler Design, CSE 422: Artificial Intelligence |
| **Software Engineering** | `SWE` | SWE 121: OOP & Java, SWE 221: SE Methodologies, SWE 311: Software Architecture, SWE 322: SQA & Testing, SWE 421: DevOps & Cloud |
| **English** | `ENG` | ENG 101: Academic English, ENG 102: Composition & Rhetoric, ENG 201: Public Speaking, ENG 301: Literary Theory, ENG 401: Advanced Stylistics |
| **Electrical Engineering** | `EEE` | EEE 101: Circuit Analysis I, EEE 201: Analog Electronics, EEE 205: Digital Logic, EEE 301: Signals & Systems, EEE 401: Power Systems |
| **Economics** | `ECO` | ECO 101: Microeconomics, ECO 102: Macroeconomics, ECO 201: Intermediate Micro, ECO 301: Econometrics, ECO 401: International Trade |
| **Data Science** | `DS` | DS 101: Data Science with Python, DS 201: Applied Probability, DS 301: Machine Learning, DS 311: Big Data Engineering, DS 401: Deep Learning |

---

## 💡 Dynamic Course Creation

Uploading notes for a brand new course? StudyHub makes it effortless:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Select Department: [ Software Engineering          ▼ ]   │
│ 2. Course:            [ + Add New Course                ]   │
│ 3. Type New Course:   [ SWE 415: Microservices Patterns ]   │
│ 4. Attach PDF & Click [ Upload Material                 ]   │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
        ✨ Course is immediately created in the system!
           Other users can now see & select it too.
```

---

## 🛠️ Tech Stack & Architecture

```
StudyHub System Architecture
├── Client (Next.js 14 App Router)
│   ├── / (Landing Page with University Disciplines & Highlights)
│   ├── /study (Repository with Dynamic Filters & Course Creator)
│   ├── /admin (Admin Control Center for Departments, Jobs & Papers)
│   ├── /jobs (Tuition, Home Tutoring, Internships & Jobs)
│   ├── /research (Academic Research Preprints)
│   ├── /network & /profile (Student Directory & Portfolios)
│   └── /login & /signup (JWT Auth & Role Gateway)
│
└── Server (Node.js & Express REST API)
    ├── /api/auth (Sign up, Sign in, JWT generation)
    ├── /api/departments (CRUD for Faculties & Course Catalogs)
    ├── /api/notes (Search, Filter, Rate & Multipart File Uploads)
    ├── /api/admin (Career & Research Management)
    └── /api/stats (Platform Metrics & Health Check)
```

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server Components & Client Hydration) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) & JavaScript (ES6+ Modules) |
| **Styling & UI** | [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Backend Runtime** | [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM](https://www.prisma.io/) (with auto-sync in-memory fallback) |
| **Security & Protection** | [Helmet](https://helmetjs.github.io/), [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit), [bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| **File Handling** | [Multer](https://github.com/expressjs/multer) for secure multipart uploads |

---

## 📁 Repository Structure

```
Studyhub/
├── client/                     # Next.js 14 Frontend Application
│   ├── src/
│   │   ├── app/                # App Router routes
│   │   │   ├── page.tsx        # Landing Page
│   │   │   ├── study/          # Notes Repository & Dynamic Course Creator
│   │   │   ├── admin/          # Admin Control Center (Departments & Careers)
│   │   │   ├── jobs/           # Careers, Tuition & Internships Board
│   │   │   ├── research/       # Academic Papers & Preprints
│   │   │   ├── network/        # Student Peer Network
│   │   │   ├── profile/        # Scholar Profile & Portfolio
│   │   │   ├── login/          # User Authentication
│   │   │   └── signup/         # Account Registration
│   │   ├── components/         # Reusable UI & Layout Components
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── ui/             # Button, InputField, Modals
│   │   └── context/            # AuthContext & State Management
│   └── package.json
│
├── server/                     # Express.js REST API Backend
│   ├── prisma/
│   │   └── schema.prisma       # Database Schema Models (User, Department, Course, Note, etc.)
│   ├── src/
│   │   ├── app.js              # Express App Setup, Security & Middleware
│   │   ├── middleware/         # DB Connection, Auth & Rate Limiting
│   │   └── modules/
│   │       ├── auth/           # User Signup, Login, Password Hashing
│   │       ├── departments/    # Department & Course Catalog Controller & Routes
│   │       ├── notes/          # Notes CRUD, File Uploads, Fallback Store
│   │       ├── admin/          # Admin Overview, Careers & Research Papers
│   │       └── stats/          # Health & Platform Analytics
│   ├── init-db.js              # Direct PostgreSQL table creation/verification
│   ├── server.js               # Server Entry Point (Port 5001)
│   └── package.json
│
└── README.md                   # Full Documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** / **pnpm**
- **PostgreSQL** (optional; the server includes an automatic in-memory fallback store for offline development)

---

### 1. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

Configure your `server/.env`:
```env
PORT=5001
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/studyhub?schema=public"
JWT_SECRET="your_secure_jwt_secret_key"
```

Initialize database tables and generate the Prisma Client:
```bash
# Verify database tables
node init-db.js

# Start backend server in development mode
npm run dev
# Server starts on http://localhost:5001
```

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to the client directory
cd client

# Install dependencies
npm install

# Create environment configuration (optional)
# NEXT_PUBLIC_API_URL defaults to http://localhost:5001
```

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Admin Access Passkey

To access the Admin Management Hub at [http://localhost:3000/admin](http://localhost:3000/admin):
- **Master Admin Passkey**: `admin123` (or `studyhub2026`)
- Or log in with an account having role `'admin'`.

From the Admin Hub, you can:
- **Add New Departments**: Click the "Departments & Courses" tab → Enter department name, code, description.
- **Add Courses**: Select the department and enter the course name.
- **Post Jobs & Tuitions**: Create and delete home tutoring, remote teaching, or job listings.
- **Publish Research Papers**: Add preprints with DOI citations.

---

## 📡 API Reference

### Department & Course Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/departments` | Get all departments with their course catalogs |
| `POST` | `/api/departments` | Add a new university department (Admin) |
| `DELETE`| `/api/departments/:id` | Delete a department (Admin) |
| `POST` | `/api/departments/courses` | Register a new course under a department (Open to all users) |

### Notes Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/notes` | Get study materials (supports `?search=`, `?department=`, `?sort=`) |
| `POST` | `/api/notes` | Upload a new note (automatically registers new courses) |
| `POST` | `/api/notes/upload` | Multipart file upload for PDFs/images |

### Authentication Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new student account |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT token |

### Admin & Careers Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/overview` | Platform metrics, department & course counts |
| `GET` | `/api/admin/careers` | List jobs, tuitions, and internships |
| `POST` | `/api/admin/careers` | Create a new career/tuition listing |
| `DELETE`| `/api/admin/careers/:id` | Remove a career listing |
| `GET` | `/api/admin/research` | Get published academic research papers |
| `POST` | `/api/admin/research` | Publish a new research paper |

---

## 🚢 Deployment

### Deploy Backend (e.g. Render / Railway / Heroku)
- Build Command: `npm install && npx prisma generate`
- Start Command: `node server.js`
- Set Environment Variables: `PORT`, `FRONTEND_URL`, `DATABASE_URL`, `JWT_SECRET`.

### Deploy Frontend (e.g. Vercel)
- Framework Preset: `Next.js`
- Root Directory: `client`
- Set Environment Variable: `NEXT_PUBLIC_API_URL` pointing to your deployed backend.

---

## 🤝 Contributing

Contributions are warmly welcome!
1. Fork the Project repository
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

Made with ❤️ by [Anik Dey](https://github.com/anikdey095) for the University Academic Community.

</div>
