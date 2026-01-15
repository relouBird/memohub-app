// scripts/stats.js
// Logique spécifique à la page statistiques

import { filieresData } from "./data.js";
import { initCommon, createCharts, exportStats } from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
  initCommon();
  initStats();
});

function initStats() {
  loadStats();
  setupStatsEventListeners();
}

function loadStats() {
  // Tableau des statistiques
  const statsTable = document.getElementById("statsTable");
  if (statsTable) {
    statsTable.innerHTML = "";

    filieresData.forEach((filiere) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${filiere.nom}</td>
                <td>${filiere.memos}</td>
                <td>${filiere.derniereAnnee}</td>
                <td>${filiere.encadreurs}</td>
            `;
      statsTable.appendChild(row);
    });
  }

  // Graphiques
  createCharts();
}

function setupStatsEventListeners() {
  // Bouton exporter
  const exportStatsBtn = document.getElementById("exportStatsBtn");
  if (exportStatsBtn) {
    exportStatsBtn.addEventListener("click", exportStats);
  }
}

// Dans ton fichier stats.js ou similaire
window.addEventListener('beforeunload', () => {
  cleanupCharts();
});
