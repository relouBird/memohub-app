// scripts/dashboard.js
// Logique spécifique à la page dashboard (index.html)

// import { memoiresData, filieresData, encadreursData } from './data.js';
import { initCommon, getFiliereBadgeClass } from "./common.js";
import { dataGetter } from "./methods/get.js";

document.addEventListener("DOMContentLoaded", function () {
  initCommon();
  initDashboard();
});

async function initDashboard() {
  const data = await dataGetter.getGlobalStats();
  loadRecentMemos([...data.memoires]);
  updateStatistics(
    data.total_memoires,
    data.total_filieres,
    data.total_encadreurs,
    data.latest_year
  );
  setupDashboardEventListeners();
}

function loadRecentMemos(memoiresData) {
  const tableBody = document.getElementById("recentMemosTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  // Trier par année (plus récent d'abord) et prendre les 5 premiers
  const recentMemos = [...memoiresData]
    .sort((a, b) => b.annee - a.annee)
    .slice(0, 5);

  recentMemos.forEach((memo) => {
    const badgeClass = getFiliereBadgeClass(memo.filiere);
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${memo.titre}</td>
            <td>${memo.auteur}</td>
            <td>${memo.encadreur}</td>
            <td><span class="badge ${badgeClass}">${memo.filiere}</span></td>
            <td>${memo.annee}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" title="Consulter">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
    tableBody.appendChild(row);

    const viewButton = row.querySelector(".action-btn.view");

    viewButton.addEventListener("click", (e) => {
      e.preventDefault();
      let stringSaved = JSON.stringify(memo);
      window.localStorage.setItem("view-item", stringSaved);
      console.log("MEMORIES-ITEM-SAVED ===>", stringSaved);

      window.location.href = "./pages/viewer.html";
    });
  });
}

function updateStatistics(
  memoiresLength,
  filieresLength,
  encadreursLength,
  latestYear
) {
  // Calculer le nombre total de mémoires
  const totalMemos = memoiresLength;
  document.getElementById("totalMemos").textContent = totalMemos;

  // Nombre de filières
  document.getElementById("totalFilieres").textContent = filieresLength;

  // Année la plus récente
  document.getElementById("latestYear").textContent = latestYear;

  // Nombre d'encadreurs
  document.getElementById("totalEncadreurs").textContent = encadreursLength;
}

function setupDashboardEventListeners() {
  // Recherche
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filterMemos(this.value);
    });
  }

  // Bouton "Voir tous"
  const viewAllBtn = document.getElementById("viewAllBtn");
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      window.location.href = "browse.html";
    });
  }
}

function filterMemos(searchTerm) {
  const rows = document.querySelectorAll("#recentMemosTable tr");
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm.toLowerCase()) ? "" : "none";
  });
}
