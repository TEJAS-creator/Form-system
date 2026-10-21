# 🍽️ Bangalore Restaurant Packaging & Waste Assessment System

> A modern, multi-step assessment platform designed to capture operational waste patterns, packaging choices, and reuse readiness across food service establishments in Bangalore.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Tests-14%20Passed-22C55E?logo=vitest&logoColor=white)](https://vitest.dev/)

---

## 🌐 Live Website Demo

Access the live interactive application directly in your browser:  
👉 **[Launch Live Demo Website](https://tejas-creator.github.io/Form-system/)**

> **Note**: The live GitHub Pages deployment operates with an offline-compatible demo fallback mode. You can test through all 5 pages, add dynamic table rows, trigger conditional logic, and complete the survey to view the confirmation screen with a generated reference ID.

---

## ✨ Features & Architecture

- **Multi-Step Guided Flow**: 5 modular steps with intuitive navigation, step indicators, and progress tracking.
  1. **Restaurant Details & Identity**: Outlet profile, contact information, seating capacity, and Google OAuth / guest entry.
  2. **Waste Generation Profile**: Waste categories, segregation practices, daily volumes, and cost breakdowns.
  3. **Packaging Inventory Table**: Dynamic repeatable table allowing users to dynamically add, edit, and remove packaging container entries.
  4. **Reuse Readiness & Service Operations**: Dine-in vs. Delivery workflow analysis with adaptive conditional questions.
  5. **Review & Final Submission**: Complete structured audit before committing data.
  6. **Confirmation & Reference ID**: Thank You screen displaying submission reference and receipt timestamp.
- **Dynamic Conditional Logic**: Questions reveal dynamically based on user choices (e.g., custom role inputs, cost categorization, and conditional dine-in service questions).
- **Auto-Saving Drafts**: Automatically preserves form progress in `localStorage` so users never lose answers on refresh.
- **Google OAuth 2.0 Integration**: Sign-in modal with dynamic SDK loading, token verification, and guest fallback.
- **Strict Client-Side Validation**: Powered by **Zod** and **React Hook Form** with real-time inline error handling.
- **Robust Fullstack Architecture**:
  - **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons
  - **Backend Server**: Node.js + Express + Prisma ORM + SQLite
- **Automated Test Coverage**: 14 Vitest unit and integration tests verifying conditional logic, dynamic tables, and validation schemas.

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/TEJAS-creator/Form-system.git
cd Form-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize the Database
```bash
# Push Prisma schema to SQLite database
npm run prisma:db-push
```

### 4. Run the Application
Open two terminal windows:

**Terminal 1 — Express Backend API (Port 5000):**
```bash
npm run server:dev
```

**Terminal 2 — Vite Frontend (Port 5173):**
```bash
npm run dev
```

Visit `http://localhost:5173` to explore the form locally.

---

## 🧪 Running Automated Tests

Run the full Vitest suite:
```bash
npm test
```

For test watch mode:
```bash
npm run test:watch
```

---

## 🚢 Deploying to GitHub Pages

This repository comes pre-configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Go to your repository **Settings** on GitHub.
2. Select **Pages** under the *Code and automation* section.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The workflow will automatically trigger on pushes to the `main` branch and host the website at:  
   `https://tejas-creator.github.io/Form-system/`

---

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD deployment workflow
├── prisma/
│   └── schema.prisma           # Prisma database schema (SQLite)
├── server/
│   └── src/
│       ├── controllers/        # Express survey and auth controllers
│       ├── routes/             # API route definitions
│       └── index.ts            # Express server entry point
├── src/
│   ├── components/             # UI components and page forms
│   │   ├── pages/              # Form steps 1 through 6
│   │   ├── GoogleSignInModal.tsx
│   │   ├── Header.tsx
│   │   ├── QuestionCard.tsx
│   │   └── RepeatableTable.tsx # Dynamic container rows table
│   ├── services/
│   │   └── api.ts              # API client with offline demo fallback
│   ├── test/                   # Vitest test suites
│   ├── types/                  # TypeScript survey data definitions
│   ├── App.tsx                 # Form wizard container & state
│   └── main.tsx                # React entry
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
