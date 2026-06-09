# Betriebsdokumentation – Gift Planner

## 1. Systemvoraussetzungen

### Laufzeitumgebung (Produktion)
- **Hosting**: Vercel (automatisches Deployment via GitHub)
- **Datenbank**: Neon PostgreSQL (Serverless, kostenloser Free-Tier)
- **Node.js**: wird von Vercel automatisch bereitgestellt (keine manuelle Verwaltung erforderlich)

### Lokale Entwicklung
- Node.js ≥ 18
- npm ≥ 9
- Zugang zur Neon-Datenbank (lokale SQLite-Nutzung ist nicht mehr vorgesehen; lokale Entwicklung läuft gegen dieselbe Neon-Datenbank)

---

## 2. Umgebungsvariablen

Die Anwendung benötigt genau zwei Umgebungsvariablen:

| Variable          | Pflicht | Beschreibung                                                     |
|-------------------|---------|------------------------------------------------------------------|
| `DATABASE_URL`    | Ja      | PostgreSQL-Verbindungsstring (Neon-Format: `postgresql://...?sslmode=require`) |
| `GEMINI_API_KEY`  | Nein    | API-Schlüssel für Google Gemini. Ohne diesen Wert ist die KI-Vorschlagsfunktion deaktiviert; alle anderen Funktionen bleiben uneingeschränkt nutzbar. |

### Lokale Entwicklung

In der Datei `.env` im Projektstamm eintragen:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
GEMINI_API_KEY="AIza..."
```

Die Datei `.env` ist in `.gitignore` eingetragen und wird nicht ins Repository eingecheckt. Eine `.env.example` mit Platzhaltern ist im Repository vorhanden.

### Produktion (Vercel)

Die Umgebungsvariablen werden im Vercel-Dashboard unter **Project → Settings → Environment Variables** hinterlegt. Scope: **Production** und **Preview**.

---

## 3. Lokale Installation und Entwicklung

```bash
# 1. Repository klonen
git clone https://github.com/DragoniteOW/GiftPlanner.git
cd GiftPlanner

# 2. Abhängigkeiten installieren
npm install

# 3. .env anlegen (siehe Abschnitt 2)

# 4. Prisma Client generieren und Datenbankschema anwenden
npx prisma migrate deploy

# 5. Seed-Daten einspielen (Systemanlässe Geburtstag und Weihnachten)
npx prisma db seed

# 6. Entwicklungsserver starten
npm run dev
```

Die Anwendung ist anschließend unter `http://localhost:3000` erreichbar.

---

## 4. Deployment auf Vercel

### Erstmalige Einrichtung

1. **Neon-Datenbank erstellen**
   - Unter [neon.tech](https://neon.tech) einloggen und ein neues Projekt anlegen.
   - Unter **Connection Details** den Verbindungsstring kopieren.

2. **Vercel-Projekt anlegen**
   - Unter [vercel.com](https://vercel.com) einloggen.
   - **Add New Project → Import Git Repository** → Repository `DragoniteOW/GiftPlanner` auswählen.
   - Vor dem ersten Deployment unter **Environment Variables** eintragen:
     - `DATABASE_URL` = Neon-Verbindungsstring
     - `GEMINI_API_KEY` = Gemini-API-Schlüssel (optional)
   - **Deploy** klicken.

### Automatisches Deployment

Jeder Push auf den Branch `main` löst automatisch ein neues Deployment auf Vercel aus.

### Build-Prozess

Der Vercel-Build führt folgende Schritte in dieser Reihenfolge aus (definiert in `package.json`):

```
prisma generate → prisma migrate deploy → prisma db seed → next build
```

| Schritt                  | Zweck                                                                 |
|--------------------------|-----------------------------------------------------------------------|
| `prisma generate`        | Generiert den Prisma Client in `app/generated/prisma/`               |
| `prisma migrate deploy`  | Wendet ausstehende Datenbankmigrationen auf die Produktionsdatenbank an |
| `prisma db seed`         | Spielt Systemanlässe ein (idempotent, sicher bei jedem Deploy)        |
| `next build`             | Kompiliert die Next.js-Anwendung                                      |

---

## 5. Datenbankverwaltung

### Migrationen

Schemaänderungen werden über Prisma Migrations verwaltet. Eine neue Migration wird lokal erstellt und dann beim nächsten Deployment automatisch angewendet:

```bash
npx prisma migrate dev --name beschreibung-der-aenderung
```

Das erzeugt eine neue Migrationsdatei unter `prisma/migrations/`. Diese muss ins Repository eingecheckt werden.

### Seed-Daten

Die Seed-Datei `prisma/seed.ts` legt die beiden Systemanlässe **Geburtstag** und **Weihnachten** an. Sie verwendet `upsert`, sodass sie bei jedem Deployment idempotent ausgeführt werden kann, ohne Duplikate zu erzeugen.

### Direktzugriff auf die Datenbank

Über das Neon-Dashboard ([console.neon.tech](https://console.neon.tech)) können SQL-Abfragen direkt auf der Produktionsdatenbank ausgeführt werden. Dies ist ausschließlich für administrative Eingriffe vorgesehen.

Alternativ lokal:

```bash
npx prisma studio
```

Öffnet eine grafische Datenbankoberfläche unter `http://localhost:5555`.

---

## 6. Benutzerverwaltung und Zugriffsschutz

Die Anwendung hat **kein eigenes Benutzerkonten- oder Authentifizierungssystem**. Der Zugriff auf die verwaltenden Bereiche ist nicht passwortgeschützt. Wer die URL der Anwendung kennt, hat vollen Schreibzugriff.

Für den produktiven Einsatz im universitären Umfeld (Demo-Betrieb mit bekanntem Nutzerkreis) ist dies ausreichend.

**Öffentlicher Bereich**: Die Seite `/share/:token` ist bewusst öffentlich zugänglich (kein Login erforderlich). Sie ist schreibgeschützt und gibt nur aktive Geschenkideen der jeweiligen Person preis.

---

## 7. Monitoring und Logs

- **Vercel Dashboard**: Unter **Deployments** können Build-Logs und Runtime-Logs (Serverless Function Logs) eingesehen werden.
- **Neon Dashboard**: Zeigt Datenbankverbindungen, Abfragen und Speichernutzung.
- Eigene Logging-Infrastruktur ist nicht eingerichtet.

---

## 8. Bekannte Einschränkungen des Free-Tiers

| Dienst  | Einschränkung                                                                  |
|---------|--------------------------------------------------------------------------------|
| Vercel  | Bei Inaktivität werden Serverless Functions nach kurzer Zeit eingeschlafen; der erste Aufruf kann langsamer sein |
| Neon    | Datenbank pausiert nach Inaktivität (ca. 5 Minuten); Aufwecken beim ersten Zugriff dauert 1–2 Sekunden |
| Neon    | Speicherlimit im Free-Tier: 512 MB; für eine Privatnutzung unkritisch           |
