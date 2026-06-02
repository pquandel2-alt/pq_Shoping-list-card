# Shopping List Card

Eine Custom Lovelace Card für Home Assistant die deine Einkaufsliste automatisch nach Kategorien sortiert. Gebaut im Glasmorphism-Stil.

## Features

- Automatische Sortierung nach Kategorie (Obst & Gemüse, Molkerei, Backwaren, Fleisch & Fisch, Getränke, Tiefkühl, Vorrat, Haushalt, Sonstiges)
- Artikel direkt in der Card hinzufügen
- Artikel per Tipp abhaken (wird als “completed” markiert)
- Glasmorphism Design passend zu Liquid Glass / Frosted Glass Themes
- Funktioniert mit jeder `todo` Entität (Bring!, lokale Listen etc.)
- Mengenangaben werden bei der Kategorisierung ignoriert (z.B. “2x Milch” → Molkerei)

## Installation

### Über HACS (empfohlen)

1. HACS → Frontend → ⋮ → Custom Repositories
1. URL: `https://github.com/DEIN-USERNAME/shopping-list-card`
1. Kategorie: `Lovelace`
1. Download → HA neu laden

### Manuell

1. `shopping-list-card.js` nach `/config/www/` kopieren
1. In `configuration.yaml` unter `lovelace > resources` eintragen:

```yaml
lovelace:
  resources:
    - url: /local/shopping-list-card.js
      type: module
```

## Verwendung

```yaml
type: custom:shopping-list-card
entity: todo.zuhause
```

## Eigene Produkte ergänzen

In der Datei `shopping-list-card.js` findest du die `_getCategory()` Methode. Dort kannst du neue Produkte zu bestehenden Kategorien hinzufügen oder neue Kategorien anlegen.

## Kategorien

|Kategorie      |Icon|Beispiele                   |
|---------------|----|----------------------------|
|Obst & Gemüse  |🥦   |Äpfel, Tomaten, Spinat      |
|Molkerei       |🥛   |Milch, Butter, Joghurt      |
|Backwaren      |🍞   |Brot, Brötchen, Toast       |
|Fleisch & Fisch|🥩   |Hähnchen, Lachs, Wurst      |
|Getränke       |🥤   |Wasser, Saft, Bier          |
|Tiefkühl       |🧊   |Pizza, Erbsen TK, Eis       |
|Vorrat         |🥫   |Nudeln, Reis, Öl            |
|Haushalt       |🧹   |Spülmittel, Toilettenpapier |
|Sonstiges      |📦   |Alles was nicht erkannt wird|