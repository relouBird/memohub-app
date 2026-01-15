/**
 * Fichier: delete.js
 * Fonctions DELETE pour les mémoires uniquement
 */
import { api } from "./api_methods.js";
/**
 * Supprimer un mémoire par son ID
 * @param {number|string} memoireId - ID du mémoire à supprimer
 * @returns {Promise<Object>} - Résultat de la suppression
 */
async function deleteMemoire(memoireId) {
    try {
        console.log(`🗑️ Tentative de suppression du mémoire ${memoireId}...`);
        
        const response = await api.delete(`/memories/delete/${memoireId}/`);
        
        console.log(`✅ Mémoire ${memoireId} supprimé avec succès`);
        return response;
    } catch (error) {
        console.error(`❌ Erreur suppression mémoire ${memoireId}:`, error);
        throw error;
    }
}

/**
 * Supprimer un mémoire avec confirmation simple (alert)
 * @param {number|string} memoireId - ID du mémoire
 * @param {string} memoireTitre - Titre du mémoire (pour le message)
 * @returns {Promise<boolean>} - true si supprimé, false si annulé
 */
async function deleteMemoireWithConfirm(memoireId, memoireTitre = '') {
    const message = memoireTitre 
        ? `Voulez-vous vraiment supprimer le mémoire : "${memoireTitre}" ?\nCette action est irréversible.`
        : `Voulez-vous vraiment supprimer ce mémoire ?\nCette action est irréversible.`;
    
    if (!confirm(message)) {
        console.log('❌ Suppression annulée par l\'utilisateur');
        return false;
    }
    
    try {
        await deleteMemoire(memoireId);
        return true;
    } catch (error) {
        alert(`Erreur lors de la suppression : ${error.message}`);
        return false;
    }
}

/**
 * Supprimer plusieurs mémoires (batch)
 * @param {Array<number|string>} memoireIds - IDs des mémoires à supprimer
 * @returns {Promise<Object>} - Résumé des suppressions
 */
async function deleteMultipleMemoires(memoireIds) {
    if (!Array.isArray(memoireIds) || memoireIds.length === 0) {
        return { total: 0, success: 0, failed: 0, errors: [] };
    }
    
    // Demander confirmation pour la suppression multiple
    const confirmMessage = `Voulez-vous vraiment supprimer ${memoireIds.length} mémoire(s) ?\nCette action est irréversible.`;
    if (!confirm(confirmMessage)) {
        console.log('❌ Suppression multiple annulée');
        return { total: 0, success: 0, failed: 0, cancelled: true };
    }
    
    const results = {
        total: memoireIds.length,
        success: 0,
        failed: 0,
        errors: []
    };
    
    console.log(`🗑️ Début suppression de ${memoireIds.length} mémoire(s)...`);
    
    for (const id of memoireIds) {
        try {
            await deleteMemoire(id);
            results.success++;
        } catch (error) {
            results.failed++;
            results.errors.push({
                id: id,
                error: error.message
            });
            console.error(`Échec pour mémoire ${id}:`, error);
        }
        
        // Petit délai pour ne pas surcharger le serveur
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`📊 Résumé: ${results.success}/${results.total} supprimés avec succès`);
    
    // Afficher un résumé à l'utilisateur
    if (results.failed > 0) {
        alert(`${results.success} mémoire(s) supprimé(s) avec succès.\n${results.failed} échec(s). Voir la console pour les détails.`);
    } else {
        alert(`${results.success} mémoire(s) supprimé(s) avec succès.`);
    }
    
    return results;
}

/**
 * Supprimer un mémoire depuis un bouton/élément HTML
 * @param {HTMLElement} element - Élément HTML contenant data-memoire-id
 */
function setupDeleteButton(element) {
    if (!element) return;
    
    const memoireId = element.dataset.memoireId;
    const memoireTitre = element.dataset.memoireTitre || '';
    
    element.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const success = await deleteMemoireWithConfirm(memoireId, memoireTitre);
        
        if (success) {
            // Optionnel: Supprimer la ligne du tableau ou rafraîchir
            const row = element.closest('tr');
            if (row) {
                row.style.opacity = '0.5';
                setTimeout(() => row.remove(), 300);
            }
        }
    });
}

/**
 * Configurer tous les boutons de suppression sur la page
 */
function setupAllDeleteButtons() {
    document.querySelectorAll('[data-action="delete-memoire"]').forEach(button => {
        setupDeleteButton(button);
    });
}

/**
 * Exporter les fonctions
 */
export const deleteAPI = {
    deleteMemoire,
    deleteMemoireWithConfirm,
    deleteMultipleMemoires,
    setupDeleteButton,
    setupAllDeleteButtons
};