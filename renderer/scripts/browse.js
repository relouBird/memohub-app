// Logique spécifique à la page de recherche
import { initCommon, getFiliereBadgeClass } from "./common.js";
import { dataGetter } from "./methods/get.js";

document.addEventListener("DOMContentLoaded", function () {
  initCommon();
  initBrowse();
});

async function initBrowse() {
  const data = await dataGetter.getGlobalStats();
  loadAllMemos([...data.memoires]);
  populateFilters([...data.memoires], [...data.filieres]);
  setupBrowseEventListeners();
}

function loadAllMemos(memoiresData = []) {
  const tableBody = document.getElementById("allMemosTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  memoiresData.forEach((memo) => {
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

      window.location.href = "../pages/viewer.html";
    });
  });
}

function populateFilters(memoiresData = [], filieresData = []) {
  // Remplir le filtre des filières
  const filiereFilter = document.getElementById("filterFiliere");
  if (filiereFilter) {
    filiereFilter.innerHTML = '<option value="">Toutes les filières</option>';

    filieresData.forEach((filiere) => {
      const option = document.createElement("option");
      option.value = filiere.nom;
      option.textContent = filiere.nom;
      filiereFilter.appendChild(option);
    });
  }

  // Remplir le filtre des années
  const yearFilter = document.getElementById("filterYear");
  if (yearFilter) {
    yearFilter.innerHTML = '<option value="">Toutes les années</option>';

    // Extraire les années uniques
    const years = [...new Set(memoiresData.map((m) => m.annee))].sort(
      (a, b) => b - a
    );
    years.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearFilter.appendChild(option);
    });
  }
}

function setupBrowseEventListeners() {
  // Filtres
  const filiereFilter = document.getElementById("filterFiliere");
  const yearFilter = document.getElementById("filterYear");

  if (filiereFilter) {
    filiereFilter.addEventListener("change", filterAllMemos);
  }

  if (yearFilter) {
    yearFilter.addEventListener("change", filterAllMemos);
  }

  // Recherche
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filterMemos(this.value);
    });
  }
}

function filterMemos(searchTerm) {
  const rows = document.querySelectorAll("#allMemosTable tr");
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm.toLowerCase()) ? "" : "none";
  });
}

function filterAllMemos() {
  const filiereFilter = document.getElementById("filterFiliere");
  const yearFilter = document.getElementById("filterYear");

  if (!filiereFilter || !yearFilter) return;

  const filiereValue = filiereFilter.value;
  const yearValue = yearFilter.value;

  const rows = document.querySelectorAll("#allMemosTable tr");
  rows.forEach((row) => {
    const filiereCell = row.querySelector("td:nth-child(4)").textContent;
    const yearCell = row.querySelector("td:nth-child(5)").textContent;

    const filiereMatch = !filiereValue || filiereCell.includes(filiereValue);
    const yearMatch = !yearValue || yearCell === yearValue;

    row.style.display = filiereMatch && yearMatch ? "" : "none";
  });
}
