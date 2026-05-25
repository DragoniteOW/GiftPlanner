# Konfigurationsdokument der Softwareentwicklung

**Projekt:** Gift Planner  
**Version:** 1.0  
**Datum:** Mai 2026  
**Status:** Vor Entwicklungsbeginn

---

## 1. Einleitung

### 1.1 Projektbeschreibung

Gift Planner ist eine webbasierte Single-User-Anwendung zur Verwaltung von Geschenkideen und zur Planung von Gelegenheiten (z. B. Geburtstage, Weihnachten). Die Anwendung ermöglicht es dem Nutzer, Personen anzulegen, Geschenkideen zu verwalten, den Fortschritt von der Idee bis zur Übergabe zu verfolgen und mithilfe einer KI-Schnittstelle (Google Gemini) personalisierte Geschenkvorschläge zu erhalten.

### 1.2 Zweck des Dokuments

Dieses Konfigurationsdokument beschreibt, wie die Softwareentwicklung des Projekts organisiert und durchgeführt werden soll. Es legt fest, welche Prozesse, Methoden, Werkzeuge, Artefakte und Rollen eingesetzt werden. Es dient als verbindliche Grundlage für die Durchführungsphase und richtet sich an den Entwickler sowie den betreuenden Dozenten.

### 1.3 Geltungsbereich

Das Dokument gilt für die gesamte Entwicklungsphase des Projekts Gift Planner im Rahmen einer Universitätsveranstaltung.

---

## 2. Vorgehensmodell

### 2.1 Gewähltes Modell

Als Vorgehensmodell wird **Scrum** eingesetzt, angepasst für einen Einzelentwickler. Scrum bietet einen strukturierten, iterativen Rahmen, der es erlaubt, Anforderungen schrittweise zu verfeinern und am Ende jedes Sprints ein lauffähiges Inkrement auszuliefern.

### 2.2 Begründung der Modellwahl

- Der Projektumfang ist überschaubar, aber komplex genug, um von iterativer Planung zu profitieren.
- Anforderungen können sich im Laufe der Entwicklung konkretisieren; Scrum erlaubt diese Anpassungen ohne Neuplanung des Gesamtprojekts.
- Kurze Sprint-Zyklen erzeugen regelmäßige Zwischenergebnisse, die dem Betreuer vorgelegt werden können.

### 2.3 Sprint-Planung

| Sprint | Inhalt (geplant) | Dauer |
|---|---|---|
| Sprint 0 | Anforderungserhebung, Architekturbeschreibung, Backlog befüllen, Projektinfrastruktur einrichten | 1 Woche |
| Sprint 1 | Datenbankmodell, API-Routen (Personen, Gelegenheiten), Grundlayout | 1 Woche |
| Sprint 2 | Geschenkideen-Verwaltung, Statusverwaltung, KI-Vorschläge | 1 Woche |
| Sprint 3 | Benachrichtigungen, Druckansicht, öffentliche Freigabe-URL, Tests | 1 Woche |
| Sprint 4 | Bugfixes, Deployment auf Vercel, finale Abnahme | 1 Woche |

### 2.4 Zeremonien

| Zeremonie | Beschreibung | Durchführung |
|---|---|---|
| Sprint Planning | Auswahl und Schätzung der User Stories für den kommenden Sprint aus dem Product Backlog | Zu Beginn jedes Sprints |
| Daily Stand-up | Kurze tägliche Reflexion: Was wurde gestern erledigt? Was ist heute geplant? Gibt es Hindernisse? | Täglich, selbst durchgeführt |
| Sprint Review | Demonstration des fertiggestellten Inkrements; Abgleich mit den Akzeptanzkriterien | Am Ende jedes Sprints |
| Sprint Retrospektive | Reflexion des Prozesses: Was lief gut? Was sollte verbessert werden? | Am Ende jedes Sprints |

### 2.5 Aufgaben je Rolle im Vorgehensmodell

| Zeremonie | Product Owner | Scrum Master | Developer |
|---|---|---|---|
| Sprint Planning | Priorisiert Backlog, legt Sprintziel fest | Moderiert, sorgt für Timeboxing | Schätzt Aufwand, wählt Stories |
| Daily Stand-up | — | Dokumentiert Hindernisse | Berichtet Fortschritt |
| Sprint Review | Nimmt Inkrement ab | — | Präsentiert Ergebnis |
| Retrospektive | — | Moderiert, dokumentiert Maßnahmen | Identifiziert Verbesserungen |

---

## 3. Anforderungsmanagement

### 3.1 Arbeitsergebnisse

| Artefakt | Beschreibung |
|---|---|
| Software Requirements Specification (SRS) | Strukturiertes Anforderungsdokument nach IEEE 830 mit funktionalen und nicht-funktionalen Anforderungen, Use Cases und Datenmodell |
| User Stories | Kurze, nutzerorientierte Anforderungsbeschreibungen im Format „Als [Rolle] möchte ich [Funktion], damit [Nutzen]." |
| Use Cases | Beschreibung der Interaktionen zwischen Nutzer und System für die wichtigsten Anwendungsfälle |

### 3.2 Techniken

| Technik | Einsatzzweck |
|---|---|
| User Story Mapping | Strukturierung der User Stories entlang des Nutzerflusses; Identifikation von Lücken |
| MoSCoW-Priorisierung | Klassifikation der Anforderungen nach Must-have / Should-have / Could-have / Won't-have |
| Use-Case-Diagramme | Visuelle Darstellung der Systemgrenzen und Akteure |
| Akzeptanzkriterien | Überprüfbare Bedingungen je User Story, die die Basis für Testfälle bilden |

### 3.3 Qualitätssicherung der Anforderungen

- Alle Anforderungen werden auf Vollständigkeit, Eindeutigkeit und Testbarkeit geprüft.
- Am Ende jedes Sprints werden die abgeschlossenen Anforderungen gegen ihre Akzeptanzkriterien abgeglichen.
- Traceability wird sichergestellt: Jede Anforderung ist einer Implementierung und einem Testfall zugeordnet.
- Neue oder geänderte Anforderungen werden im Product Backlog erfasst und beim nächsten Sprint Planning priorisiert.

---

## 4. Artefakte und Zwischenergebnisse

| Artefakt | Beschreibung | Verantwortlich | Zeitpunkt |
|---|---|---|---|
| Anforderungsliste / SRS | Vollständiges Anforderungsdokument nach IEEE 830 mit funktionalen Anforderungen (inkl. IDs), nicht-funktionalen Anforderungen, Datenmodell und Use Cases | Developer (als Product Owner) | Sprint 0 |
| Architekturbeschreibung | Beschreibung der Systemkomponenten (Frontend, API-Routen, Datenbank, externe Dienste), Datenbankschema (ER-Modell) und eingesetzter Technologiestack | Developer | Sprint 0 |
| Product Backlog | Priorisierte, vollständige Liste aller User Stories mit Akzeptanzkriterien und Priorisierung nach MoSCoW | Developer (als Product Owner) | Sprint 0, laufend gepflegt |
| Sprint Backlog | Teilmenge des Product Backlogs für den aktuellen Sprint, aufgeteilt in konkrete Teilaufgaben mit Schätzung | Developer | Zu Beginn jedes Sprints |
| Testfälle | Beschreibung der manuellen Testfälle je Anforderung: Vorbedingung, Eingabe, erwartetes Ergebnis | Developer | Sprint 1–3 |
| Testprotokoll | Dokumentation der durchgeführten Tests mit Datum, Tester, Testergebnis (bestanden / fehlgeschlagen) und Bemerkungen | Developer | Sprint 1–4 |
| Bugliste | Erfassung aller gefundenen Fehler mit Beschreibung, Schweregrad und Status (offen / in Bearbeitung / behoben) | Developer | Laufend |
| Softwareprodukt | Lauffähige Web-Anwendung inkl. vollständigem Quellcode, deploybar auf Vercel; Repository auf GitHub | Developer | Sprint 4 |

---

## 5. Eingesetzte Programmiersprachen

| Sprache | Einsatzbereich |
|---|---|
| **TypeScript** | Primärsprache für die gesamte Anwendung: Next.js Frontend-Komponenten (React), API-Routen (serverseitige Handler), Datenbankzugriff über Prisma, Hilfsfunktionen und Konfigurationsdateien |
| **SQL** | Datenbankabfragen; wird über das Prisma ORM abstrahiert (kein direktes SQL im Anwendungscode außer bei Migrationen) |
| **HTML / CSS** | Markup-Struktur via JSX in React-Komponenten; Styling über Tailwind CSS (Utility-Klassen) sowie komponentenbasierte Styles durch shadcn/ui |
| **Markdown** | Gesamte Projektdokumentation (SRS, Konfigurationsdokument, README) |

---

## 6. Benötigte Systeme

### 6.1 Organisationssysteme

| System | Zweck |
|---|---|
| **GitHub** (Repository-Hosting) | Versionskontrolle des Quellcodes, Verwaltung von Issues und Branches |
| **GitHub Projects** (Kanban-Board) | Verwaltung von Product Backlog und Sprint Backlog; Aufgabenverfolgung während der Sprints |

### 6.2 Entwicklungssysteme

| System / Werkzeug | Version | Zweck |
|---|---|---|
| **macOS** | 15.x | Entwicklungsbetriebssystem |
| **Visual Studio Code** | aktuell | Integrierte Entwicklungsumgebung (IDE) |
| **Node.js** | 20 LTS | JavaScript-Laufzeitumgebung für die Ausführung von Next.js und npm-Skripten |
| **npm** | mitgeliefert mit Node.js | Paketverwaltung; Installation und Verwaltung aller Projektabhängigkeiten |
| **Next.js** | 15 (App Router) | Web-Framework: Frontend-Rendering (React Server Components) und API-Routen (Route Handlers) |
| **Prisma ORM** | 5 | Datenbankzugriff und Schema-Migration; Abstraktion über SQLite |
| **SQLite** | eingebettet | Relationale Datenbank für die lokale Entwicklung; Datei-basiert (`dev.db`) |
| **Tailwind CSS** | 4 | Utility-first CSS-Framework für das Styling der Benutzeroberfläche |
| **shadcn/ui** | aktuell | Komponentenbibliothek auf Basis von Tailwind CSS und Base UI (Buttons, Dialoge, Tabs etc.) |
| **Google Gemini API** | gemini-2.5-flash | Externer KI-Dienst für die Generierung personalisierter Geschenkvorschläge |

### 6.3 Testsysteme

| System / Werkzeug | Zweck |
|---|---|
| **Google Chrome / Mozilla Firefox** | Manueller UI-Test der Webanwendung im Browser |
| **curl** | Manueller Test der API-Endpunkte über die Kommandozeile |
| **Postman** | Strukturierter API-Test mit gespeicherten Testszenarien (optional) |

### 6.4 Bereitstellungssysteme

| System | Zweck |
|---|---|
| **Vercel** | Continuous Deployment: automatisches Build und Deployment bei Push auf den `main`-Branch; Verwaltung von Umgebungsvariablen (z. B. `GEMINI_API_KEY`) |
| **Vercel CLI** | Lokales Deployment und Vorschau von Deployment-Umgebungen |

### 6.5 Betriebssysteme

| System | Zweck |
|---|---|
| **Vercel (Cloud-Hosting)** | Produktionsbetrieb der Webanwendung; globales CDN; serverlose Ausführung der API-Routen |
| **SQLite (Produktionsdatenbank)** | Persistente Datenspeicherung im Produktionsbetrieb (eingebettet in Vercel-Filesystem oder über persistente Speicherlösung) |

---

## 7. Rollen inkl. Ergebnisverantwortung

Da es sich um ein Einzelprojekt im universitären Kontext handelt, übernimmt der Entwickler mehrere Rollen gleichzeitig. Die Trennung der Rollen dient der strukturierten Wahrnehmung der jeweiligen Verantwortlichkeiten.

| Rolle | Person | Ergebnisverantwortung |
|---|---|---|
| **Product Owner** | Student (Entwickler) | Pflege und Priorisierung des Product Backlogs; Definition von Akzeptanzkriterien; Abnahme der fertiggestellten Inkremente am Ende jedes Sprints |
| **Scrum Master** | Student (Entwickler) | Einhaltung des Scrum-Prozesses; Moderation der Sprint-Zeremonien; Dokumentation von Hindernissen und Maßnahmen; Pflege der Sprint-Dokumentation |
| **Developer** | Student (Entwickler) | Vollständige technische Implementierung der Anwendung; Erstellung und Durchführung von Testfällen; Pflege des Testprotokolls und der Bugliste; Deployment auf Vercel |
| **Stakeholder / Auftraggeber** | Universitätsbetreuer / Dozent | Validierung der Anforderungen; Feedback zu Zwischenständen; finale Projektabnahme und Bewertung |

### 7.1 Ergebnisverantwortung im Überblick

| Artefakt | Verantwortliche Rolle |
|---|---|
| SRS / Anforderungsliste | Product Owner |
| Architekturbeschreibung | Developer |
| Product Backlog | Product Owner |
| Sprint Backlog | Scrum Master + Developer |
| Implementierung (Quellcode) | Developer |
| Testfälle | Developer |
| Testprotokoll | Developer |
| Bugliste | Developer |
| Sprint-Dokumentation | Scrum Master |
| Deployment | Developer |
| Finale Abnahme | Stakeholder |

---

## 8. Qualitätssicherung

### 8.1 Maßnahmen

| Maßnahme | Beschreibung | Zeitpunkt |
|---|---|---|
| Anforderungs-Review | Prüfung aller Anforderungen auf Vollständigkeit, Eindeutigkeit und Testbarkeit | Sprint 0 |
| Akzeptanztests | Manuelle Überprüfung jeder implementierten User Story gegen ihre Akzeptanzkriterien | Ende jedes Sprints |
| API-Tests | Test aller API-Endpunkte mit curl oder Postman | Sprint 1–3 |
| UI-Tests | Manuelle End-to-End-Tests der wichtigsten Nutzungsszenarien im Browser | Sprint 2–4 |
| Code-Review (selbst) | Durchsicht des eigenen Codes vor Abschluss jedes Features | Laufend |
| Deployment-Verifikation | Prüfung der produktiven Anwendung nach jedem Deployment | Sprint 4 |

### 8.2 Definition of Done

Eine User Story gilt als abgeschlossen, wenn:
- alle Akzeptanzkriterien erfüllt sind,
- der Code auf dem `main`-Branch eingecheckt ist,
- ein Testfall für die Anforderung existiert und im Testprotokoll dokumentiert ist,
- keine bekannten kritischen Fehler (Schweregrad „hoch") in der Bugliste offen sind.

---

*Dokument erstellt vor Beginn der Durchführungsphase. Änderungen werden im Rahmen des Sprint-Prozesses dokumentiert.*
