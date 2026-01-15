// scripts/viewer.js
// Logique spécifique à la page lecteur PDF

import { initCommon } from './common.js';

document.addEventListener('DOMContentLoaded', function() {
    initCommon();
    initViewer();
});

function initViewer() {
    loadMemoDetails();
    setupViewerEventListeners();
}

function loadMemoDetails() {
    // Récupérer les données du mémoire depuis le localStorage
    const memoData = (localStorage.getItem('view-item'));
    
    if (memoData) {
        const memo = JSON.parse(memoData);
        
        // Mettre à jour l'interface
        document.getElementById('pdfTitle').textContent = memo.titre;
        document.getElementById('pdfDescription').innerHTML = `Mémoire de <strong>${memo.auteur}</strong> - ${memo.annee}`;
        
        // Ajouter des détails supplémentaires
        const detailsContainer = document.getElementById('pdfDetails');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <p><i class="fas fa-user-graduate"></i> Auteur: ${memo.auteur}</p>
                <p><i class="fas fa-chalkboard-teacher"></i> Encadreur: ${memo.encadreur}</p>
                <p><i class="fas fa-sitemap"></i> Filière: ${memo.filiere}</p>
                <p><i class="fas fa-file-alt"></i> Taille: ${memo.taille}</p>
            `;
        }
        
        // Nettoyer le localStorage après utilisation
        localStorage.removeItem('view-item');

        const iframe = document.querySelector("iframe");
        iframe.src = `${memo.url}`

        // Gerer les details
        const keywordContainer = document.querySelector("div.keywords-container");


        const keyWordsDefined = `${memo.motsCles.map(data =>{
            return "<span class=\"keyword-tag\">" + data + "</span>"
        }).join(' ')}`

        keywordContainer.innerHTML = `
                        <h4><i class="fas fa-tags"></i> Mots-clés</h4>
                        <div class="keywords-tags">${keyWordsDefined}</div>

                        <h4 class="abstract-section"><i class="fas fa-file-contract"></i> Résumé</h4>
                        <p>Ce mémoire présente le développement d'un système IoT pour le monitoring des paramètres
                            environnementaux.</p>`
    }
}

function setupViewerEventListeners() {
    // Boutons zoom
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => alert('Zoom avant (fonctionnalité PDF)'));
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => alert('Zoom arrière (fonctionnalité PDF)'));
    }
    
    // Bouton retour
    const backBtn = document.querySelector('[onclick*="back"]');
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
        });
    }
}