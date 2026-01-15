// scripts/data.js
// Données temporaires (à remplacer par des appels API Django)

export const memoiresData = [
  {
    id: 1,
    titre:
      "Développement d'un système IoT pour le monitoring des paramètres environnementaux",
    auteur: "Samuel Nkono",
    encadreur: "Dr. Murel Nkeng",
    filiere: "Génie Informatique",
    annee: 2025,
    fichier: "iot_monitoring_2025.pdf",
    taille: "3.2 MB",
    motsCles: ["IoT", "Monitoring", "Environnement"],
  },
  {
    id: 2,
    titre:
      "Optimisation de la production énergétique d'un parc solaire photovoltaïque",
    auteur: "Kévin Mbarga",
    encadreur: "Pr. Xavier Nkeng",
    filiere: "Génie Électrique",
    annee: 2025,
    fichier: "solaire_photovoltaique_2025.pdf",
    taille: "4.1 MB",
    motsCles: ["Énergie", "Solaire", "Optimisation"],
  },
  {
    id: 3,
    titre: "Étude de faisabilité d'un immeuble R+8 à Bonanjo",
    auteur: "David Ngo",
    encadreur: "Dr. Thibault Mbarga",
    filiere: "Génie Civil",
    annee: 2025,
    fichier: "immeuble_bonanjo_2025.pdf",
    taille: "5.3 MB",
    motsCles: ["Construction", "Faisabilité", "Structure"],
  },
  {
    id: 4,
    titre:
      "Conception d'une ligne de production automatisée pour l'embouteillage",
    auteur: "Patrick Mbappe",
    encadreur: "Pr. Murel Tchakounté",
    filiere: "Génie Industriel",
    annee: 2024,
    fichier: "production_embouteillage_2024.pdf",
    taille: "4.8 MB",
    motsCles: ["Automatisation", "Production", "Industrie"],
  },
  {
    id: 5,
    titre:
      "Analyse des performances d'un moteur diesel fonctionnant au biodiesel",
    auteur: "Olivier Nkoulou",
    encadreur: "Dr. Alexis Fotso",
    filiere: "Génie Mécanique",
    annee: 2024,
    fichier: "biodiesel_performance_2024.pdf",
    taille: "3.9 MB",
    motsCles: ["Moteur", "Biodiesel", "Performance"],
  },
  {
    id: 6,
    titre:
      "Étude des propriétés mécaniques des bétons à base de granulats locaux",
    auteur: "Eric Nkodo",
    encadreur: "Dr. Christian Simeu",
    filiere: "Génie Civil",
    annee: 2024,
    fichier: "beton_granulats_2024.pdf",
    taille: "4.5 MB",
    motsCles: ["Béton", "Granulats", "Mécanique"],
  },
  {
    id: 7,
    titre:
      "Développement d'une application mobile pour la gestion des déchets à Douala",
    auteur: "Michel Tchinda",
    encadreur: "Pr. Jean Ndoungue",
    filiere: "Génie Informatique",
    annee: 2024,
    fichier: "gestion_dechets_2024.pdf",
    taille: "3.7 MB",
    motsCles: ["Mobile", "Déchets", "Gestion"],
  },
  {
    id: 8,
    titre:
      "Conception et réalisation d'un système de gestion intelligente de l'énergie",
    auteur: "Roger Ngando",
    encadreur: "Dr. Alexis Fotso",
    filiere: "Génie Électrique",
    annee: 2023,
    fichier: "gestion_energie_2023.pdf",
    taille: "4.2 MB",
    motsCles: ["Énergie", "Intelligent", "Gestion"],
  },
  {
    id: 9,
    titre: "Automatisation d'une chaîne de production industrielle avec PLC",
    auteur: "André Kameni",
    encadreur: "Pr. Thibault Nkoulou",
    filiere: "Génie Industriel",
    annee: 2023,
    fichier: "plc_production_2023.pdf",
    taille: "4.6 MB",
    motsCles: ["PLC", "Automatisation", "Industrie"],
  },
  {
    id: 10,
    titre:
      "Étude de la pollution des eaux souterraines dans la zone industrielle de Bassa",
    auteur: "Pierre Mballa",
    encadreur: "Pr. Murel Nkoulou",
    filiere: "Génie de l'Environnement",
    annee: 2023,
    fichier: "pollution_eaux_2023.pdf",
    taille: "5.1 MB",
    motsCles: ["Pollution", "Eaux", "Environnement"],
  },
];

export const filieresData = [
  {
    id: 1,
    nom: "Génie Informatique",
    description:
      "Formation en développement logiciel, réseaux informatiques, intelligence artificielle et cybersécurité.",
    icon: "fas fa-laptop-code",
    memos: 72,
    encadreurs: 10,
    derniereAnnee: 2025,
  },
  {
    id: 2,
    nom: "Génie Électrique",
    description:
      "Formation en énergie électrique, automatismes, réseaux électriques et énergies renouvelables.",
    icon: "fas fa-bolt",
    memos: 68,
    encadreurs: 12,
    derniereAnnee: 2025,
  },
  {
    id: 3,
    nom: "Génie Civil",
    description:
      "Formation en bâtiment, travaux publics, structures et géotechnique.",
    icon: "fas fa-hard-hat",
    memos: 45,
    encadreurs: 8,
    derniereAnnee: 2025,
  },
  {
    id: 4,
    nom: "Génie Industriel",
    description:
      "Formation en organisation industrielle, logistique, qualité et production.",
    icon: "fas fa-industry",
    memos: 38,
    encadreurs: 6,
    derniereAnnee: 2024,
  },
  {
    id: 5,
    nom: "Génie Mécanique",
    description:
      "Formation en conception mécanique, fabrication, maintenance et énergétique.",
    icon: "fas fa-cogs",
    memos: 42,
    encadreurs: 7,
    derniereAnnee: 2024,
  },
  {
    id: 6,
    nom: "Génie Chimique",
    description:
      "Formation en procédés chimiques, pétrochimie, environnement et bio-industries.",
    icon: "fas fa-tint",
    memos: 35,
    encadreurs: 5,
    derniereAnnee: 2023,
  },
  {
    id: 7,
    nom: "Télécommunications",
    description:
      "Formation en réseaux de télécommunications, systèmes embarqués et transmission numérique.",
    icon: "fas fa-satellite-dish",
    memos: 29,
    encadreurs: 4,
    derniereAnnee: 2023,
  },
  {
    id: 8,
    nom: "Génie de l'Environnement",
    description:
      "Formation en gestion des déchets, traitement des eaux, pollution et développement durable.",
    icon: "fas fa-leaf",
    memos: 31,
    encadreurs: 5,
    derniereAnnee: 2023,
  },
];

export const encadreursData = [
  {
    id: 1,
    nom: "Dr. Murel Nkeng",
    specialite: "Génie Informatique",
    avatar: "MN",
    depuis: 2015,
    memos: 23,
    description:
      "Spécialiste en Intelligence Artificielle et Systèmes Distribués.",
  },
  {
    id: 2,
    nom: "Pr. Xavier Nkeng",
    specialite: "Génie Électrique",
    avatar: "XN",
    depuis: 2014,
    memos: 20,
    description: "Expert en Énergies Renouvelables et Réseaux Intelligents.",
  },
  {
    id: 3,
    nom: "Dr. Thibault Mbarga",
    specialite: "Génie Civil",
    avatar: "TM",
    depuis: 2016,
    memos: 15,
    description: "Spécialiste en Structures et Matériaux de Construction.",
  },
  {
    id: 4,
    nom: "Pr. Murel Tchakounté",
    specialite: "Génie Industriel",
    avatar: "MT",
    depuis: 2012,
    memos: 18,
    description:
      "Expert en Logistique et Optimisation des Processus Industriels.",
  },
  {
    id: 5,
    nom: "Dr. Alexis Fotso",
    specialite: "Génie Mécanique",
    avatar: "AF",
    depuis: 2018,
    memos: 14,
    description: "Spécialiste en Conception Mécanique et CAO.",
  },
  {
    id: 6,
    nom: "Pr. Murel Nkoulou",
    specialite: "Génie Chimique",
    avatar: "MN",
    depuis: 2013,
    memos: 12,
    description: "Expert en Procédés Chimiques et Environnement Industriel.",
  },
  {
    id: 7,
    nom: "Dr. Christian Simeu",
    specialite: "Génie Civil",
    avatar: "CS",
    depuis: 2017,
    memos: 16,
    description: "Spécialiste en Géotechnique et Fondations.",
  },
  {
    id: 8,
    nom: "Pr. Jean Ndoungue",
    specialite: "Génie Informatique",
    avatar: "JN",
    depuis: 2015,
    memos: 21,
    description: "Expert en Sécurité Informatique et Réseaux.",
  },
];

export const backupsData = [
  {
    date: "15/06/2025 10:30",
    nom: "enspd_memoires_backup_20250615.zip",
    taille: "2.8 Go",
  },
  {
    date: "01/06/2025 14:15",
    nom: "enspd_memoires_backup_20250601.zip",
    taille: "2.7 Go",
  },
  {
    date: "15/05/2025 09:45",
    nom: "enspd_memoires_backup_20250515.zip",
    taille: "2.6 Go",
  },
];
