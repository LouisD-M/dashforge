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
- Mode canvas grand format
- Page de rendu dynamique du dashboard
- Synchronisation en temps réel entre le builder et la page de rendu
- Sauvegarde locale des dashboards
- Chargement d’un dashboard sauvegardé
- Suppression d’un dashboard sauvegardé
- Génération du JSON représentant le dashboard

## Stack technique

- Next.js
- TypeScript
- Tailwind CSS
- React Grid Layout
- Recharts

## Librairies principales

- `react-grid-layout` : gestion du canvas, drag & drop et resize des widgets
- `react-resizable` : gestion du redimensionnement
- `recharts` : rendu des graphiques

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
↓
Prévisualisation dynamique
↓
Sauvegarde locale du dashboard
```

## Pages principales

### Builder

La page principale permet de construire le dashboard depuis une API ou un JSON brut.

```txt
/
```

### Preview

La page de rendu affiche le dashboard final sans les panneaux de configuration.

```txt
/preview
```

La page de preview est synchronisée en temps réel avec le builder grâce à `localStorage` et `BroadcastChannel`.

## Installation

Installer les dépendances du projet :

```bash
npm install
```

Installer les librairies utilisées pour le canvas, le resize et les graphiques :

```bash
npm install react-grid-layout react-resizable recharts
```

Installer les types nécessaires pour TypeScript :

```bash
npm install -D @types/react-grid-layout @types/react-resizable
```

## Lancer le projet

Le projet est configuré pour être lancé sur le port `5004`.

```bash
npm run dev
```

Ou directement :

```bash
next dev -p 5004
```

Accès local :

```txt
http://localhost:5004
```

Accès depuis le réseau local :

```txt
http://192.168.15.40:5004
```

> L’adresse IP `192.168.15.40` correspond à l’IP réseau de la machine de développement. Elle peut changer selon le poste ou le réseau utilisé.

## Exemples d’API de test

```txt
https://jsonplaceholder.typicode.com/users
```

```txt
https://dummyjson.com/products
```

```txt
https://dummyjson.com/recipes
```

```txt
https://pokeapi.co/api/v2/pokemon?limit=20
```

## Widgets disponibles

### KPI Card

Permet de créer une carte statistique à partir d’une collection détectée.

Exemples :

- Nombre total d’éléments
- Somme d’un champ numérique
- Moyenne d’un champ numérique

### Tableau

Permet d’afficher une collection sous forme de tableau dynamique avec choix des colonnes.

### Graphique en barres

Permet de générer un graphique simple à partir d’un champ de libellé et d’un champ numérique.

### Liste dynamique

Permet d’afficher une collection sous forme de liste compacte avec un champ principal et un champ secondaire.

## Sauvegarde

DashForge permet de sauvegarder localement plusieurs dashboards personnalisés.

Chaque dashboard sauvegardé conserve :

- son nom
- sa source API ou JSON
- ses widgets
- son layout
- sa configuration

La sauvegarde est actuellement basée sur le `localStorage` du navigateur.

## Roadmap

- Ajouter une vraie persistance en base de données
- Ajouter un système de comptes utilisateurs
- Ajouter d’autres types de graphiques
- Ajouter des widgets conditionnels
- Améliorer l’édition des widgets existants
- Ajouter des templates de dashboard
- Préparer un export/import complet des dashboards
- Ajouter un mode lecture seule partageable
- Améliorer le responsive mobile/tablette

## Objectif du projet

DashForge est un projet d’expérimentation autour de la génération d’interfaces de dashboard à partir de données externes.

Le but est de construire progressivement un outil permettant de passer d’une source de données brute à un dashboard visuel, configurable, sauvegardable et réutilisable.
