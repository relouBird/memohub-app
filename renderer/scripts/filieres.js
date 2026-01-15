// scripts/filieres.js
// Logique spécifique à la page filières

// import { filieresData } from './data.js';
import { initCommon } from './common.js';
import {dataGetter} from './methods/get.js';

document.addEventListener('DOMContentLoaded', function() {
    initCommon();
    initFilieres();
});

async function initFilieres() {
    const data = await dataGetter.getGlobalStats();
    loadFilieres([...data.filieres]);
    setupFilieresEventListeners();
}

function loadFilieres(filieresData= []) {
    const container = document.getElementById('filiereContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    filieresData.forEach(filiere => {
        const card = document.createElement('div');
        card.className = 'filiere-card';
        card.innerHTML = `
            <h4><i class="${filiere.icon}"></i> ${filiere.nom}</h4>
            <p>${filiere.description}</p>
            <div class="filiere-stats">
                <div>
                    <strong>${filiere.memos}</strong>
                    <p>Mémoires</p>
                </div>
                <div>
                    <strong>${filiere.encadreurs}</strong>
                    <p>Encadreurs</p>
                </div>
                <div>
                    <strong>${filiere.derniereAnnee}</strong>
                    <p>Dernière année</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function setupFilieresEventListeners() {
    // Recherche
    const searchFiliere = document.getElementById('searchFiliere');
    if (searchFiliere) {
        searchFiliere.addEventListener('input', function() {
            filterFilieres(this.value);
        });
    }
}

function filterFilieres(searchTerm) {
    const cards = document.querySelectorAll('.filiere-card');
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}