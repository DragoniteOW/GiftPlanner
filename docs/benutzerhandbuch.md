# Benutzerhandbuch – Gift Planner

## 1. Einführung

Gift Planner ist eine webbasierte Anwendung zur Verwaltung von Geschenkideen. Sie ermöglicht es, für Personen aus dem eigenen Umfeld Geschenkideen zu planen, ihren Status zu verfolgen, vergangene Geschenke zu dokumentieren und Ideen mit anderen zu teilen.

Die Anwendung ist über einen Webbrowser erreichbar und erfordert keine Installation. Es gibt keine Benutzerkonten – die Anwendung ist für den Betrieb durch eine einzelne Nutzerin oder einen einzelnen Nutzer ausgelegt.

---

## 2. Übersicht der Benutzeroberfläche

Die Navigationsleiste am oberen Rand enthält folgende Menüpunkte:

| Menüpunkt      | Beschreibung                                              |
|----------------|-----------------------------------------------------------|
| Übersicht      | Dashboard mit bevorstehenden Anlässen und Personenübersicht |
| Personen       | Liste aller erfassten Personen                            |
| Anlässe        | Verwaltung von Anlässen (z. B. Geburtstag, Weihnachten)  |
| Liste drucken  | Druckansicht aller Geschenkideen und vergangenen Geschenke |

---

## 3. Dashboard (Übersicht)

Das Dashboard zeigt beim Öffnen der Anwendung:

- **Bevorstehende Anlässe**: Personen, bei denen in den nächsten 30 Tagen ein Geburtstag oder ein eingetragener Anlass bevorsteht. Die Anzeige enthält den Namen der Person, den Anlass, die verbleibenden Tage sowie die Anzahl geplanter Ideen.
- **Personenliste**: Alle erfassten Personen mit Geburtstag (falls hinterlegt), Anzahl aktiver Ideen und Anzahl bereits überreichter Geschenke.

Ein Klick auf eine Person öffnet deren Detailseite.

---

## 4. Personen verwalten

### 4.1 Person hinzufügen

1. Auf der Seite „Übersicht" oder „Personen" auf **Person hinzufügen** klicken.
2. Name eingeben (Pflichtfeld).
3. Optional: Geburtstag und Notizen (z. B. Interessen, Vorlieben) eintragen.
4. Auf **Speichern** klicken.

### 4.2 Person bearbeiten

1. Auf der Detailseite einer Person auf **Bearbeiten** klicken.
2. Gewünschte Felder anpassen.
3. Auf **Speichern** klicken oder mit **Abbrechen** verwerfen.

### 4.3 Person löschen

Auf der Bearbeitungsseite befindet sich unten ein **Löschen**-Button. Das Löschen einer Person entfernt alle zugehörigen Ideen, vergangenen Geschenke und Ereignisse unwiderruflich.

---

## 5. Geschenkideen verwalten

### 5.1 Neue Idee hinzufügen

1. Auf der Detailseite einer Person auf **+ Idee** klicken.
2. Titel eingeben (Pflichtfeld).
3. Optional: Anlass auswählen, Notizen, Aufgaben, Bild-URL und Links eintragen.
4. Auf **Idee hinzufügen** klicken.

### 5.2 Idee bearbeiten

1. In der Ideenliste auf **Bearbeiten** neben der Idee klicken.
2. Felder anpassen.
3. Auf **Speichern** klicken.

### 5.3 Status einer Idee verwalten

Jede Geschenkidee hat einen der folgenden Status:

| Status      | Bedeutung                                      |
|-------------|------------------------------------------------|
| Idee        | Noch unkonkrete Idee                           |
| Bestellt    | Das Geschenk wurde bestellt                    |
| Gekauft     | Das Geschenk liegt bereit                      |
| Überreicht  | Das Geschenk wurde überreicht (schreibgeschützt) |

Der Status kann auf der Bearbeitungsseite über das Dropdown-Menü geändert werden. Die Auswahl „Überreicht" ist dort nicht verfügbar – dieser Status wird ausschließlich über den Überreichen-Prozess gesetzt (siehe Abschnitt 5.4).

### 5.4 Geschenk als überreicht markieren

1. Auf der Bearbeitungsseite der Idee auf **Als überreicht markieren** klicken, oder auf der Personendetailseite direkt auf den gleichnamigen Button neben der Idee.
2. Datum der Übergabe eingeben (vorausgefüllt mit dem heutigen Datum).
3. Optional: Anlass auswählen.
4. Auf **Bestätigen** klicken.

Das Geschenk verschwindet aus der Ideenliste und erscheint fortan im Tab **Vergangene Geschenke**.

### 5.5 Idee löschen

Auf der Bearbeitungsseite einer Idee befindet sich unten ein **Löschen**-Button.

---

## 6. Vergangene Geschenke

Der Tab **Vergangene Geschenke** auf der Detailseite einer Person zeigt alle bereits überreichten Geschenke, inklusive Datum und Anlass.

### Geschenk direkt erfassen

Um ein Geschenk zu dokumentieren, das nie als Idee angelegt wurde:

1. Im Tab **Vergangene Geschenke** auf **Geschenk direkt erfassen** klicken.
2. Titel und Datum eingeben (Pflichtfelder).
3. Optional: Anlass, Notizen und Bild-URL eintragen.
4. Auf **Speichern** klicken.

---

## 7. Anlässe verwalten

### 7.1 Systemeigene Anlässe

**Geburtstag** und **Weihnachten** sind fest in der Anwendung hinterlegt und können nicht bearbeitet oder gelöscht werden.

- **Geburtstag**: Wird automatisch aus dem hinterlegten Geburtsdatum der Person berechnet. Benachrichtigung erscheint 30 Tage vor dem Geburtstag.
- **Weihnachten**: Benachrichtigung erscheint vom 1. bis zum 24. Dezember.

### 7.2 Personenspezifische Anlässe

Anlässe wie Hochzeitstage oder Jubiläen können direkt bei einer Person hinterlegt werden:

1. Auf der Detailseite einer Person im Tab **Anlässe** auf **Anlass hinzufügen** klicken.
2. Anlass aus der Liste wählen, Datum eingeben, optional Notizen.
3. Auf **Speichern** klicken.

Vorhandene Ereignisse können über **Bearbeiten** angepasst oder gelöscht werden. Benachrichtigungen für bevorstehende Ereignisse erscheinen automatisch im Dashboard, wenn der Termin innerhalb der nächsten 30 Tage liegt.

### 7.3 Benutzerdefinierte Anlässe anlegen

Unter **Anlässe** in der Navigation können neue Anlasskategorien erstellt (z. B. „Hochzeitstag", „Schulabschluss") und bestehende benutzerdefinierte Anlässe gelöscht werden.

---

## 8. KI-Geschenkvorschläge

1. Auf der Detailseite einer Person auf **KI-Vorschläge** klicken.
2. Die Anwendung generiert fünf personalisierte Vorschläge basierend auf den Notizen der Person sowie bereits geplanten und überreichten Geschenken.
3. Mit **Als Idee erstellen** werden alle fünf Vorschläge als Notizen in eine neue Idee übernommen (Titel: „KI-Vorschlag"). Die Idee kann vor dem Speichern noch angepasst werden.

> Hinweis: Für diese Funktion ist ein gültiger Gemini-API-Schlüssel erforderlich (siehe Betriebsdokumentation).

---

## 9. Teilen-Funktion

Über den **Teilen**-Button auf der Detailseite einer Person kann ein schreibgeschützter Link generiert werden. Personen, die diesen Link erhalten, sehen die aktiven Geschenkideen – ohne Login und ohne Bearbeitungsmöglichkeit.

- Mit **Kopieren** wird der Link in die Zwischenablage kopiert.
- Mit **Link neu generieren** wird ein neuer Token erstellt; der alte Link wird damit ungültig.

---

## 10. Drucken und Exportieren

Unter **Liste drucken** in der Navigation befindet sich eine druckoptimierte Übersicht aller Personen mit ihren aktiven Geschenkideen und vergangenen Geschenken. Mit **Drucken / PDF** kann die Ansicht ausgedruckt oder als PDF gespeichert werden.

---

## 11. Benachrichtigungen

Das Glockensymbol oben in der Navigation zeigt an, wenn Anlässe bevorstehen. Ein Klick öffnet ein Fenster mit allen Personen, bei denen in den nächsten 30 Tagen ein Anlass ansteht, sowie der Anzahl bereits geplanter Ideen.
