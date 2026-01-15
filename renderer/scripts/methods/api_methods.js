/**
 * Fichier: api.js
 * Fonctions fetch pour interagir avec l'API Django REST
 */

// Configuration de base
const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * Gestion des erreurs de fetch
 */
function handleFetchError(response) {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response;
}

/**
 * Détecte si les données nécessitent multipart/form-data
 * @param {Object|FormData} data - Données à vérifier
 * @returns {boolean}
 */
function isMultipartData(data) {
  // Si c'est déjà un FormData
  if (data instanceof FormData) {
    return true;
  }

  // Si c'est un objet, vérifier s'il contient des fichiers
  if (typeof data === "object" && data !== null) {
    // Parcourir toutes les propriétés
    for (const key in data) {
      const value = data[key];
      // Vérifier si c'est un fichier (File, Blob) ou un tableau de fichiers
      if (value instanceof File || value instanceof Blob) {
        return true;
      }
      if (
        Array.isArray(value) &&
        value.some((item) => item instanceof File || item instanceof Blob)
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Fonction GET - Récupérer des données
 * @param {string} uri - L'URI de l'endpoint (ex: '/tracks/' ou '/tracks/1/')
 * @param {Object} options - Options supplémentaires (headers, etc.)
 * @returns {Promise} - Promise contenant les données JSON
 */
async function apiGet(uri, options = {}) {
  try {
    const defaultOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${uri}`, defaultOptions);
    await handleFetchError(response);

    // Vérifie si la réponse a du contenu
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error("GET Error:", error);
    throw error;
  }
}

/**
 * Fonction POST - Créer une ressource
 * @param {string} uri - L'URI de l'endpoint
 * @param {Object} data - Les données à envoyer
 * @param {Object} options - Options supplémentaires
 * @returns {Promise} - Promise contenant la réponse
 */
async function apiPost(uri, data = {}, options = {}) {
  try {
    // Détecter si on a besoin de multipart/form-data
    const isMultipart = isMultipartData(data);

    // Configurer les headers selon le type de données
    const defaultHeaders = isMultipart
      ? {
          ...options.headers,
        }
      : {
          "Content-Type": "application/json",
          ...options.headers,
        };

    const defaultOptions = {
      method: "POST",
      headers: defaultHeaders,
      body: isMultipart ? data : JSON.stringify(data),
    };

    const response = await fetch(`${API_BASE_URL}${uri}`, defaultOptions);
    await handleFetchError(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error("POST Error:", error);
    throw error;
  }
}

/**
 * Fonction PATCH - Mettre à jour partiellement une ressource
 * @param {string} uri - L'URI de l'endpoint avec ID
 * @param {Object} data - Les données partielles à mettre à jour
 * @param {Object} options - Options supplémentaires
 * @returns {Promise} - Promise contenant la réponse
 */
async function apiPatch(uri, data = {}, options = {}) {
  try {
    const defaultOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(`${API_BASE_URL}${uri}`, defaultOptions);
    await handleFetchError(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error("PATCH Error:", error);
    throw error;
  }
}

/**
 * Fonction PUT - Mettre à jour complètement une ressource
 * @param {string} uri - L'URI de l'endpoint avec ID
 * @param {Object} data - Les données complètes
 * @param {Object} options - Options supplémentaires
 * @returns {Promise} - Promise contenant la réponse
 */
async function apiPut(uri, data = {}, options = {}) {
  try {
    const defaultOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(`${API_BASE_URL}${uri}`, defaultOptions);
    await handleFetchError(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error("PUT Error:", error);
    throw error;
  }
}

/**
 * Fonction DELETE - Supprimer une ressource
 * @param {string} uri - L'URI de l'endpoint avec ID
 * @param {Object} options - Options supplémentaires
 * @returns {Promise} - Promise contenant la réponse
 */
async function apiDelete(uri, options = {}) {
  try {
    const defaultOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${uri}`, defaultOptions);

    // Pour DELETE, 204 No Content est courant
    if (response.status === 204) {
      return { success: true, status: 204 };
    }

    await handleFetchError(response);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error("DELETE Error:", error);
    throw error;
  }
}

/**
 * Fonction générique avec token CSRF (pour Django)
 * @param {string} method - GET, POST, PATCH, PUT, DELETE
 * @param {string} uri - L'URI de l'endpoint
 * @param {Object} data - Les données (optionnel)
 * @param {Object} options - Options supplémentaires
 * @returns {Promise} - Promise contenant la réponse
 */
async function apiRequest(method, uri, data = null, options = {}) {
  // Récupérer le token CSRF du cookie
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const csrftoken = getCookie("csrftoken");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(csrftoken &&
    ["POST", "PATCH", "PUT", "DELETE"].includes(method.toUpperCase())
      ? { "X-CSRFToken": csrftoken }
      : {}),
    ...options.headers,
  };

  const requestOptions = {
    method: method.toUpperCase(),
    headers: defaultHeaders,
    credentials: "include", // Pour inclure les cookies
    ...options,
  };

  if (data && ["POST", "PATCH", "PUT"].includes(method.toUpperCase())) {
    requestOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${uri}`, requestOptions);

    // Gestion des erreurs HTTP
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // Si la réponse n'est pas du JSON
      }
      throw new Error(errorMessage);
    }

    // Gestion des réponses sans contenu
    if (response.status === 204) {
      return { success: true, status: 204 };
    }

    // Parser la réponse
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error(`${method.toUpperCase()} Error:`, error);
    throw error;
  }
}

/**
 * Version simplifiée avec alias
 */
export const api = {
  get: apiGet,
  post: apiPost,
  patch: apiPatch,
  put: apiPut,
  delete: apiDelete,
  request: apiRequest,
  isMultipartData: isMultipartData,
};

// Exemples d'utilisation :

/*
// 1. GET - Récupérer toutes les tracks
async function getAllTracks() {
    try {
        const tracks = await api.get('/tracks/');
        console.log('Tracks:', tracks);
        return tracks;
    } catch (error) {
        console.error('Failed to fetch tracks:', error);
    }
}

// 2. GET - Récupérer une track spécifique
async function getTrackById(id) {
    try {
        const track = await api.get(`/tracks/${id}/`);
        console.log('Track:', track);
        return track;
    } catch (error) {
        console.error('Failed to fetch track:', error);
    }
}

// 3. POST - Créer une nouvelle track
async function createTrack(trackData) {
    try {
        const newTrack = await api.post('/tracks/create/', trackData);
        console.log('Track created:', newTrack);
        return newTrack;
    } catch (error) {
        console.error('Failed to create track:', error);
    }
}

// 4. PATCH - Mettre à jour une track
async function updateTrack(id, updateData) {
    try {
        const updatedTrack = await api.patch(`/tracks/update/${id}/`, updateData);
        console.log('Track updated:', updatedTrack);
        return updatedTrack;
    } catch (error) {
        console.error('Failed to update track:', error);
    }
}

// 5. DELETE - Supprimer une track
async function deleteTrack(id) {
    try {
        const result = await api.delete(`/tracks/delete/${id}/`);
        console.log('Track deleted:', result);
        return result;
    } catch (error) {
        console.error('Failed to delete track:', error);
    }
}

// 6. Utilisation générique avec apiRequest
async function exampleGeneric() {
    try {
        // GET
        const tracks = await api.request('GET', '/tracks/');
        
        // POST
        const newTrack = await api.request('POST', '/tracks/create/', {
            nom: 'Nouvelle Filière',
            description: 'Description de la filière',
            icon: 'fas fa-code'
        });
        
        // PATCH
        const updated = await api.request('PATCH', '/tracks/update/1/', {
            description: 'Nouvelle description'
        });
        
        // DELETE
        const deleted = await api.request('DELETE', '/tracks/delete/1/');
    } catch (error) {
        console.error('Request failed:', error);
    }
}

// Utilisation avec les fonctions d'erreur améliorées
async function exampleWithErrorHandling() {
    try {
        const response = await api.get('/tracks/');
        // Traiter la réponse
        return response;
    } catch (error) {
        // Afficher un message à l'utilisateur
        alert(`Erreur: ${error.message}`);
        // Log pour le développement
        console.error('Détails de l\'erreur:', error);
        // Retourner une valeur par défaut
        return [];
    }
}

// Tests
document.addEventListener('DOMContentLoaded', async () => {
    // Test GET
    const tracks = await api.get('/tracks/');
    console.log('Tracks from API:', tracks);
    
    // Test POST (décommenter pour tester)
    // const newTrack = await api.post('/tracks/create/', {
    //     nom: 'Génie Informatique',
    //     description: 'Filière en informatique',
    //     icon: 'fas fa-laptop-code'
    // });
    // console.log('New track:', newTrack);
});
*/
