# ⚡ DigiHust — Enterprise Digital Services & Specialized Talent Platform

<div align="center">

![DigiHust Banner](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80)

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud%20PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)

**Digital Services Handled by Specialized Talent. One Company. One Managed Contract.**

[Explore Platform](#-key-features) • [Architecture](#-system-architecture) • [Database Schema](#-database-schema) • [Quick Start](#-quick-start) • [Security & Governance](#-security--governance)

</div>

---

## 📖 Overview

**DigiHust** is an enterprise-grade digital services delivery platform that connects clients with vetted domain specialists across **Full-Stack Web Engineering, UI/UX & Brand Identity, AI Automation, Digital Growth Marketing, and Cybersecurity**.

The platform combines a high-performance, SEO-optimized public website with a robust internal **Executive Management Portal** that powers lead-to-project conversion, automated split payouts, credential verification, and squad orchestration.

---

## 🚀 Key Features

### 🌐 1. Public Client & Brand Platform
* **Pre-Rendered SEO Engine**: Static pre-rendering for all 22 core pages for optimal search ranking and AI crawler indexing.
* **Interactive Squad Discovery**: Deep-dive showcases into technical capabilities, case studies, and specialized workflows.
* **Smart Scope & Budget Estimator**: Interactive client intake form with automated budget range and squad routing.
* **Live Team Directory**: Real-time member roster with executive pinning order and verified credentials.
* **Public Credential Verification**: Real-time QR code certificate and offer letter authentication engine.
* **Zero-FOUC Dual Themes**: Instant, flicker-free Light & Dark theme toggle with system preference detection.

---

### 🛡️ 2. Executive Management Portal (`/portal`)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DIGIHUST EXECUTIVE PORTAL                       │
├───────────────┬────────────────────────┬───────────────────────────────┤
│ 👑 CEO MASTER │ 💼 OPERATIONS MANAGERS │ 🎯 SQUAD LEADERS & SPECIALISTS │
└───────────────┴────────────────────────┴───────────────────────────────┘
```

* **Executive Dashboard**: Real-time operational metrics, project workload tracking, squad distribution, and platform statistics.
* **People & Community Roster**:
  * Collision-safe sequential Member ID scheme (`DGH2600...` / `CEOOFDGH01`).
  * Live status transitions (`Active`, `On Leave`, `Suspended`, `Pending Onboarding`).
  * 1-Click CEO credential reset & password distribution.
  * Executive Member Pinning with cross-device synchronization.
* **Lead-to-Project Intake Pipeline**:
  * Kanban-style lead processing from `New Inquiry` to `Scope Approved` to `Active Delivery`.
  * Automated Revenue Split Engine (Management %, Squad Leader %, Specialist %).
* **Assignment & Task Workspace**:
  * Milestone deadlines, deliverable tracking, sub-task workflows, and status reviews.
* **Certificate & Offer Letter Issuance System**:
  * **Dual-Mode Uploads**: Direct PDF file uploads to cloud storage or Google Drive link embedding.
  * **3-Tier Visibility Control**:
    * 🔓 **Released**: Visible and directly downloadable by the member.
    * 🔒 **Locked (Under Review)**: Visible with executive review badge (download held).
    * 👁️‍🗨️ **Completely Hidden**: 100% invisible to the member until executive release.
* **Applicant Screening Pipeline**:
  * Inbound specialist application queue with qualification grading and 1-click onboarding.
* **Automated Self-Service Password Reset (OTP)**:
  * 2-Step recovery wizard with 6-digit email OTP verification (15-minute expiration) and instant database hash update.
* **Immutable Security Audit Log**:
  * Chronological ledger tracking account creations, logins, status modifications, and executive authorizations.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[Client / Member Browser] --> |HTTPS / React 18 SPA| Frontend[DigiHust Frontend - Vite + Tailwind]
    Frontend --> |Realtime State Sync| AppContext[React AppContext + Realtime Sync Engine]
    
    subgraph Cloud Infrastructure (Supabase)
        AppContext --> |PostgreSQL Database| DB[(Supabase PostgreSQL Database)]
        AppContext --> |Realtime Change Broadcast| Realtime[Supabase Realtime Channel]
        AppContext --> |File Storage| Storage[(Supabase Object Storage - Avatars & Documents)]
    end

    subgraph Security & Verification
        AppContext --> |SHA-256 + Salt| CryptoEngine[Crypto Auth Engine]
        AppContext --> |6-Digit OTP Dispatch| EmailService[Automated OTP Mailer]
    end
```

---

## 🗄️ Database Schema

The platform is backed by **11 PostgreSQL tables** with strict Row Level Security (RLS):

| Table Name | Description | Key Columns |
|---|---|---|
| `users` | Member accounts, credentials, and roles | `id`, `member_id`, `email`, `role`, `role_tier`, `password_hash`, `status`, `avatar_url` |
| `leads` | Inbound client inquiries and project quotes | `id`, `client_name`, `email`, `scope_description`, `budget_range`, `status`, `target_group_id` |
| `projects` | Active client delivery contracts | `id`, `lead_id`, `title`, `stage`, `total_budget`, `split_type`, `deliverables` |
| `assignments` | Task allocations and milestone deliverables | `id`, `project_id`, `assigned_to_user_id`, `status`, `deadline`, `payout_amount` |
| `certificates` | Issued offer letters & completion credentials | `id`, `member_id`, `document_title`, `type`, `qr_code_url`, `status`, `pdf_config` |
| `announcements` | Global and squad-level bulletins | `id`, `title`, `content`, `scope`, `priority`, `author_role`, `is_pinned` |
| `site_content` | Dynamic CMS content and pinned member order | `id ('primary_cms')`, `data (JSONB)` |
| `audit_logs` | Immutable security and compliance log | `id`, `timestamp`, `actor_id`, `actor_name`, `action`, `details` |
| `payouts` | Member financial ledger & earnings records | `id`, `project_id`, `user_id`, `amount`, `share_pct`, `paid_at` |
| `applicants` | Specialist talent onboarding applications | `id`, `name`, `email`, `preferred_group_id`, `specialties`, `status` |
| `settings` | Global platform splits and operational rules | `id ('global')`, `default_management_split_pct`, `default_freelancer_split_pct` |

---

## 🔐 Security & Governance

* **Zero Hardcoded Secrets**: All authentication is verified against cryptographic hashes (`SHA-256` with proprietary salt). No plaintext passwords exist in the codebase or Git history.
* **1-to-1 Unique Member ID Authentication**: Each user possesses strictly one unique alphanumeric identifier (`CEOOFDGH01`, `DGH2600...`). Legacy aliases and backdoor fallbacks are completely excluded.
* **Strict Role-Based Access Control (RBAC)**:
  * **CEO (`ceo`)**: Complete administrative, financial, and credential governance across the entire organization.
  * **Operations Manager (`manager`)**: Project lifecycle management, lead approval, and squad oversight.
  * **Group Leader (`group_leader`)**: Squad-level task assignment, milestone reviews, and specialist coordination.
  * **Domain Specialist (`member`)**: Personal workspace, assigned deliverables, earnings dashboard, and credential download center.

---

## 💻 Tech Stack

* **Frontend Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool & Bundler**: [Vite 5](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + Custom CSS Variables & Animations
* **Animations & UI**: [Framer Motion](https://www.framer.com/motion/) + [Lucide React Icons](https://lucide.dev/)
* **Database & Auth**: [Supabase PostgreSQL](https://supabase.com/) (`@supabase/supabase-js`)
* **Document & PDF Processing**: [pdf-lib](https://pdf-lib.js.org/) + [qrcode.react](https://github.com/zpao/qrcode.react)
* **Pre-Rendering**: Custom Node.js Static HTML Generator for 22 Static Pages (`scripts/prerender.js`)

---

## 📦 Project Structure

```
digihust-platform/
├── public/                     # Static assets (Favicon, Logo, Manifest, Robots, Sitemap)
├── scripts/
│   └── prerender.js            # Automated static page pre-renderer for SEO
├── src/
│   ├── assets/                 # Brand assets and imagery
│   ├── components/
│   │   ├── common/             # Reusable UI components & Toast notification container
│   │   ├── dashboard/          # Operations, Projects, and People Management modals
│   │   ├── portal/             # Staff portal views (Dashboard, Workspace, Certs, CMS)
│   │   ├── public/             # Public landing pages (Home, Squads, Team, Verification)
│   │   └── seo/                # Dynamic OpenGraph and Meta tag manager
│   ├── context/
│   │   └── AppContext.tsx      # Central application state & realtime database coordinator
│   ├── lib/
│   │   ├── crypto.ts           # SHA-256 cryptographic password hashing utilities
│   │   ├── dbService.ts        # Supabase CRUD operations & database mapper
│   │   ├── emailService.ts     # Automated OTP email dispatch service
│   │   ├── memberIdGenerator.ts# Collision-safe sequential Member ID engine
│   │   ├── permissions.ts      # 4-Tier RBAC access rules & capability matrix
│   │   ├── realtimeSync.ts     # Multi-device Realtime Mesh Channel
│   │   └── supabase.ts         # Supabase client initializer
│   ├── services/
│   │   └── mockData.ts         # Initial schema definitions and baseline defaults
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces & domain entity definitions
│   ├── App.tsx                 # Root router and layout wrapper
│   ├── index.css               # Global theme tokens, typography, and scrollbars
│   └── main.tsx                # Application entry point
├── index.html                  # Root HTML template with Zero-FOUC theme loader
├── package.json                # Dependencies and npm build scripts
├── tailwind.config.js          # Tailwind theme extensions & design tokens
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundling, manual chunking, and optimization rules
```

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/digihust-platform.git
cd digihust-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```
This compiles the application and pre-renders all 22 static HTML pages in the `dist/` folder.

---

## 📄 License

Copyright © 2024–2026 **DigiHust**. All rights reserved.  
Proprietary software. Unauthorized reproduction, distribution, or commercial exploitation is strictly prohibited.
