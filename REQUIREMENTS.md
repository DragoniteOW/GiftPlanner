# Software Requirements Specification
## Gift Planner Web Application

| Field | Value |
|---|---|
| Document ID | SRS-GP-001 |
| Version | 1.0 |
| Status | Approved |
| Date | 2026-05-09 |
| Author | Development Team |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [External Interface Requirements](#5-external-interface-requirements)
6. [Data Model](#6-data-model)
7. [Use Cases](#7-use-cases)
8. [Constraints and Assumptions](#8-constraints-and-assumptions)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements for the **Gift Planner** web application. It serves as a contract between the stakeholder and the development team and is the primary reference document for design, implementation, and testing.

### 1.2 Scope

**Gift Planner** is a single-user web application for organising gift ideas and recording presents given to people. The system allows the user to manage a list of people, attach gift ideas to them, track the status of each idea, receive notifications about upcoming birthdays and occasions, share gift idea lists publicly, export a printable overview, and receive AI-generated gift suggestions.

The system is intended for private, personal use by a single user. It does not require user authentication for the main application. A read-only public share view requires no login.

**In scope:**
- Person and occasion management
- Gift idea lifecycle (creation → status tracking → given)
- Notification system for upcoming birthdays and events
- Public share links (read-only)
- Printable gift list export
- AI-powered gift suggestions via the Google Gemini API
- Local development and cloud deployment (Vercel + PostgreSQL)

**Out of scope:**
- Multi-user accounts or authentication
- Native mobile applications
- Payment or purchase integration
- Email or push notifications (notifications are in-app only)

### 1.3 Definitions, Acronyms, Abbreviations

| Term | Definition |
|---|---|
| **Person** | A contact in the system for whom gift ideas are tracked |
| **Gift Idea** | A planned but not yet given gift, with a lifecycle status |
| **Given Gift** | A gift that has already been presented to a person |
| **Occasion** | A type of event associated with gift-giving (e.g. Birthday, Christmas) |
| **PersonEvent** | A specific dated occurrence of an Occasion for a Person |
| **Share Token** | A unique, unguessable token that grants public read-only access to a person's gift ideas |
| **Status** | The lifecycle stage of a Gift Idea: IDEA → ORDERED → BOUGHT → GIVEN |
| **SRS** | Software Requirements Specification |
| **API** | Application Programming Interface |
| **ORM** | Object-Relational Mapper |
| **UI** | User Interface |

### 1.4 References

| Reference | Description |
|---|---|
| IEEE 830-1998 | IEEE Recommended Practice for Software Requirements Specifications |
| Next.js 16 Docs | `node_modules/next/dist/docs/` |
| Prisma ORM Docs | https://www.prisma.io/docs |
| Google Gemini API | https://ai.google.dev/gemini-api/docs |
| shadcn/ui | https://ui.shadcn.com |

### 1.5 Overview

Section 2 provides a high-level product description. Section 3 lists all functional requirements identified by unique IDs. Section 4 covers non-functional requirements. Section 5 describes external interfaces. Section 6 defines the data model. Section 7 presents the key use cases. Section 8 documents constraints and assumptions.

---

## 2. Overall Description

### 2.1 Product Perspective

Gift Planner is a self-contained full-stack web application. It consists of a Next.js frontend and a set of API route handlers, backed by a relational database via Prisma ORM. The system communicates with the Google Gemini API for AI-generated suggestions. There are no other external service dependencies for core functionality.

```
┌─────────────────────────────────────┐
│            Browser (User)           │
└────────────────┬────────────────────┘
                 │ HTTPS
┌────────────────▼────────────────────┐
│         Next.js Application         │
│  ┌──────────────┐ ┌───────────────┐ │
│  │  React Pages │ │  API Routes   │ │
│  │ (App Router) │ │  (/app/api/)  │ │
│  └──────────────┘ └───────┬───────┘ │
└──────────────────────────┼──────────┘
                           │
          ┌────────────────┼──────────────┐
          │                │              │
┌─────────▼──────┐  ┌──────▼──────┐      │
│  SQLite / PG   │  │ Gemini API  │      │
│  (via Prisma)  │  │  (Google)   │      │
└────────────────┘  └─────────────┘      │
```

### 2.2 Product Functions (Summary)

- Manage a list of people with optional birthday and notes
- Add, edit, and delete gift ideas per person, linked to occasions
- Track gift idea status through a defined lifecycle
- Promote a gift idea to a "given gift" record
- Log given gifts directly without a prior gift idea
- Manage occasion types (built-in and custom)
- Attach dated occasion events to specific people
- Display upcoming occasion notifications once per browser session per day
- Share a person's pending gift ideas via a public URL
- Print or export all gift data as a PDF-ready page
- Request AI-generated gift suggestions based on person notes and history

### 2.3 User Characteristics

The system has a **single intended user**: the owner of the application. The user is assumed to have:
- Basic web browsing skills
- No programming knowledge required for day-to-day use
- Basic familiarity with installing and running a Node.js development server (for local use)

A secondary audience exists for the **share page**: recipients or helpers who are given a share link. They require only a modern web browser and no technical knowledge.

### 2.4 Operating Environment

- **Runtime:** Node.js ≥ 20.9
- **Browser support:** Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+
- **Local database:** SQLite (via `dev.db` file)
- **Production database:** PostgreSQL (e.g. Neon free tier)
- **Hosting:** Vercel (free tier) or any Node.js-compatible host

### 2.5 Product Constraints

- The application is single-user; there is no authentication mechanism
- The Gemini API key must be kept server-side and must not be exposed to the browser
- File-based image uploads are out of scope; images are referenced by URL only
- The SQLite database is not suitable for multi-instance production deployment; PostgreSQL must be used on hosting platforms

---

## 3. Functional Requirements

Requirements are grouped by feature area. Each requirement carries a unique ID in the format **FR-[AREA]-[NUMBER]**.

---

### 3.1 Person Management

| ID | Requirement | Priority |
|---|---|---|
| FR-PM-01 | The system shall allow the user to create a person with a name (required), an optional birthday (date), and optional free-text notes. | Must |
| FR-PM-02 | The system shall display a list of all people, ordered alphabetically by name. | Must |
| FR-PM-03 | The system shall allow the user to edit a person's name, birthday, and notes. | Must |
| FR-PM-04 | The system shall allow the user to delete a person. Deleting a person shall cascade-delete all their gift ideas, given gifts, and occasion events. | Must |
| FR-PM-05 | The system shall display the number of gift ideas and given gifts on each person's list entry and dashboard card. | Should |
| FR-PM-06 | Each person shall be assigned a unique share token on creation. | Must |

---

### 3.2 Gift Idea Management

| ID | Requirement | Priority |
|---|---|---|
| FR-GI-01 | The system shall allow the user to create a gift idea for a person, with a title (required), an optional occasion, optional notes, optional to-do notes, and an optional image URL. | Must |
| FR-GI-02 | The system shall allow the user to attach one or more links (URL + optional label) to a gift idea. | Should |
| FR-GI-03 | A gift idea shall have a status from the set: IDEA, ORDERED, BOUGHT, GIVEN. The default status shall be IDEA. | Must |
| FR-GI-04 | The system shall allow the user to change a gift idea's status inline without navigating away from the person detail page. | Must |
| FR-GI-05 | The system shall allow the user to edit all fields of a gift idea, including its links. | Must |
| FR-GI-06 | The system shall allow the user to delete a gift idea. | Must |
| FR-GI-07 | The system shall display gift ideas for a person ordered by creation date, newest first. | Should |
| FR-GI-08 | If an image URL is provided, the system shall display a thumbnail of the image on the gift idea card. | Should |

---

### 3.3 Given Gift Tracking

| ID | Requirement | Priority |
|---|---|---|
| FR-GG-01 | The system shall allow the user to promote a gift idea to a given gift by specifying a date given and an occasion. Promoting a gift idea shall automatically set its status to GIVEN. | Must |
| FR-GG-02 | The system shall allow the user to log a given gift directly (without a prior gift idea), with a title, date given, optional occasion, optional notes, and optional image URL. | Must |
| FR-GG-03 | Given gifts shall be displayed in a separate tab on the person detail page, ordered by date given, newest first. | Must |
| FR-GG-04 | A given gift promoted from an idea shall retain a reference to the source idea. | Should |

---

### 3.4 Occasion Management

| ID | Requirement | Priority |
|---|---|---|
| FR-OC-01 | The system shall provide two built-in occasion types: **Birthday** and **Christmas**. Built-in occasions shall not be deletable. | Must |
| FR-OC-02 | The system shall allow the user to create custom occasion types with a unique name. | Must |
| FR-OC-03 | The system shall allow the user to delete custom occasion types. | Must |
| FR-OC-04 | The system shall allow the user to associate a dated event (PersonEvent) with a person and an occasion type. | Must |
| FR-OC-05 | Occasion types shall be selectable when creating or editing a gift idea to link the idea to a specific occasion. | Must |

---

### 3.5 Notification System

| ID | Requirement | Priority |
|---|---|---|
| FR-NT-01 | The system shall check for upcoming occasions once per browser session, storing the check date in `sessionStorage` to avoid repeat checks on the same calendar day. | Must |
| FR-NT-02 | The system shall notify the user of any person whose birthday falls within the next 30 days, including the number of days remaining and any gift ideas linked to that person's Birthday occasion. | Must |
| FR-NT-03 | The system shall notify the user of any PersonEvent whose date falls within the next 30 days. | Must |
| FR-NT-04 | The system shall display Christmas-related notifications for all people between 1 December and 24 December inclusive, including their Christmas gift ideas. | Must |
| FR-NT-05 | Notifications shall be presented in a dismissible modal dialog on the dashboard. | Must |
| FR-NT-06 | Each notification entry shall link to the relevant person's detail page. | Should |
| FR-NT-07 | Birthday recurrence shall be calculated by month and day only, independent of year. | Must |

---

### 3.6 Public Share

| ID | Requirement | Priority |
|---|---|---|
| FR-SH-01 | Each person shall have a publicly accessible read-only page at `/share/[shareToken]`, requiring no login. | Must |
| FR-SH-02 | The share page shall display the person's name and all their non-GIVEN gift ideas, including title, occasion, status, notes, image, and links. | Must |
| FR-SH-03 | The share page shall not display edit controls, navigation, or any write-capable UI. | Must |
| FR-SH-04 | The user shall be able to copy the share URL to the clipboard from the person detail page. | Should |
| FR-SH-05 | The user shall be able to regenerate the share token, invalidating the previous share URL. | Should |

---

### 3.7 Print / Export

| ID | Requirement | Priority |
|---|---|---|
| FR-PR-01 | The system shall provide a print page at `/print` that renders all people with their gift ideas and given gifts in a structured layout. | Must |
| FR-PR-02 | The print page shall include a "Print / Save as PDF" button that triggers the browser's print dialog. | Must |
| FR-PR-03 | When printed, navigation, buttons, and non-content UI elements shall be hidden via CSS `@media print` rules. | Must |
| FR-PR-04 | The print layout shall group content by person and clearly separate gift ideas from given gifts. | Should |

---

### 3.8 AI Suggestions

| ID | Requirement | Priority |
|---|---|---|
| FR-AI-01 | The system shall provide an "AI Suggestions" action on each person's detail page. | Must |
| FR-AI-02 | When triggered, the system shall call the Google Gemini API server-side, passing the person's name, notes, existing gift ideas, and past given gifts as context. | Must |
| FR-AI-03 | The Gemini API key shall be stored as a server-side environment variable and shall never be exposed in the browser or in client-side JavaScript bundles. | Must |
| FR-AI-04 | The system shall return exactly 5 gift suggestions as a numbered list. | Should |
| FR-AI-05 | The suggestions shall be displayed in a modal dialog. | Must |
| FR-AI-06 | The user shall be able to save any individual suggestion directly as a new gift idea from within the modal. | Should |
| FR-AI-07 | If no API key is configured, the system shall return a human-readable message instructing the user to add the key, rather than an unhandled error. | Must |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement |
|---|---|
| NFR-PE-01 | Page initial load (Time to Interactive) shall not exceed 3 seconds on a standard broadband connection. |
| NFR-PE-02 | API route responses for database-only operations shall complete within 500 ms under normal load. |
| NFR-PE-03 | The AI suggestion response time is governed by the Gemini API and is exempt from the 500 ms target; the UI shall show a loading indicator while waiting. |

### 4.2 Usability

| ID | Requirement |
|---|---|
| NFR-US-01 | The application shall be operable without reading any documentation for a user familiar with basic web applications. |
| NFR-US-02 | All destructive actions (delete person, delete gift idea, regenerate share token) shall require explicit user confirmation before execution. |
| NFR-US-03 | Status changes on gift ideas shall provide immediate visual feedback without a full page reload. |
| NFR-US-04 | The application shall be usable on screen widths from 375 px (mobile) to 1440 px (desktop). |

### 4.3 Security

| ID | Requirement |
|---|---|
| NFR-SE-01 | The Gemini API key shall only be readable in server-side code; it shall not appear in any client-side JavaScript bundle or API response. |
| NFR-SE-02 | Share tokens shall be cryptographically random and unguessable (minimum 128 bits of entropy). |
| NFR-SE-03 | The share page shall expose only non-sensitive gift idea data; person notes and internal IDs shall not be returned by the public share API. |
| NFR-SE-04 | The `.env` file containing secrets shall not be committed to version control. An `.env.example` with placeholder values shall be committed instead. |

### 4.4 Reliability

| ID | Requirement |
|---|---|
| NFR-RE-01 | The application shall handle Gemini API unavailability gracefully by displaying an error message to the user rather than crashing. |
| NFR-RE-02 | Database migrations shall be applied before deployment; the application shall not run against a schema-mismatched database. |

### 4.5 Maintainability

| ID | Requirement |
|---|---|
| NFR-MA-01 | The Prisma singleton shall be implemented using the global object pattern to avoid connection exhaustion during hot-reload in development. |
| NFR-MA-02 | Server-side Prisma calls shall only occur in Server Components or API route handlers, never in Client Components. |
| NFR-MA-03 | Switching the database provider from SQLite to PostgreSQL shall require only a change to the datasource provider in `schema.prisma` and the `DATABASE_URL` environment variable. |

### 4.6 Portability / Deployability

| ID | Requirement |
|---|---|
| NFR-PO-01 | The application shall run locally with a single command: `npm run dev`. |
| NFR-PO-02 | The application shall be deployable to Vercel free tier by connecting the GitHub repository, without custom server configuration. |
| NFR-PO-03 | All environment-specific configuration shall be managed through environment variables; no configuration shall be hard-coded. |

---

## 5. External Interface Requirements

### 5.1 User Interface

- The application uses shadcn/ui (Base UI + Tailwind CSS v4) component primitives.
- Navigation is persistent across all pages via a top navigation bar.
- The share page and print page intentionally omit the navigation bar.
- Toasts (via Sonner) provide transient feedback for successful and failed actions.

### 5.2 Google Gemini API

- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Authentication:** API key passed as a query parameter (server-side only)
- **Request format:** JSON body with `contents[].parts[].text` prompt
- **Response:** Candidate text extracted from `candidates[0].content.parts[0].text`
- **Error handling:** Non-2xx responses return a human-readable error string to the UI

### 5.3 Database

- **Local:** SQLite file at `prisma/dev.db`, managed via Prisma ORM
- **Production:** PostgreSQL (e.g. Neon), connection string via `DATABASE_URL`
- **Schema migrations:** Managed by Prisma Migrate (`npx prisma migrate deploy`)

---

## 6. Data Model

### 6.1 Entity Relationship Overview

```
Person ──< GiftIdea >── Occasion
  │            │
  │            ├──< GiftLink
  │            │
  │            └──── GivenGift (sourceIdeaId, optional)
  │
  ├──< GivenGift >── Occasion
  │
  └──< PersonEvent >── Occasion
```

### 6.2 Entities and Attributes

**Person**
| Attribute | Type | Constraints |
|---|---|---|
| id | String | PK, cuid |
| name | String | Required |
| birthday | DateTime | Optional |
| notes | String | Optional |
| shareToken | String | Unique, cuid, auto-generated |
| createdAt | DateTime | Auto, UTC |

**Occasion**
| Attribute | Type | Constraints |
|---|---|---|
| id | String | PK, cuid |
| name | String | Unique, Required |
| isBuiltIn | Boolean | Default false |
| createdAt | DateTime | Auto, UTC |

**PersonEvent**
| Attribute | Type | Constraints |
|---|---|---|
| id | String | PK, cuid |
| personId | String | FK → Person (cascade delete) |
| occasionId | String | FK → Occasion |
| date | DateTime | Required |
| notes | String | Optional |

**GiftIdea**
| Attribute | Type | Constraints |
|---|---|---|
| id | String | PK, cuid |
| personId | String | FK → Person (cascade delete) |
| occasionId | String | FK → Occasion, Optional |
| title | String | Required |
| notes | String | Optional |
| todoNotes | String | Optional |
| imageUrl | String | Optional, URL |
| status | String | Enum: IDEA/ORDERED/BOUGHT/GIVEN, Default IDEA |
| createdAt | DateTime | Auto, UTC |
| updatedAt | DateTime | Auto-updated, UTC |

**GiftLink**
| Attribute | Type | Constraints |
|---|---|---|
| id | String | PK, cuid |
| giftIdeaId | String | FK → GiftIdea (cascade delete) |
| url | String | Required |
| label | String | Optional |

**GivenGift**
| Attribute | Type | Constraints |
|---|---|---|
| id | String | PK, cuid |
| personId | String | FK → Person (cascade delete) |
| occasionId | String | FK → Occasion, Optional |
| sourceIdeaId | String | FK → GiftIdea, Unique, Optional |
| title | String | Required |
| notes | String | Optional |
| imageUrl | String | Optional, URL |
| givenDate | DateTime | Required |
| createdAt | DateTime | Auto, UTC |

---

## 7. Use Cases

### UC-01: Add a Person

| Field | Description |
|---|---|
| **Actor** | User |
| **Precondition** | The application is running |
| **Main Flow** | 1. User navigates to /people/new. 2. User enters name (required), optional birthday and notes. 3. User submits the form. 4. System creates the person with a generated share token and redirects to the person's detail page. |
| **Alternative Flow** | 3a. Name is empty → system displays a validation error; person is not created. |
| **Postcondition** | A new Person record exists in the database. |

### UC-02: Track a Gift Idea Through Its Lifecycle

| Field | Description |
|---|---|
| **Actor** | User |
| **Precondition** | At least one person exists |
| **Main Flow** | 1. User opens a person's detail page. 2. User clicks "+ Idea" and fills in the title and optional fields. 3. System creates the idea with status IDEA. 4. User changes status to ORDERED, then BOUGHT using the inline status selector. 5. User clicks "Mark Given", selects a date and occasion. 6. System creates a GivenGift record, sets idea status to GIVEN. |
| **Alternative Flow** | 5a. User logs a given gift directly via "Log Given Gift Directly" without a prior idea. |
| **Postcondition** | GivenGift record exists; GiftIdea status is GIVEN (if promoted from idea). |

### UC-03: Receive an Occasion Notification

| Field | Description |
|---|---|
| **Actor** | User |
| **Precondition** | At least one person has a birthday within 30 days; notification has not been checked today |
| **Main Flow** | 1. User opens the application. 2. Root layout calls /api/notifications. 3. System identifies birthdays and events within the 30-day window. 4. System returns notification data. 5. A modal is displayed listing the upcoming occasions and relevant gift ideas. 6. User dismisses the modal or navigates to a person page. |
| **Alternative Flow** | 2a. Notification was already checked today (sessionStorage key present) → no request is made. |
| **Postcondition** | User is aware of upcoming occasions. sessionStorage key is set for today. |

### UC-04: Share Gift Ideas Publicly

| Field | Description |
|---|---|
| **Actor** | User; Share Recipient |
| **Precondition** | A person exists in the system |
| **Main Flow** | 1. User opens person detail page. 2. User clicks "Copy" next to the share link. 3. User sends the URL to a recipient. 4. Recipient opens the URL in a browser without logging in. 5. System displays the person's non-GIVEN gift ideas in a read-only view. |
| **Alternative Flow** | 1a. User clicks "Regenerate" → a new share token is issued; the old URL becomes invalid. |
| **Postcondition** | Recipient can view gift ideas without accessing the main application. |

### UC-05: Get AI Gift Suggestions

| Field | Description |
|---|---|
| **Actor** | User |
| **Precondition** | A person exists; GEMINI_API_KEY is configured |
| **Main Flow** | 1. User opens person detail page. 2. User clicks "AI Suggestions". 3. System sends a prompt to Gemini including person notes and gift history. 4. Gemini returns 5 suggestions. 5. Suggestions are displayed in a modal. 6. User clicks "Save" on a suggestion → it is created as a new IDEA for that person. |
| **Alternative Flow** | 3a. GEMINI_API_KEY is not set → modal shows a human-readable message. 3b. Gemini API returns an error → modal displays the error message. |
| **Postcondition** | Optionally, one or more new GiftIdea records are created. |

---

## 8. Constraints and Assumptions

### 8.1 Constraints

| ID | Constraint |
|---|---|
| CON-01 | The application shall not implement user authentication. Access control is limited to the share token mechanism for the public view. |
| CON-02 | Image storage shall be URL-only. Binary file uploads are out of scope for the current version. |
| CON-03 | The SQLite database file is excluded from version control. |
| CON-04 | The Gemini API free tier imposes rate limits (requests per minute and per day). The application shall not implement retry logic; users shall be informed of API errors directly. |
| CON-05 | The application shall be built as a single Next.js project; separate frontend and backend codebases are not permitted. |

### 8.2 Assumptions

| ID | Assumption |
|---|---|
| ASM-01 | The user has Node.js ≥ 20.9 installed locally before running the application. |
| ASM-02 | A valid Google Gemini API key with active free-tier or paid quota is available for AI suggestions. |
| ASM-03 | The teacher/evaluator accessing the deployed application has a modern browser as defined in section 2.4. |
| ASM-04 | All dates stored in the database are in UTC. Date display formatting is handled client-side using the browser's local timezone. |
| ASM-05 | The "Birthday" and "Christmas" occasion types are always present in the database (seeded on first migration). |

---

*End of Document — SRS-GP-001 v1.0*
