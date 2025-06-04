# Aperçu général

Ce dépôt contient la première version d’une application Next.js nommée **Carabiner**.
Le README décrit la philosophie et les principales fonctionnalités : calendrier communautaire bilingue (français/anglais), soumission d’événements avec modération, interface mobile et desktop, etc.

## Structure des dossiers

```
src/\
├── app/                    # Pages et API Next.js\
│   ├── \[locale]/           # Routes selon la langue (fr ou en)\
│   │   ├── layout.tsx      # Layout global + barre de navigation\
│   │   ├── page.tsx        # Page d’accueil (liste d’événements)\
│   │   ├── contact/        # Page “About/Contact”\
│   │   └── submit/         # Formulaire de soumission d’événement\
│   ├── api/submit/         # Route API pour vérifier reCAPTCHA\
│   └── utils/              # Fonctions utilitaires (ex. Supabase)\
├── components/             # Composants réutilisables\
├── i18n/                   # Configuration Next-intl\
└── messages/               # Fichiers de traduction JSON
```

## Points importants

- **Gestion de la langue** grâce à `next-intl` et au middleware `src/middleware.tsx`.
- **Client Supabase** dans `src/app/utils/supabaseClient.ts`.
- **Composants principaux** : `EventListWithCalendar.tsx`, `EventCard.tsx`, `ImageCarousel.tsx`.
- **Soumission d’événements** via `src/app/[locale]/submit/page.tsx` et l’API `/api/submit`.

## Pistes pour la suite
1. Installer les dépendances et variables d’environnement (section « Getting Started » du README).
2. Explorer les composants dans `src/components/`.
3. Consulter les fichiers de traduction `src/messages/en.json` et `fr.json`.
4. Regarder le code de la page `submit` pour l’intégration Supabase et reCAPTCHA.
5. Modifier la navigation ou ajouter des pages dans `src/app/[locale]/`.

