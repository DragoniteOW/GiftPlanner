# Fachliche Dokumentation – Gift Planner

## 1. Zweck und Scope

Gift Planner unterstützt Privatpersonen bei der strukturierten Planung und Dokumentation von Geschenken. Die Anwendung deckt den vollständigen Lebenszyklus einer Geschenkidee ab – von der ersten Idee über die Planung bis zur Übergabe – und ermöglicht die Dokumentation vergangener Geschenke.

Die Anwendung ist für Einzelnutzer ausgelegt (kein Multi-User, keine Authentifizierung).

---

## 2. Fachliche Konzepte

### 2.1 Person

Eine **Person** ist eine reale Person, für die Geschenke geplant werden. Sie ist die zentrale Entität der Anwendung. Jede Person hat einen Namen und optional ein Geburtsdatum sowie Notizen (z. B. Interessen, Vorlieben). Diese Notizen werden von der KI-Funktion genutzt, um personalisierte Vorschläge zu generieren.

Jede Person besitzt außerdem einen eindeutigen **Share-Token**, über den ein schreibgeschützter Zugang zu ihren Geschenkideen geteilt werden kann.

### 2.2 Anlass (Occasion)

Ein **Anlass** ist eine Kategorie für den Grund eines Geschenks (z. B. Geburtstag, Weihnachten, Hochzeitstag). Anlässe existieren in zwei Ausprägungen:

- **Systemeigene Anlässe** (`isBuiltIn = true`): „Geburtstag" und „Weihnachten" werden durch die Anwendung verwaltet und können nicht gelöscht oder umbenannt werden.
- **Benutzerdefinierte Anlässe**: Werden vom Nutzer angelegt und können gelöscht werden.

Anlässe sind global und können mehreren Personen zugeordnet werden.

### 2.3 Personenereignis (PersonEvent)

Ein **Personenereignis** verbindet eine Person mit einem Anlass und einem konkreten Datum. Es repräsentiert ein wiederkehrendes oder einmaliges persönliches Ereignis (z. B. Hochzeitstag am 12. September). Ereignisse können Notizen enthalten.

### 2.4 Geschenkidee (GiftIdea)

Eine **Geschenkidee** ist ein konkreter Geschenkvorschlag für eine Person. Sie enthält:

- **Titel**: Kurzbeschreibung des Geschenks (Pflichtfeld)
- **Anlass**: Optionale Zuordnung zu einem Anlass
- **Notizen**: Detailbeschreibung, Größe, Farbe o. Ä.
- **Aufgaben (todoNotes)**: Zu erledigende Schritte (z. B. „Preis prüfen")
- **Bild-URL**: Optionaler Verweis auf ein Produktbild
- **Links**: Beliebig viele Weblinks mit optionaler Bezeichnung
- **Status**: Aktueller Planungsstand (siehe 2.5)

### 2.5 Geschenkstatus

Jede Geschenkidee befindet sich in genau einem der folgenden Status:

| Status    | Bedeutung                                              | Erreichbar über           |
|-----------|--------------------------------------------------------|---------------------------|
| `IDEA`    | Noch unkonkrete Idee                                   | Standardwert beim Anlegen |
| `ORDERED` | Geschenk wurde bestellt                                | Statusdropdown            |
| `BOUGHT`  | Geschenk liegt bereit                                  | Statusdropdown            |
| `GIVEN`   | Geschenk wurde überreicht; Idee ist damit abgeschlossen | Ausschließlich über den Überreichen-Prozess |

Der Status `GIVEN` kann **nicht** über das Statusdropdown gesetzt werden, da bei der Übergabe zwingend ein Datum und optional ein Anlass erfasst werden müssen.

### 2.6 Überreichtes Geschenk (GivenGift)

Ein **überreichtes Geschenk** dokumentiert ein tatsächlich gegebenes Geschenk. Es enthält Titel, Übergabedatum, optionalen Anlass, Notizen und eine optionale Bildreferenz.

Es gibt zwei Wege, ein überreichtes Geschenk zu erfassen:

1. **Über eine Idee** (Überreichen-Prozess): Eine bestehende Idee wird in ein überreichtes Geschenk umgewandelt. Das ursprüngliche `GiftIdea`-Objekt bleibt erhalten (Status wird auf `GIVEN` gesetzt) und ist über das Feld `sourceIdeaId` mit dem `GivenGift` verknüpft.
2. **Direkte Erfassung**: Ein vergangenes Geschenk wird ohne vorherige Idee direkt eingetragen.

---

## 3. Geschäftsprozesse

### 3.1 Lebenszyklen einer Geschenkidee

```
[Anlegen] → IDEA → ORDERED → BOUGHT → [Überreichen-Prozess] → GIVEN
                ↑__________↑_____↓
               (Statuswechsel frei möglich)
```

Der Statuswechsel zwischen `IDEA`, `ORDERED` und `BOUGHT` ist in beide Richtungen frei möglich. Der Übergang zu `GIVEN` ist ein Einweg-Prozess und erzeugt ein separates `GivenGift`-Objekt.

### 3.2 Überreichen-Prozess

1. Nutzer wählt eine Idee und klickt „Als überreicht markieren".
2. Nutzer gibt das Übergabedatum ein und wählt optional einen Anlass.
3. Das System erstellt in einer atomaren Transaktion:
   - Ein neues `GivenGift`-Objekt mit den Daten der Idee und dem angegebenen Datum.
   - Setzt den Status der Idee auf `GIVEN`.
4. Die Idee verschwindet aus der aktiven Ideenliste; das überreichte Geschenk erscheint im Bereich „Vergangene Geschenke".

### 3.3 KI-Vorschlagsprozess

1. Nutzer öffnet das KI-Modal über den Button „KI-Vorschläge" auf der Personendetailseite.
2. Das System sendet einen Prompt an die Google Gemini API, der Folgendes enthält:
   - Name der Person
   - Notizen/Interessen aus dem Personenprofil
   - Titel bereits überreichter Geschenke
   - Titel bereits geplanter Ideen
3. Die API liefert eine nummerierte Liste mit fünf Vorschlägen auf Deutsch.
4. Nutzer kann über „Als Idee erstellen" alle Vorschläge als Notizen in eine neue Idee übernehmen.

### 3.4 Benachrichtigungsprozess

Die Anwendung prüft beim Laden jeder Seite automatisch auf bevorstehende Anlässe:

- **Geburtstag**: Wenn das Geburtsdatum einer Person innerhalb der nächsten 30 Tage liegt.
- **Personenereignisse**: Wenn ein eingetragenes Ereignis einer Person innerhalb der nächsten 30 Tage liegt.
- **Weihnachten**: Wenn das aktuelle Datum zwischen dem 1. und 24. Dezember liegt.

Benachrichtigungen zeigen nur Ideen mit Status `IDEA`, `ORDERED` oder `BOUGHT` an. Bereits überreichte Ideen (`GIVEN`) werden nicht angezeigt.

### 3.5 Teilen-Prozess

1. Nutzer öffnet den Teilen-Dialog auf der Personendetailseite.
2. Die Anwendung generiert oder zeigt den bestehenden Share-Link mit dem einzigartigen Token der Person.
3. Empfänger des Links sehen eine schreibgeschützte Ansicht der aktiven Geschenkideen (ohne Übergabedaten oder persönliche Notizen der Person).
4. Bei Bedarf kann ein neuer Token generiert werden, der den alten Link ungültig macht.

---

## 4. Geschäftsregeln

| Regel | Beschreibung |
|-------|--------------|
| BR-01 | Status `GIVEN` ist ausschließlich über den Überreichen-Prozess erreichbar |
| BR-02 | Ideen mit Status `GIVEN` werden in der Ideenliste, in Benachrichtigungen und in der Druckansicht nicht angezeigt |
| BR-03 | Der Überreichen-Prozess ist atomar: Ideen-Status und GivenGift werden immer gemeinsam gesetzt |
| BR-04 | Jede Person hat genau einen Share-Token; der Token wird beim Anlegen automatisch generiert |
| BR-05 | Share-Links sind schreibgeschützt; Empfänger können keine Daten ändern |
| BR-06 | Systemeigene Anlässe (`Geburtstag`, `Weihnachten`) können nicht gelöscht oder bearbeitet werden |
| BR-07 | Das Löschen einer Person löscht kaskadierend alle zugehörigen Ideen, überreichten Geschenke und Ereignisse |
| BR-08 | Das Löschen einer Idee löscht kaskadierend alle zugehörigen Links |
| BR-09 | Die KI-Vorschläge berücksichtigen Interessen, bereits geplante und bereits überreichte Geschenke, um Wiederholungen zu vermeiden |
| BR-10 | Weihnachtsbenachrichtigungen erscheinen vom 1. bis 24. Dezember; Geburtstags- und Ereignisbenachrichtigungen 30 Tage im Voraus |
