import { post } from "./methods/post.js";
import { loadAdminData } from "./manage.js";

let selectedKeywords = [];
const buttonOpenModal = document.getElementById("openModalBtn");
const buttonCloseModal = document.getElementById("closeModalBtn");
const buttonCancel = document.querySelector(".btn.btn-cancel");
const buttonSubmit = document.querySelector(".btn.btn-submit");
const filePDF = document.getElementById("fichier_pdf");
const buttonAddKeyword = document.getElementById("addKeyword");

buttonOpenModal.addEventListener("click", openModal);

buttonCloseModal.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});

buttonCancel.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});

buttonAddKeyword.addEventListener("click", (e) => {
  e.preventDefault();
  addKeyword();
});

filePDF.addEventListener("change", function () {
  updateFileName(this);
});

buttonSubmit.addEventListener("click", (e) => {
  submitForm(e);
});

function openModal(e) {
  e.preventDefault();
  document.getElementById("memoireModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("memoireModal").classList.remove("active");
  document.body.style.overflow = "auto";
  resetForm();
}

function resetForm() {
  document.getElementById("memoireForm").reset();
  selectedKeywords = [];
  updateKeywordsDisplay();
  document.getElementById("fileName").textContent =
    "Cliquez pour sélectionner un fichier PDF";
  document.getElementById("fileLabel").classList.remove("has-file");
  document
    .querySelectorAll(".error-message")
    .forEach((el) => el.classList.remove("active"));
}

function updateFileName(input) {
  const label = document.getElementById("fileLabel");
  const fileName = document.getElementById("fileName");

  if (input.files && input.files[0]) {
    const file = input.files[0];
    fileName.textContent = file.name + " (" + formatFileSize(file.size) + ")";
    fileName.classList.add("active");
    label.classList.add("has-file");
  } else {
    fileName.textContent = "Cliquez pour sélectionner un fichier PDF";
    fileName.classList.remove("active");
    label.classList.remove("has-file");
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function addKeyword() {
  const select = document.getElementById("motsClesSelect");
  const value = select.value;
  const text = select.options[select.selectedIndex].text;

  if (value && !selectedKeywords.find((k) => k.id === value)) {
    selectedKeywords.push({ id: value, name: text });
    updateKeywordsDisplay();
    select.value = "";
  }
}

function removeKeyword(id) {
  selectedKeywords = selectedKeywords.filter((k) => k.id !== id);
  updateKeywordsDisplay();
}

function updateKeywordsDisplay() {
  const container = document.getElementById("keywordsContainer");

  if (selectedKeywords.length === 0) {
    container.innerHTML =
      '<span style="color: #999; font-size: 13px;">Aucun mot-clé ajouté</span>';
  } else {
    container.innerHTML = selectedKeywords
      .map(
        (keyword) => `
                    <div class="keyword-item">
                        <span>${keyword.name}</span>
                        <button type="button" id="KEYWORD-${keyword.id}" class="keyword-remove keywordRemoveId">&times;</button>
                    </div>
                `
      )
      .join("");

    const listKeyButtons = document.querySelectorAll(".keywordRemoveId");
    for (let i = 0; i < listKeyButtons.length; i++) {
      let keyButton = listKeyButtons[i];
      keyButton.addEventListener("click", (e) => {
        e.preventDefault();
        let keyId = keyButton.id.replace("KEYWORD-", "");
        removeKeyword(keyId);
      });
    }
  }
}

function validateForm() {
  let isValid = true;
  const fields = ["titre", "auteur", "encadreur", "filiere", "annee"];

  fields.forEach((field) => {
    const input = document.getElementById(field);
    const error = document.getElementById(field + "Error");

    if (!input.value.trim()) {
      error.classList.add("active");
      isValid = false;
    } else {
      error.classList.remove("active");
    }
  });

  const fileInput = document.getElementById("fichier_pdf");
  const fileError = document.getElementById("fichierError");

  if (!fileInput.files || !fileInput.files[0]) {
    fileError.classList.add("active");
    isValid = false;
  } else {
    fileError.classList.remove("active");
  }

  return isValid;
}

async function submitForm(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const data = {
    titre: String(document.getElementById("titre").value).trim(),
    auteur: String(document.getElementById("auteur").value).trim(),
    encadreur: String(document.getElementById("encadreur").value).trim(),
    filiere: String(document.getElementById("filiere").value).trim(),
    annee: String(document.getElementById("annee").value).trim(),
    fichier_pdf: document.getElementById("fichier_pdf").files[0],
    motsCles: selectedKeywords.map((keys) => keys.id),
  };

  // Afficher le loading
  document.getElementById("loading").classList.add("active");
  document.getElementById("submitBtn").disabled = true;

  try {
    // REMPLACEZ L'URL PAR VOTRE ENDPOINT API
    const response = await post.createMemoire(data);

    if (response) {
      const data = response;
      console.log("Mémoire créé avec succès:", data);
      let memoires = localStorage.getItem("memoires")
        ? JSON.parse(localStorage.getItem("memoires"))
        : [];

      memoires.push(data);

      loadAdminData([...memoires]);

      // Ici vous pouvez rafraîchir votre tableau ou ajouter la ligne
    } else {
      throw new Error("Erreur lors de la création du mémoire");
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur lors de la création du mémoire. Veuillez réessayer.");
  } finally {
    setTimeout(() => {
      document.getElementById("loading").classList.remove("active");
      document.getElementById("submitBtn").disabled = false;
      closeModal();
    }, 2000);
  }
}

// Fermer la modal en cliquant en dehors
document.getElementById("memoireModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Fermer avec la touche Échap
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});
