# DashForge

DashForge est un mini **dashboard builder** développé avec **Next.js**, **TypeScript** et **Tailwind CSS**.

L’objectif du projet est de permettre la création rapide de dashboards dynamiques à partir d’une **API REST** ou d’un **JSON brut**, sans avoir à coder manuellement chaque composant.

## Fonctionnalités actuelles

- Import de données depuis une API en `GET`
- Import de données depuis un JSON brut
- Analyse automatique de la structure JSON
- Détection des collections exploitables
- Création de widgets dynamiques :
  - KPI Card
  - Tableau
  - Graphique en barres
  - Liste dynamique
- Sélection des champs à afficher depuis l’interface
- Canvas avec système de grille
- Déplacement des widgets
- Redimensionnement des widgets
- Export JSON du dashboard généré

## Stack technique

- Next.js
- TypeScript
- Tailwind CSS
- React Grid Layout
- Recharts

## Concept

Le fonctionnement repose sur un principe simple :

```txt
API / JSON brut
↓
Analyse automatique des données
↓
Détection des collections
↓
Choix d’un outil
↓
Configuration du widget
↓
Ajout dans le dashboard
