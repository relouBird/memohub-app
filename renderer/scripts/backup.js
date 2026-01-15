// scripts/backup.js
// Logique spécifique à la page sauvegarde

import { backupsData } from './data.js';
import { initCommon, createBackup, restoreBackup } from './common.js';

document.addEventListener('DOMContentLoaded', function() {
    initCommon();
    initBackup();
});

function initBackup() {
    loadBackups();
    setupBackupEventListeners();
}

function loadBackups() {
    const tableBody = document.getElementById('backupsTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    backupsData.forEach(backup => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${backup.date}</td>
            <td>${backup.nom}</td>
            <td>${backup.taille}</td>
            <td>
                <button class="action-btn" title="Télécharger" onclick="downloadBackup('${backup.nom}')">
                    <i class="fas fa-download"></i>
                </button>
                <button class="action-btn delete" title="Supprimer" onclick="deleteBackup('${backup.nom}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function setupBackupEventListeners() {
    // Boutons
    const backupBtn = document.getElementById('backupBtn');
    const restoreBtn = document.getElementById('restoreBtn');
    
    if (backupBtn) {
        backupBtn.addEventListener('click', createBackup);
    }
    
    if (restoreBtn) {
        restoreBtn.addEventListener('click', restoreBackup);
    }
}

// Fonctions spécifiques à la page backup
window.downloadBackup = function(filename) {
    alert(`Téléchargement de: ${filename}\n\nLe fichier de sauvegarde serait téléchargé sur votre ordinateur.`);
};

window.deleteBackup = function(filename) {
    if (confirm(`Supprimer la sauvegarde "${filename}" ?`)) {
        const index = backupsData.findIndex(b => b.nom === filename);
        if (index > -1) {
            backupsData.splice(index, 1);
            loadBackups();
            alert('Sauvegarde supprimée avec succès.');
        }
    }
};