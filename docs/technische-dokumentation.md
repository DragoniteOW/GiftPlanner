# Technische Dokumentation – Gift Planner

## 1. Architekturübersicht

Gift Planner ist eine Fullstack-Webanwendung auf Basis von **Next.js 16** mit dem App Router. Frontend und Backend laufen im gleichen Repository und werden gemeinsam auf Vercel deployt.

```
Browser
  │
  ▼
Next.js App (Vercel)
  ├── Server Components  →  direkte Datenbankabfragen via Prisma
  ├── Client Components  →  interaktive UI, rufen API Routes auf
  └── API Routes (Route Handlers)  →  REST-Endpunkte
          │
          ▼
      Prisma ORM
          │
          ▼
   PostgreSQL (Neon)
          
Zusätzlich:
  API Routes  →  Google Gemini API  (nur für KI-Vorschläge)
```

### Designprinzipien

- **Server Components** werden für alle datenzentrierten Seiten verwendet (Listenansichten, Detailseiten). Sie lesen die Datenbank direkt ohne API-Umweg.
- **Client Components** werden nur dort eingesetzt, wo Interaktivität nötig ist (Formulare, Dialoge, Toast-Benachrichtigungen, Statusselects).
- Alle Seiten, die Datenbankabfragen enthalten, exportieren `export const dynamic = 'force-dynamic'`, um statisches Pre-Rendering bei leerem Datenbankzustand zu verhindern.

---

## 2. Technologie-Stack

| Schicht         | Technologie           | Version   |
|-----------------|-----------------------|-----------|
| Framework       | Next.js               | 16.2.4    |
| Sprache         | TypeScript            | ^5        |
| UI-Bibliothek   | shadcn/ui (Base UI)   | ^4.7.0    |
| Styling         | Tailwind CSS          | ^4        |
| ORM             | Prisma                | ^5.22.0   |
| Datenbank       | PostgreSQL (Neon)     | –         |
| KI-Integration  | Google Gemini API     | gemini-2.5-flash |
| Toast-System    | Sonner                | ^2.0.7    |
| Icons           | Lucide React          | ^1.14.0   |
| Deployment      | Vercel                | –         |

---

## 3. Verzeichnisstruktur

```
gift-planner/
├── app/
│   ├── page.tsx                          # Dashboard (Server Component)
│   ├── layout.tsx                        # Root Layout mit Navigation
│   ├── api/                              # API Route Handlers
│   │   ├── ai/suggestions/route.ts       # KI-Vorschläge
│   │   ├── notifications/route.ts        # Benachrichtigungen
│   │   ├── occasions/route.ts            # Globale Anlässe
│   │   └── people/
│   │       ├── route.ts                  # Personenliste
│   │       └── [id]/
│   │           ├── route.ts              # Einzelne Person
│   │           ├── ideas/
│   │           │   ├── route.ts          # Ideen einer Person
│   │           │   └── [ideaId]/
│   │           │       ├── route.ts      # Einzelne Idee
│   │           │       └── promote/route.ts  # Idee → überreicht
│   │           ├── given-gifts/route.ts  # Überreichte Geschenke
│   │           └── occasions/
│   │               ├── route.ts          # Ereignisse einer Person
│   │               └── [eventId]/route.ts
│   ├── people/
│   │   ├── page.tsx                      # Personenliste
│   │   ├── new/page.tsx                  # Person anlegen
│   │   └── [id]/
│   │       ├── page.tsx                  # Personendetail
│   │       ├── edit/page.tsx             # Person bearbeiten
│   │       ├── IdeaStatusSelect.tsx      # Statusauswahl (nicht mehr aktiv genutzt)
│   │       ├── ShareSection.tsx          # Teilen-Dialog
│   │       ├── ideas/
│   │       │   ├── new/page.tsx          # Idee anlegen
│   │       │   └── [ideaId]/
│   │       │       ├── edit/page.tsx     # Idee bearbeiten
│   │       │       └── promote/page.tsx  # Idee überreichen
│   │       ├── given-gifts/new/page.tsx  # Geschenk direkt erfassen
│   │       └── occasions/
│   │           ├── new/page.tsx          # Ereignis anlegen
│   │           └── [eventId]/edit/page.tsx
│   ├── occasions/page.tsx                # Anlässe verwalten
│   ├── print/page.tsx                    # Druckansicht
│   └── share/[token]/page.tsx            # Öffentliche Teilen-Ansicht
├── components/
│   ├── AIModal.tsx                       # KI-Vorschlagsmodal
│   ├── Nav.tsx                           # Navigationsleiste
│   ├── NotificationModal.tsx             # Benachrichtigungsmodal
│   ├── StatusBadge.tsx                   # Statussanzeige
│   └── ui/                              # shadcn/ui Basiskomponenten
├── lib/
│   ├── gemini.ts                         # Gemini API Integration
│   ├── notifications.ts                  # Benachrichtigungslogik
│   └── prisma.ts                         # Prisma Client Singleton
├── prisma/
│   ├── schema.prisma                     # Datenbankschema
│   ├── seed.ts                           # Seed-Daten
│   └── migrations/                       # SQL-Migrationen
└── docs/                                 # Projektdokumentation
```

---

## 4. Datenbankschema

Alle IDs werden als CUID (Collision-resistant Unique Identifier) generiert.

### Entity-Relationship-Übersicht

```
Person ──< GiftIdea ──< GiftLink
  │            │
  │            └──> GivenGift
  │
  ├──< PersonEvent >── Occasion
  │
  └──< GivenGift >── Occasion
```

### Tabellen

#### Person
| Feld        | Typ       | Beschreibung                              |
|-------------|-----------|-------------------------------------------|
| id          | String    | Primärschlüssel (CUID)                    |
| name        | String    | Anzeigename                               |
| birthday    | DateTime? | Optionales Geburtsdatum                   |
| notes       | String?   | Freitextnotizen / Interessen              |
| shareToken  | String    | Eindeutiger Token für Teilen-Link (CUID)  |
| createdAt   | DateTime  | Erstellungszeitpunkt                      |

#### Occasion
| Feld      | Typ     | Beschreibung                          |
|-----------|---------|---------------------------------------|
| id        | String  | Primärschlüssel (CUID)                |
| name      | String  | Bezeichnung (unique)                  |
| isBuiltIn | Boolean | `true` für Geburtstag und Weihnachten |
| createdAt | DateTime | Erstellungszeitpunkt                 |

#### PersonEvent
| Feld       | Typ      | Beschreibung                            |
|------------|----------|-----------------------------------------|
| id         | String   | Primärschlüssel (CUID)                  |
| personId   | String   | Fremdschlüssel → Person (Cascade-Delete)|
| occasionId | String   | Fremdschlüssel → Occasion               |
| date       | DateTime | Datum des Ereignisses                   |
| notes      | String?  | Optionale Notizen                       |

#### GiftIdea
| Feld       | Typ      | Beschreibung                             |
|------------|----------|------------------------------------------|
| id         | String   | Primärschlüssel (CUID)                   |
| personId   | String   | Fremdschlüssel → Person (Cascade-Delete) |
| occasionId | String?  | Optionaler Fremdschlüssel → Occasion     |
| title      | String   | Bezeichnung des Geschenks                |
| notes      | String?  | Detailnotizen                            |
| todoNotes  | String?  | Aufgabennotizen                          |
| imageUrl   | String?  | URL eines Produktbilds                   |
| status     | String   | `IDEA` / `ORDERED` / `BOUGHT` / `GIVEN`  |
| createdAt  | DateTime | Erstellungszeitpunkt                     |
| updatedAt  | DateTime | Letzter Änderungszeitpunkt               |

#### GiftLink
| Feld       | Typ     | Beschreibung                              |
|------------|---------|-------------------------------------------|
| id         | String  | Primärschlüssel (CUID)                    |
| giftIdeaId | String  | Fremdschlüssel → GiftIdea (Cascade-Delete)|
| url        | String  | URL                                       |
| label      | String? | Optionale Bezeichnung                     |

#### GivenGift
| Feld         | Typ      | Beschreibung                                           |
|--------------|----------|--------------------------------------------------------|
| id           | String   | Primärschlüssel (CUID)                                 |
| personId     | String   | Fremdschlüssel → Person (Cascade-Delete)               |
| occasionId   | String?  | Optionaler Fremdschlüssel → Occasion                   |
| sourceIdeaId | String?  | Optionaler Fremdschlüssel → GiftIdea (unique, nullable)|
| title        | String   | Bezeichnung des Geschenks                              |
| notes        | String?  | Notizen                                                |
| imageUrl     | String?  | URL eines Bilds                                        |
| givenDate    | DateTime | Datum der Übergabe                                     |
| createdAt    | DateTime | Erstellungszeitpunkt                                   |

---

## 5. API-Schnittstellen

Alle Endpunkte liefern und erwarten JSON. Fehlerantworten enthalten ein `{ error: string }`-Objekt.

### Personen

| Methode | Pfad                        | Beschreibung               |
|---------|-----------------------------|----------------------------|
| GET     | `/api/people`               | Alle Personen abrufen      |
| POST    | `/api/people`               | Neue Person anlegen        |
| GET     | `/api/people/:id`           | Einzelne Person abrufen    |
| PUT     | `/api/people/:id`           | Person aktualisieren       |
| DELETE  | `/api/people/:id`           | Person löschen             |

### Geschenkideen

| Methode | Pfad                                    | Beschreibung              |
|---------|-----------------------------------------|---------------------------|
| GET     | `/api/people/:id/ideas`                 | Ideen einer Person        |
| POST    | `/api/people/:id/ideas`                 | Neue Idee anlegen         |
| GET     | `/api/people/:id/ideas/:ideaId`         | Einzelne Idee abrufen     |
| PUT     | `/api/people/:id/ideas/:ideaId`         | Idee aktualisieren        |
| DELETE  | `/api/people/:id/ideas/:ideaId`         | Idee löschen              |
| POST    | `/api/people/:id/ideas/:ideaId/promote` | Idee als überreicht markieren (Transaktion) |

### Überreichte Geschenke

| Methode | Pfad                             | Beschreibung                          |
|---------|----------------------------------|---------------------------------------|
| GET     | `/api/people/:id/given-gifts`    | Überreichte Geschenke einer Person    |
| POST    | `/api/people/:id/given-gifts`    | Geschenk direkt erfassen              |

### Anlässe und Ereignisse

| Methode | Pfad                                          | Beschreibung                         |
|---------|-----------------------------------------------|--------------------------------------|
| GET     | `/api/occasions`                              | Alle Anlässe abrufen                 |
| POST    | `/api/occasions`                              | Neuen Anlass anlegen                 |
| DELETE  | `/api/occasions/:id`                          | Anlass löschen (nur nicht-systemeigene) |
| GET     | `/api/people/:id/occasions`                   | Ereignisse einer Person              |
| POST    | `/api/people/:id/occasions`                   | Ereignis anlegen                     |
| PUT     | `/api/people/:id/occasions/:eventId`          | Ereignis aktualisieren               |
| DELETE  | `/api/people/:id/occasions/:eventId`          | Ereignis löschen                     |

### Sonstiges

| Methode | Pfad                          | Beschreibung                                      |
|---------|-------------------------------|---------------------------------------------------|
| POST    | `/api/ai/suggestions`         | KI-Vorschläge abrufen (Body: `{ personId }`)      |
| GET     | `/api/notifications`          | Aktuelle Benachrichtigungen abrufen               |
| GET     | `/api/share/:token`           | Öffentliche Personendaten per Share-Token abrufen |

---

## 6. Externe Schnittstellen

### Google Gemini API

- **Endpunkt**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Authentifizierung**: API-Key als Query-Parameter (`?key=...`)
- **Aufruf**: Ausschließlich serverseitig (in `lib/gemini.ts` und der zugehörigen API Route)
- **Prompt-Struktur**: Name, Interessen, bereits geplante und überreichte Geschenke; Antwort als nummerierte Liste auf Deutsch
- **Fehlerverhalten**: Bei fehlendem API-Key oder HTTP-Fehler wird eine sprechende Fehlermeldung auf Deutsch zurückgegeben; die Anwendung bleibt voll funktionsfähig

---

## 7. Wichtige Komponenten

### `Nav.tsx`
Navigationsleiste mit Links zu allen Hauptbereichen und dem `NotificationModal`.

### `NotificationModal.tsx`
Client Component. Ruft `/api/notifications` ab und zeigt bevorstehende Anlässe in einem Dialog an. Wird in der Navigation eingebunden.

### `AIModal.tsx`
Client Component. Öffnet ein Dialogfenster, ruft `/api/ai/suggestions` auf und zeigt die Vorschläge an. Bietet einen Button zum Überführen aller Vorschläge in ein neues Ideen-Formular via URL-Parameter.

### `ShareSection.tsx`
Client Component. Zeigt einen „Teilen"-Button, der einen Dialog mit dem Share-Link öffnet. Ermöglicht das Kopieren des Links und die Neugenerierung des Tokens.

### `StatusBadge.tsx`
Kleines, zustandsloses Server-/Client-kompatibles UI-Element, das den Geschenkstatus farbkodiert anzeigt.

### `lib/notifications.ts`
Serverseitige Funktion `getNotifications()`, die Personen und Ereignisse aus der Datenbank liest und eine Liste bevorstehender Anlässe mit den jeweils relevanten Ideen zurückgibt. Wird sowohl im Dashboard (Server Component) als auch in der API Route für den Client genutzt.

### `lib/gemini.ts`
Serverseitige Funktion `suggestGifts(personId)`, die einen Prompt zusammenstellt und die Gemini API aufruft.

---

## 8. Besonderheiten der UI-Bibliothek (Base UI / shadcn)

Die Anwendung nutzt shadcn/ui, das auf Base UI von Radix aufbaut. **Wichtiger Unterschied zu Radix UI**: Die `SelectValue`-Komponente spiegelt den Text des ausgewählten `SelectItem` nicht automatisch wider. Stattdessen wird der anzuzeigende Text explizit als Children übergeben:

```tsx
<SelectValue>{STATUS_LABELS[form.status] ?? form.status}</SelectValue>
```

Dieses Muster wird in allen Select-Komponenten der Anwendung konsistent verwendet.
