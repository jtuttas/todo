# Todo-App Frontend

Eine moderne Single-Page-Application (SPA) zur Verwaltung von Aufgaben (To-dos) für Mitarbeiter, Abteilungsleiter und Administratoren.

## Tech Stack

- React 18 + TypeScript 5
- Vite
- Tailwind CSS 3
- React Router v6
- React Query v5
- Axios
- React Hook Form + Zod
- Sonner (Toasts)
- Lucide React (Icons)

## Rollen

| Rolle | Rechte |
|-------|--------|
| Mitarbeiter | Eigene Aufgaben sehen, als erledigt markieren, filtern/sortieren |
| Abteilungsleiter | + Team-Aufgaben, neue Aufgaben erstellen, Projekte & Prioritäten verwalten |
| Administrator | + Benutzerverwaltung |

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

App läuft unter: http://localhost:5173/todo/

## Build

```bash
npm run build
```

## Umgebungsvariablen

Erstelle eine `.env` Datei (oder nutze `.env.example` als Vorlage):

```
VITE_API_URL=https://lf9server.onrender.com
```

## Deployment

Die App wird automatisch via GitHub Actions auf GitHub Pages deployed, wenn auf den `main`-Branch gepusht wird.

Live-URL: https://jtuttas.github.io/todo/
