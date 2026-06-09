# Gift Planner

Eine webbasierte Anwendung zur Verwaltung von Geschenkideen. Entwickelt als Universitätsprojekt im Rahmen des Moduls Software Engineering.

## Live-Anwendung

Die Anwendung ist unter folgender URL erreichbar:

**[https://gift-planner-one.vercel.app/](https://gift-planner-one.vercel.app/)**

## Funktionsübersicht

- **Personen verwalten** – Personen mit Name, Geburtstag und Notizen anlegen
- **Geschenkideen planen** – Ideen mit Status (Idee → Bestellt → Gekauft), Anlass, Notizen, Links und Bildern
- **Überreichen-Prozess** – Ideen als überreicht markieren; vergangene Geschenke werden separat geführt
- **Direkte Erfassung** – Vergangene Geschenke auch ohne vorherige Idee dokumentieren
- **Anlässe** – Systemanlässe (Geburtstag, Weihnachten) sowie benutzerdefinierte Anlässe pro Person
- **Benachrichtigungen** – Dashboard-Hinweise auf Anlässe in den nächsten 30 Tagen
- **KI-Vorschläge** – Personalisierte Geschenkvorschläge via Google Gemini API
- **Teilen** – Schreibgeschützter Link pro Person, ohne Login für Empfänger
- **Drucken / Exportieren** – Druckoptimierte Gesamtübersicht aller Personen

## Tech-Stack

| Schicht       | Technologie                     |
|---------------|---------------------------------|
| Framework     | Next.js 16 (App Router)         |
| Sprache       | TypeScript                      |
| UI            | shadcn/ui · Tailwind CSS v4     |
| ORM           | Prisma 5                        |
| Datenbank     | PostgreSQL (Neon)               |
| KI            | Google Gemini API (gemini-2.5-flash) |
| Deployment    | Vercel                          |

## Lokale Entwicklung

### Voraussetzungen

- Node.js ≥ 18
- Zugang zur Neon-Datenbank (Verbindungsstring erforderlich)

### Setup

```bash
# Repository klonen
git clone https://github.com/DragoniteOW/GiftPlanner.git
cd GiftPlanner

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen anlegen
cp .env.example .env
# .env öffnen und DATABASE_URL sowie GEMINI_API_KEY eintragen

# Datenbankschema anwenden und Seed-Daten einspielen
npx prisma migrate deploy
npx prisma db seed

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Umgebungsvariablen

| Variable         | Pflicht | Beschreibung                                      |
|------------------|---------|---------------------------------------------------|
| `DATABASE_URL`   | Ja      | PostgreSQL-Verbindungsstring (Neon)               |
| `GEMINI_API_KEY` | Nein    | Gemini API-Schlüssel für KI-Vorschläge            |

Ohne `GEMINI_API_KEY` bleibt die KI-Funktion deaktiviert; alle anderen Features sind vollständig nutzbar.

## Deployment

Jeder Push auf `main` löst automatisch ein Deployment auf Vercel aus. Der Build-Prozess führt dabei Folgendes aus:

```
prisma generate → prisma migrate deploy → prisma db seed → next build
```

Zur erstmaligen Einrichtung von Vercel und Neon siehe [docs/betriebsdokumentation.md](docs/betriebsdokumentation.md).

## Dokumentation

| Dokument | Inhalt |
|----------|--------|
| [Benutzerhandbuch](docs/benutzerhandbuch.md) | Schritt-für-Schritt-Anleitung für Endnutzer |
| [Fachliche Dokumentation](docs/fachliche-dokumentation.md) | Domänenmodell, Prozesse, Geschäftsregeln |
| [Technische Dokumentation](docs/technische-dokumentation.md) | Architektur, Datenbankschema, API-Übersicht |
| [Betriebsdokumentation](docs/betriebsdokumentation.md) | Installation, Konfiguration, Deployment |
