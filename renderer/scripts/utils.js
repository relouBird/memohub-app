export function memoriesHelper(data = []) {
  let memories = data.map((entity) => {
    return {
      id: entity.id,
      titre: entity.titre,
      auteur: entity.auteur,
      encadreur: entity.nom_encadreur,
      filiere: entity.nom_filiere,
      annee: entity.annee,
      fichier: entity.fichier,
      taille: entity.taille,
      url: `http://127.0.0.1:8000/${entity.fichier_pdf}`,
      date_ajout: entity.date_ajout,
      date_modification: entity.date_modification,
      motsCles: entity.motsCles_list,
    };
  });
  return memories;
}

export function tracksHelper(data = []) {
  let memories = data.map((entity) => {
    return {
      id: entity.id,
      nom: entity.nom,
      description: entity.description,
      icon: entity.icon,
      memos: entity.memos,
      encadreurs: entity.encadreurs,
      derniereAnnee: entity.derniereAnnee,
    };
  });
  return memories;
}

export function supervisorsHelper(data = []) {
  let memories = data.map((entity) => {
    return {
      id: entity.id,
      nom: entity.nom,
      avatar: entity.avatar,
      specialite: entity.nom_specialite,
      depuis: entity.depuis,
      memos: entity.memos,
      description: entity.description,
    };
  });
  return memories;
}