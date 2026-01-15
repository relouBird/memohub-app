// Logique spécifique à la page encadreurs

import { initCommon } from './common.js';
import {dataGetter} from './methods/get.js';

document.addEventListener('DOMContentLoaded', function() {
    initCommon();
    initEncadreurs();
});

async function initEncadreurs() {
    const data = await dataGetter.getGlobalStats();
    loadEncadreurs([...data.encadreurs]);
    setupEncadreursEventListeners();
}

function loadEncadreurs(encadreursData = []) {
    const container = document.getElementById('encadreursContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    encadreursData.forEach(encadreur => {
        const card = document.createElement('div');
        card.className = 'encadreur-card';
        card.innerHTML = `
            <div class="encadreur-header">
                <div class="encadreur-avatar">${encadreur.avatar}</div>
                <div class="encadreur-info">
                    <h4>${encadreur.nom}</h4>
                    <p>${encadreur.specialite}</p>
                </div>
            </div>
            <p>${encadreur.description}</p>
            <div class="encadreur-stats">
                <span>Depuis ${encadreur.depuis}</span>
                <span>${encadreur.memos} mémoires</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function setupEncadreursEventListeners() {
    // Recherche
    const searchEncadreur = document.getElementById('searchEncadreur');
    if (searchEncadreur) {
        searchEncadreur.addEventListener('input', function() {
            filterEncadreurs(this.value);
        });
    }
}

function filterEncadreurs(searchTerm) {
    const cards = document.querySelectorAll('.encadreur-card');
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}