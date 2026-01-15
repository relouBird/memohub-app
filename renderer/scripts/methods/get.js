/**
 * Fichier: get.js
 * Fonctions pour récupérer les données des modèles
 */

import {api} from "./api_methods.js";
import { memoriesHelper, supervisorsHelper, tracksHelper } from "../utils.js";

// Variables globales pour stocker les données en cache
let memoiresCache = null;
let filieresCache = null;
let encadreursCache = null;
let keyWordsCache = null;

/**
 * Récupérer tous les mémoires
 * @returns {Promise<Array>} - Liste des mémoires
 */
async function getAllMemoires() {
    try {
        const response = await api.get('/memories/');
        memoiresCache = response;
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des mémoires:', error);
        // Retourner les données en cache si disponible
        return memoiresCache || [];
    }
}

/**
 * Récupérer un mémoire par son ID
 * @param {number} id - ID du mémoire
 * @returns {Promise<Object|null>} - Mémoire ou null si non trouvé
 */
async function getMemoiresById(id) {
    try {
        // Si on a déjà les données en cache, chercher dedans
        if (memoiresCache) {
            const memoiresFromCache = memoiresCache.find(m => m.id === id);
            if (memoiresFromCache) return memoiresFromCache;
        }
        
        // Sinon, faire une requête spécifique
        const response = await api.get(`/memories/${id}/`);
        return response;
    } catch (error) {
        console.error(`Erreur lors de la récupération du mémoire ${id}:`, error);
        return null;
    }
}

/**
 * Récupérer les mémoires récents (les plus récents en premier)
 * @param {number} limit - Nombre maximum de mémoires à retourner
 * @returns {Promise<Array>} - Liste des mémoires récents
 */
async function getRecentMemoires(limit = 5) {
    try {
        const memoires = await getAllMemoires();
        // Trier par date (supposons qu'il y a un champ 'annee' ou 'date_creation')
        const sorted = [...memoires].sort((a, b) => {
            // Si on a un champ 'created_at' ou 'annee'
            if (a.annee && b.annee) return b.annee - a.annee;
            if (a.created_at && b.created_at) return new Date(b.created_at) - new Date(a.created_at);
            return 0;
        });
        return sorted.slice(0, limit);
    } catch (error) {
        console.error('Erreur lors de la récupération des mémoires récents:', error);
        return [];
    }
}

/**
 * Récupérer les mémoires par filière
 * @param {number|string} filiereId - ID ou nom de la filière
 * @returns {Promise<Array>} - Liste des mémoires de la filière
 */
async function getMemoiresByFiliere(filiereId) {
    try {
        const memoires = await getAllMemoires();
        // Filtrer par ID de filière ou nom
        return memoires.filter(memoire => 
            memoire.filiere_id === filiereId || 
            memoire.filiere === filiereId ||
            memoire.track_id === filiereId
        );
    } catch (error) {
        console.error(`Erreur lors de la récupération des mémoires pour la filière ${filiereId}:`, error);
        return [];
    }
}

/**
 * Récupérer les mémoires par année
 * @param {number} annee - Année de publication
 * @returns {Promise<Array>} - Liste des mémoires de l'année
 */
async function getMemoiresByYear(annee) {
    try {
        const memoires = await getAllMemoires();
        return memoires.filter(memoire => memoire.annee === annee);
    } catch (error) {
        console.error(`Erreur lors de la récupération des mémoires pour l'année ${annee}:`, error);
        return [];
    }
}

/**
 * Récupérer toutes les filières
 * @returns {Promise<Array>} - Liste des filières
 */
async function getAllFilieres() {
    try {
        const response = await api.get('/tracks/');
        filieresCache = response;
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des filières:', error);
        // Retourner les données en cache si disponible
        return filieresCache || [];
    }
}

/**
 * Récupérer une filière par son ID
 * @param {number} id - ID de la filière
 * @returns {Promise<Object|null>} - Filière ou null si non trouvé
 */
async function getFiliereById(id) {
    try {
        // Si on a déjà les données en cache, chercher dedans
        if (filieresCache) {
            const filiereFromCache = filieresCache.find(f => f.id === id);
            if (filiereFromCache) return filiereFromCache;
        }
        
        // Sinon, faire une requête spécifique
        const response = await api.get(`/tracks/${id}/`);
        return response;
    } catch (error) {
        console.error(`Erreur lors de la récupération de la filière ${id}:`, error);
        return null;
    }
}

/**
 * Récupérer les statistiques d'une filière
 * @param {number} id - ID de la filière
 * @returns {Promise<Object>} - Statistiques de la filière
 */
async function getFiliereStats(id) {
    try {
        const filiere = await getFiliereById(id);
        if (!filiere) return null;
        
        // Récupérer les mémoires de cette filière
        const memoires = await getMemoiresByFiliere(id);
        
        return {
            id: filiere.id,
            nom: filiere.nom,
            total_memoires: memoires.length,
            derniere_annee: memoires.length > 0 
                ? Math.max(...memoires.map(m => m.annee))
                : null,
            // Autres statistiques selon vos besoins
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération des statistiques de la filière ${id}:`, error);
        return null;
    }
}

/**
 * Récupérer tous les encadreurs
 * @returns {Promise<Array>} - Liste des encadreurs
 */
async function getAllEncadreurs() {
    try {
        const response = await api.get('/supervisors/');
        encadreursCache = response;
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des encadreurs:', error);
        // Retourner les données en cache si disponible
        return encadreursCache || [];
    }
}

/**
 * Récupérer un encadreur par son ID
 * @param {number} id - ID de l'encadreur
 * @returns {Promise<Object|null>} - Encadreur ou null si non trouvé
 */
async function getEncadreurById(id) {
    try {
        // Si on a déjà les données en cache, chercher dedans
        if (encadreursCache) {
            const encadreurFromCache = encadreursCache.find(e => e.id === id);
            if (encadreurFromCache) return encadreurFromCache;
        }
        
        // Sinon, faire une requête spécifique
        const response = await api.get(`/supervisors/${id}/`);
        return response;
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'encadreur ${id}:`, error);
        return null;
    }
}

/**
 * Récupérer les mémoires encadrés par un encadreur
 * @param {number} encadreurId - ID de l'encadreur
 * @returns {Promise<Array>} - Liste des mémoires encadrés
 */
async function getMemoiresByEncadreur(encadreurId) {
    try {
        const memoires = await getAllMemoires();
        return memoires.filter(memoire => 
            memoire.encadreur_id === encadreurId || 
            memoire.encadreur === encadreurId
        );
    } catch (error) {
        console.error(`Erreur lors de la récupération des mémoires pour l'encadreur ${encadreurId}:`, error);
        return [];
    }
}

/**
 * Récupérer les statistiques d'un encadreur
 * @param {number} id - ID de l'encadreur
 * @returns {Promise<Object>} - Statistiques de l'encadreur
 */
async function getEncadreurStats(id) {
    try {
        const encadreur = await getEncadreurById(id);
        if (!encadreur) return null;
        
        const memoires = await getMemoiresByEncadreur(id);
        
        return {
            id: encadreur.id,
            nom: encadreur.nom,
            total_memoires: memoires.length,
            annees: memoires.length > 0 
                ? [...new Set(memoires.map(m => m.annee))].sort((a, b) => b - a)
                : [],
            filieres: memoires.length > 0
                ? [...new Set(memoires.map(m => m.filiere || m.track))]
                : []
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération des statistiques de l'encadreur ${id}:`, error);
        return null;
    }
}


/**
 * Rechercher des mémoires par mot-clé
 * @param {string} keyword - Mot-clé à rechercher
 * @param {Array<string>} fields - Champs à rechercher (par défaut: titre, auteur, mots_cles)
 * @returns {Promise<Array>} - Liste des mémoires correspondants
 */
async function searchMemoires(keyword, fields = ['titre', 'auteur', 'mots_cles', 'description']) {
    try {
        if (!keyword || keyword.trim() === '') return [];
        
        const memoires = await getAllMemoires();
        const searchTerm = keyword.toLowerCase().trim();
        
        return memoires.filter(memoire => {
            return fields.some(field => {
                if (!memoire[field]) return false;
                return String(memoire[field]).toLowerCase().includes(searchTerm);
            });
        });
    } catch (error) {
        console.error('Erreur lors de la recherche des mémoires:', error);
        return [];
    }
}

/**
 * Récupérer tous les mots clés
 * @returns {Promise<Array>} - Liste des mots clés
 */
async function getAllKeyWords() {
    try {
        const response = await api.get('/keywords/');
        keyWordsCache = response;
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des mots clés:', error);
        // Retourner les données en cache si disponible
        return keyWordsCache || [];
    }
}

/**
 * Récupérer les statistiques globales du système
 * @returns {Promise<Object>} - Statistiques globales
 */
async function getGlobalStats() {
    try {
        const [memoires, filieres, encadreurs, keyWords] = await Promise.all([
            getAllMemoires(),
            getAllFilieres(),
            getAllEncadreurs(),
            getAllKeyWords()
        ]);


        
        // Calculer l'année la plus récente
        const latestYear = memoires.length > 0 
            ? Math.max(...memoires.map(m => m.annee))
            : new Date().getFullYear();
        
        const dataToReturn = {
            memoires : memoriesHelper(memoires),
            filieres : tracksHelper(filieres),
            encadreurs: supervisorsHelper(encadreurs),
            keyWords: keyWords,
            total_memoires: memoires.length,
            total_filieres: filieres.length,
            total_encadreurs: encadreurs.length,
            latest_year: latestYear,
            memoires_par_annee: memoires.reduce((acc, memoire) => {
                const year = memoire.annee;
                acc[year] = (acc[year] || 0) + 1;
                return acc;
            }, {}),
            memoires_par_filiere: memoires.reduce((acc, memoire) => {
                const filiere = memoire.filiere || memoire.track;
                if (filiere) {
                    acc[filiere] = (acc[filiere] || 0) + 1;
                }
                return acc;
            }, {})
        };
        console.log('Statistiques globales récupérées:', dataToReturn);
        return dataToReturn;
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques globales:', error);
        return {
            memoires: [],
            filieres: [],
            encadreurs : [],
            total_memoires: 0,
            total_filieres: 0,
            total_encadreurs: 0,
            latest_year: new Date().getFullYear(),
            memoires_par_annee: {},
            memoires_par_filiere: {}
        };
    }
}

/**
 * Rafraîchir toutes les données (vider le cache)
 */
function refreshAllData() {
    memoiresCache = null;
    filieresCache = null;
    encadreursCache = null;
    console.log('Cache des données vidé. Les prochaines requêtes récupéreront les données fraîches.');
}

// Exporter les fonctions pour utilisation
export const dataGetter = {
    // Mémoires
    getAllMemoires,
    getMemoiresById,
    getRecentMemoires,
    getMemoiresByFiliere,
    getMemoiresByYear,
    getMemoiresByEncadreur,
    
    // Filières
    getAllFilieres,
    getFiliereById,
    getFiliereStats,
    
    // Encadreurs
    getAllEncadreurs,
    getEncadreurById,
    getEncadreurStats,
    
    // Recherche et statistiques
    searchMemoires,
    getGlobalStats,
    
    // Utilitaires
    refreshAllData
};

// Exporter pour Node.js ou navigateur
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dataGetter;
} else {
    window.dataGetter = dataGetter;
}