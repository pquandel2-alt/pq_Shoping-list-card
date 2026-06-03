# 🛒 Shopping List Card

Eine Custom Lovelace Card für Home Assistant, die deine Einkaufsliste **automatisch nach Kategorien sortiert** – im modernen Glasmorphism-Stil mit vier wählbaren Designs.

Funktioniert mit jeder `todo`-Entität (Bring!, lokale To-do-Listen etc.) und bleibt vollständig mit der jeweiligen App synchron.

## ✨ Features

- **Automatische Kategorie-Sortierung** – über 600 deutsche Produkte sind hinterlegt und werden den passenden Kategorien zugeordnet
- **Artikel hinzufügen** direkt in der Card per Eingabefeld
- **Abhaken per Tipp** – erledigte Artikel wandern nach unten und werden durchgestrichen
- **Erledigte löschen** – ein Button entfernt alle erledigten Artikel auf einmal
- **Wiederherstellen** – versehentlich abgehakte Artikel per Tipp auf den Haken zurückholen
- **4 Designs** – Glas, Klassisch, Dunkel, Minimalistisch
- **Visueller Editor** – Liste und Design bequem per Dropdown wählen, kein YAML nötig
- **Mengenangaben werden ignoriert** – „2x Milch" landet korrekt unter Molkerei

## 📦 Installation

### Über HACS (Custom Repository)

1. HACS → Frontend → ⋮ (drei Punkte oben rechts) → **Custom Repositories**
2. URL: `https://github.com/pquandel2-alt/Shoping-list-card-`
3. Kategorie: **Lovelace**
4. Hinzufügen → **Herunterladen** → Browser neu laden

### Manuell

1. `shopping-list-card.js` nach `/config/www/` kopieren
2. In `configuration.yaml` eintragen:

```yaml
lovelace:
  resources:
    - url: /local/shopping-list-card.js
      type: module
```

## 🚀 Verwendung

Am einfachsten über den **visuellen Editor**: Card hinzufügen → „Shopping List Card" auswählen → Liste und Design per Dropdown einstellen.

Oder per YAML:

```yaml
type: custom:shopping-list-card
entity: todo.zuhause
theme: glass
```

## ⚙️ Konfiguration

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `entity` | string | `todo.zuhause` | Die anzuzeigende To-do-/Einkaufsliste |
| `theme` | string | `glass` | Design: `glass`, `classic`, `dark` oder `minimal` |

## 🎨 Designs

| Theme | Beschreibung |
|-------|--------------|
| `glass` | Glasmorphism – transparent mit Blur, passt zu Liquid/Frosted Glass Themes |
| `classic` | Klassisches Home Assistant Design über die HA CSS-Variablen |
| `dark` | Dunkles, kräftiges Design |
| `minimal` | Minimalistisch – ohne Hintergrund, nur dezente Linien |

## 🗂 Kategorien

| Kategorie | Icon | Beispiele |
|-----------|------|-----------|
| Obst & Gemüse | 🥦 | Äpfel, Tomaten, Spinat, Kürbis, Kräuter |
| Molkerei | 🥛 | Milch, Butter, Joghurt, Käse, Skyr |
| Backwaren | 🍞 | Brot, Brötchen, Toast, Mehl, Hefe |
| Fleisch & Fisch | 🥩 | Hähnchen, Lachs, Wurst, Frikadellen |
| Getränke | 🥤 | Wasser, Saft, Bier, Kaffee, Schorle |
| Tiefkühl | 🧊 | Pizza, Pommes, Eis, Rahmspinat |
| Vorrat | 🥫 | Nudeln, Reis, Öl, Gewürze, Konserven |
| Haushalt | 🧹 | Spülmittel, Toilettenpapier, Batterien, Tierfutter |
| Sonstiges | 📦 | Alles was nicht automatisch erkannt wird |

## 🔧 Eigene Produkte ergänzen

In `shopping-list-card.js` findest du die Methode `_getCategory()`. Dort kannst du in den jeweiligen Kategorie-Listen weitere Produkte ergänzen oder neue Kategorien anlegen. Die Zuordnung ist nicht case-sensitiv und ignoriert vorangestellte Mengenangaben.

## ℹ️ Hinweise

- Die Kategorisierung basiert auf einer eigenen Wortliste, **nicht** auf den Kategorien der Bring!-App – diese werden von Home Assistant nicht bereitgestellt.
- Unbekannte Artikel landen automatisch unter „Sonstiges".

## 📄 Lizenz

MIT
