// scripts/common.js
// Fonctions utilitaires partagées

import { memoiresData, filieresData } from "./data.js";

// Variables d'état globales
let currentProfile = localStorage.getItem("memoHubProfile") || "student";
let chartInstances = {};

// Initialisation commune
export function initCommon() {
  updateProfileDisplay();
  setupCommonEventListeners();
}

// Gestion du profil
export function switchProfile(profile) {
  currentProfile = profile;
  localStorage.setItem("memoHubProfile", profile);
  updateProfileDisplay();

  // Rediriger si nécessaire
  const currentPage = window.location.pathname.split("/").pop();
  if (
    profile === "student" &&
    (currentPage === "manage.html" ||
      currentPage === "stats.html" ||
      currentPage === "backup.html")
  ) {
    window.location.href = "index.html";
  }
}

export function updateProfileDisplay() {
  // Mettre à jour les boutons de profil
  const studentBtn = document.getElementById("studentProfile");
  const adminBtn = document.getElementById("adminProfile");

  if (studentBtn && adminBtn) {
    studentBtn.classList.toggle("active", currentProfile === "student");
    adminBtn.classList.toggle("active", currentProfile === "admin");
  }

  // Afficher/masquer les éléments admin
  document.querySelectorAll(".admin-only").forEach((el) => {
    el.style.display = currentProfile === "admin" ? "block" : "none";
  });

  // Mettre à jour le titre de la page
  updatePageTitle();
}

function updatePageTitle() {
  const pageTitle = document.getElementById("pageTitle");
  if (!pageTitle) return;

  const page = window.location.pathname.split("/").pop();
  const titles = {
    "index.html": "Accueil",
    "filieres.html": "Filières",
    "browse.html": "Parcourir les mémoires",
    "encadreurs.html": "Encadreurs",
    "manage.html": "Gestion des mémoires",
    "stats.html": "Statistiques",
    "backup.html": "Sauvegarde",
    "viewer.html": "Lecteur PDF",
  };

  const suffix =
    currentProfile === "student"
      ? " - Étudiant ENSPD"
      : " - Administrateur ENSPD";
  if (titles[page]) {
    pageTitle.textContent = titles[page] + suffix;
  }
}

// Fonctions utilitaires
export function getFiliereBadgeClass(filiere) {
  switch (filiere) {
    case "Génie Informatique":
      return "badge-success";
    case "Génie Électrique":
      return "badge-primary";
    case "Génie Civil":
      return "badge-warning";
    case "Génie Industriel":
      return "badge-secondary";
    default:
      return "badge-primary";
  }
}

// Gestion des graphiques
export function createCharts() {
  // Détruire les anciens graphiques s'ils existent
  if (chartInstances.filiereChart) {
    chartInstances.filiereChart.destroy();
    chartInstances.filiereChart = null;
  }
  if (chartInstances.yearChart) {
    chartInstances.yearChart.destroy();
    chartInstances.yearChart = null;
  }

  // Vérifier et détruire les graphiques existants sur les canvas
  const destroyExistingChart = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    if (canvas && window.Chart.getChart(canvas)) {
      window.Chart.getChart(canvas).destroy();
    }
  };

  destroyExistingChart('filiereChart');
  destroyExistingChart('yearChart');

  // Données pour le graphique des filières
  const filiereLabels = filieresData.map((f) => f.nom);
  const filiereChartData = filieresData.map((f) => f.memos);
  const filiereColors = [
    "#003366",
    "#E63946",
    "#2A9D8F",
    "#F4A261",
    "#E76F51",
    "#9B5DE5",
    "#00BBF9",
    "#00F5D4",
  ];

  // Créer le graphique des filières
  const filiereCtx = document.getElementById("filiereChart")?.getContext("2d");
  if (filiereCtx) {
    chartInstances.filiereChart = new window.Chart(filiereCtx, {
      type: "pie",
      data: {
        labels: filiereLabels,
        datasets: [
          {
            data: filiereChartData,
            backgroundColor: filiereColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    });
  }

  // Données pour le graphique des années
  const yearCounts = {};
  memoiresData.forEach((memo) => {
    yearCounts[memo.annee] = (yearCounts[memo.annee] || 0) + 1;
  });

  const yearLabels = Object.keys(yearCounts).sort((a, b) => b - a);
  const yearData = yearLabels.map((year) => yearCounts[year]);

  // Créer le graphique des années
  const yearCtx = document.getElementById("yearChart")?.getContext("2d");
  if (yearCtx) {
    chartInstances.yearChart = new window.Chart(yearCtx, {
      type: "bar",
      data: {
        labels: yearLabels,
        datasets: [
          {
            label: "Nombre de mémoires",
            data: yearData,
            backgroundColor: "#003366",
            borderColor: "#002244",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }
}

// Gestion de la modal de connexion
function setupCommonEventListeners() {
  // Gestion des profils
  const studentProfileBtn = document.getElementById("studentProfile");
  const adminProfileBtn = document.getElementById("adminProfile");

  if (studentProfileBtn) {
    studentProfileBtn.addEventListener("click", () => switchProfile("student"));
  }

  if (adminProfileBtn) {
    adminProfileBtn.addEventListener("click", () => {
      if (currentProfile === "student") {
        document.getElementById("loginModal")?.classList.add("active");
      } else {
        switchProfile("admin");
      }
    });
  }

  // Connexion admin
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      const password = document.getElementById("adminPassword")?.value;
      if (password === "enspdmemo") {
        document.getElementById("loginModal")?.classList.remove("active");
        switchProfile("admin");
        if (document.getElementById("adminPassword")) {
          document.getElementById("adminPassword").value = "";
        }
      } else {
        alert('Mot de passe incorrect.');
      }
    });
  }

  // Fermer la modal
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
      }
    });
  }
}

export function createBackup() {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
  const timeStr = now.toTimeString().split(":").slice(0, 2).join("");
  const backupName = `enspd_memoires_backup_${dateStr}_${timeStr}.zip`;

  alert(
    `Sauvegarde créée avec succès!\n\nNom: ${backupName}\nTaille: ~${(memoiresData.length * 4.5).toFixed(1)} MB\n\nLa sauvegarde contient ${memoiresData.length} fichiers PDF et la base de données.`
  );
}

export function restoreBackup() {
  alert(
    "Restauration à partir d'une sauvegarde\n\nCette fonctionnalité permettrait de:\n1. Sélectionner un fichier de sauvegarde\n2. Vérifier l'intégrité des données\n3. Restaurer les fichiers PDF\n4. Mettre à jour la base de données"
  );
}

export function exportStats() {
  alert(
    "Export des statistiques\n\nFichier généré: enspd_statistiques_2025.csv\n\nContenu:\n- Statistiques par filière\n- Données temporelles\n- Informations sur les encadreurs\n- Liste des mémoires"
  );
}

// Fonction pour nettoyer tous les graphiques quand on quitte la page
export function cleanupCharts() {
  if (chartInstances.filiereChart) {
    chartInstances.filiereChart.destroy();
    chartInstances.filiereChart = null;
  }
  if (chartInstances.yearChart) {
    chartInstances.yearChart.destroy();
    chartInstances.yearChart = null;
  }
}