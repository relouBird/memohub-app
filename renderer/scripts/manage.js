// scripts/manage.js
// Logique spécifique à la page gestion admin
import { initCommon } from "./common.js";
import { deleteAPI } from "./methods/delete.js";
import { dataGetter } from "./methods/get.js";

document.addEventListener("DOMContentLoaded", function () {
  initCommon();
  initManage();
});

async function initManage() {
  const data = await dataGetter.getGlobalStats();
  localStorage.setItem("memoires", JSON.stringify(data.memoires));
  localStorage.setItem("encadreurs", JSON.stringify(data.encadreurs));
  localStorage.setItem("filieres", JSON.stringify(data.filieres));
  loadAdminData([...data.memoires]);
  loadSupervisorsData([...data.encadreurs]);
  loadTracksData([...data.filieres]);
  loadKeywordsData([...data.keyWords]);
  setupManageEventListeners();
}

export function loadAdminData(memoiresData = []) {
  const tableBody = document.getElementById("adminMemosTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  memoiresData.forEach((memo) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${memo.id}</td>
            <td>${memo.titre}</td>
            <td>${memo.auteur}</td>
            <td>${memo.encadreur}</td>
            <td>${memo.filiere}</td>
            <td>${memo.fichier} (${memo.taille})</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" title="Consulter">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit disabled" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    tableBody.appendChild(row);

    const viewButton = row.querySelector(".action-btn.view");
    const deleteButton = row.querySelector(".action-btn.delete");

    viewButton.addEventListener("click", (e) => {
      e.preventDefault();
      let stringSaved = JSON.stringify(memo);
      window.localStorage.setItem("view-item", stringSaved);
      console.log("MEMORIES-ITEM-SAVED ===>", stringSaved);
      window.location.href = "../pages/viewer.html";
    });

    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      deleteAPI.deleteMemoireWithConfirm(memo.id, memo.titre);
      loadAdminData(memoiresData.filter((mem) => mem.id != memo.id));
    });
  });
}

function loadSupervisorsData(data = []) {
  const container = document.getElementById("encadreur");
  if (!container) return;

  let dataMapped = '<option value="">Sélectionner un encadreur</option>';

  data.forEach((encadreur) => {
    dataMapped += `<option value="${encadreur.id}">${encadreur.nom}</option>`;
  });

  container.innerHTML = dataMapped;
}

function loadTracksData(data = []) {
  const container = document.getElementById("filiere");
  if (!container) return;
  let dataMapped = '<option value="">Sélectionner une filière</option>';
  data.forEach((filiere) => {
    dataMapped += `<option value="${filiere.id}">${filiere.nom}</option>`;
  });

  container.innerHTML = dataMapped;
}

function loadKeywordsData(data = []) {
  const container = document.getElementById("motsClesSelect");
  if (!container) return;
  let dataMapped = '<option value="">Sélectionner un mot-clé</option>';
  data.forEach((keyword) => {
    dataMapped += `<option value="${keyword.id}">${keyword.mot}</option>`;
  });

  container.innerHTML = dataMapped;
}

function setupManageEventListeners() {
  // Bouton ajouter
  const addMemoirBtn = document.getElementById("addMemoirBtn");
  if (addMemoirBtn) {
    // Continue
  }

  // Recherche
  const searchAdminMemos = document.getElementById("searchAdminMemos");
  if (searchAdminMemos) {
    searchAdminMemos.addEventListener("input", function () {
      filterAdminMemos(this.value);
    });
  }
}

function filterAdminMemos(searchTerm) {
  const rows = document.querySelectorAll("#adminMemosTable tr");
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm.toLowerCase()) ? "" : "none";
  });
}
