# TASKFLOW

A **project-first task management system** built to reflect how real teams work — projects → members → tasks — with a clean dashboard-driven workflow and AWS-ready backend architecture.

This repository is intentionally structured to mirror **production-grade full‑stack applications**, not demo apps.

---

## 🧭 Product Flow (How the App Works)

1. **Dashboard**
   - Entry point after login
   - Shows all projects the user is part of
   - High-level visibility before drilling down

2. **Project**
   - Every task belongs to a project
   - Projects manage members and access

3. **Members**
   - Only project members can view or work on tasks
   - Owners manage project membership

4. **Tasks**
   - Created inside projects
   - Assigned, updated, and tracked by status

This flow is enforced at **API, middleware, and UI level**.

---

## 📸 Screenshots

> Screenshots are organized to reflect the actual user journey.

```
/screenshots
 ├── dashboard.png        # Project overview after login
 ├── project-view.png     # Inside a selected project
 └── tasks-view.png       # Tasks within a project

<img width="1193" height="563" alt="image" src="https://github.com/user-attachments/assets/d78f71b9-a5d8-451a-8ac4-1db117a2e95c" />

<img width="1185" height="505" alt="image" src="https://github.com/user-attachments/assets/409f207f-6da4-4cc5-9e9c-b170906ccf9e" />

<img width="1296" height="623" alt="image" src="https://github.com/user-attachments/assets/9993a169-f2fd-43f7-ac79-e16b9b10b97b" />

<img width="1256" height="592" alt="image" src="https://github.com/user-attachments/assets/8c59c05f-fec9-4db0-b206-2e34a98d3439" />

<img width="1119" height="631" alt="image" src="https://github.com/user-attachments/assets/ce86efec-db15-43e1-af5c-dc95dec13173" />

<img width="1051" height="382" alt="image" src="https://github.com/user-attachments/assets/4cd9fca3-53fe-4733-9516-6370466af47d" />

<img width="1090" height="448" alt="image" src="https://github.com/user-attachments/assets/6031c9d4-2fdc-4629-9a1d-23c129cc2447" />




```

---

## 🏗️ Folder Structure

### Root
```
TASKFLOW
 ├── BackEnd
 └── FrontEnd
```

---

### 🔙 Backend Structure

```
BackEnd/
 ├── src/
 │   ├── config/          # DB & environment config
 │   ├── controllers/    # Business logic
 │   ├── middleware/     # Auth & access control
 │   ├── models/         # Mongoose schemas
 │   ├── routes/         # API routes
 │   └── server.js       # App entry point
 │
 ├── .env
 ├── package.json
 └── package-lock.json
```

**Why this structure**
- Clear separation of concerns
- Scales cleanly as features grow
- Matches real production Node.js services

---

### 🎨 Frontend Structure

```
FrontEnd/
 ├── public/
 ├── src/
 │   ├── assets/          # Images & static assets
 │   ├── components/     # Reusable UI components
 │   ├── pages/          # Page-level views
 │   ├── routes/         # Route definitions
 │   ├── services/       # API & HTTP layer
 │   ├── store/          # Global state management
 │   ├── utils/          # Helpers & constants
 │   │
 │   ├── App.jsx
 │   ├── main.jsx
 │   ├── App.css
 │   └── index.css
 │
 ├── index.html
 ├── eslint.config.js
 ├── package.json
 └── package-lock.json
```

This structure keeps **UI, routing, state, and API logic decoupled**.

---

## 🔐 Backend Access Control Model

TaskFlow enforces access using **layered middleware**, not frontend trust.

- Authentication → `auth.middleware`
- Project access → `canAccessProject`
- Ownership rules → `owner.middleware`
- Task permissions → `task.middleware`

Every protected action passes through these checks.

---

## 🌐 API Design (High-Level)

### Authentication
- Register user
- Login user

### Projects
- Create project
- Fetch user projects
- Fetch single project
- Delete project

### Project Members
- View members
- Add member (owner only)
- Remove member (owner only)

### Tasks
- Create task inside project
- Fetch tasks by project
- Update task
- Update task status
- Assign task
- Delete task

All routes are **project-scoped** and permission-checked.

---

## ⚙️ Local Setup

### Backend
```
cd BackEnd
npm install
npm run dev
```

### Frontend
```
cd FrontEnd
npm install
npm run dev
```


---

## 🧠 Design Philosophy

- Project-first, not task-first
- Backend enforces rules, frontend reflects them
- Structure over shortcuts
- Deployment-readiness from day one

---

## 👤 Author

**Husain Ansari**  
Full‑Stack Developer

---

## 📄 License

Built for learning, architecture practice, and real‑world deployment demos.

