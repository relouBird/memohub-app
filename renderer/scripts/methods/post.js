/**
 * Fonction POST améliorée - Créer une ressource
 * Gère automatiquement JSON et multipart/form-data
 * @param {string} uri - L'URI de l'endpoint
 * @param {Object|FormData} data - Les données à envoyer
 * @param {Object} options - Options supplémentaires
 * @returns {Promise} - Promise contenant la réponse
 */

import { api } from "./api_methods.js";

/**
 * Convertit un objet en FormData pour l'upload de fichiers
 * @param {Object} data - Objet contenant les données
 * @returns {FormData}
 */
function createFormData(data) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // Fichier unique
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    // Tableau
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(`${key}[]`, item);
        } else {
          formData.append(`${key}[]`, String(item));
        }
      });
      return;
    }

    // Objet (JSON)
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    // Valeur simple
    formData.append(key, String(value));
  });
  return formData;
}

/**
 * Fonction spécialisée pour créer un mémoire avec fichier PDF
 * @param {Object} data - Données du mémoire
 * @returns {Promise<Object>}
 */
async function createMemoire(data) {
  // Convertir en FormData pour l'upload de fichier
  const formData = createFormData(data);
  for (let pair of formData.entries()) {
  console.log("ENVOYÉ :", pair[0], pair[1]);
}
  return await api.post("/memories/create", formData);
}

/**
 * Fonction spécialisée pour créer une filière (JSON)
 * @param {Object} data - Données de la filière
 * @returns {Promise<Object>}
 */
async function createFiliere(data) {
  return await api.post("/tracks/", data);
}

/**
 * Fonction spécialisée pour créer un encadreur (JSON)
 * @param {Object} data - Données de l'encadreur
 * @returns {Promise<Object>}
 */
async function createEncadreur(data) {
  return await api.post("/encadreurs/", data);
}

/**
 * Valide un fichier avant upload
 * @param {File} file - Fichier à valider
 * @param {Object} options - Options de validation
 * @returns {Object} - Résultat de validation
 */
function validateFile(file, options = {}) {
  const defaults = {
    maxSizeMB: 10,
    allowedTypes: ["application/pdf"],
    allowedExtensions: [".pdf"],
  };
  const config = { ...defaults, ...options };

  const errors = [];

  // Vérifier le type MIME
  if (!config.allowedTypes.includes(file.type)) {
    errors.push(`Type MIME non autorisé: ${file.type}`);
  }

  // Vérifier l'extension
  const extension = "." + file.name.split(".").pop().toLowerCase();
  if (!config.allowedExtensions.includes(extension)) {
    errors.push(`Extension non autorisée: ${extension}`);
  }

  // Vérifier la taille
  const maxSizeBytes = config.maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(
      `Fichier trop volumineux (${(file.size / (1024 * 1024)).toFixed(2)}MB > ${config.maxSizeMB}MB)`
    );
  }

  return {
    valid: errors.length === 0,
    errors: errors,
    file: file,
  };
}

// Exporter les fonctions
export const post = {
  // Fonctions spécialisées
  createMemoire,
  createFiliere,
  createEncadreur,

  // Utilitaires
  createFormData,
  validateFile,
};

// Exemples d'utilisation :

/*
// Exemple 1: Upload d'un mémoire avec fichier
const fileInput = document.getElementById('pdfFile');
const file = fileInput.files[0];

// Valider le fichier
const validation = api.validateFile(file);
if (!validation.valid) {
    console.error('Erreurs:', validation.errors);
    return;
}

const memoireData = {
    titre: 'Mon mémoire',
    auteur: 'Jean Dupont',
    annee: 2024,
    filiere_id: 1,
    fichier_pdf: file
};

// apiPost détectera automatiquement qu'il faut utiliser multipart/form-data
const nouveauMemoire = await api.post('/memories/', memoireData);

// Exemple 2: Avec suivi de progression
const formData = api.createFormData(memoireData);
const result = await api.postWithProgress('/memories/', formData, (percent) => {
    console.log(`Progression: ${percent}%`);
});

// Exemple 3: Créer une filière (JSON standard)
const filiereData = {
    nom: 'Génie Informatique',
    description: 'Filière en informatique'
};

const nouvelleFiliere = await api.post('/tracks/', filiereData);

// Exemple 4: Utilisation explicite de FormData
const myFormData = new FormData();
myFormData.append('nom', 'Test');
myFormData.append('file', someFile);

// Fonctionnera aussi car apiPost détecte que c'est un FormData
await api.post('/upload/', myFormData);
*/
