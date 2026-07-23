/* Brand positioning refresh — games first, digital products second. */
(() => {
  const D = window.FEATHER_TRANSLATIONS ||= {};
  const shared = {
    fr: { navRoadmap: "Accueil", navProject: "Prochain jeu", navTeam: "Le studio", navGenable: "Genable AI" },
    en: { navRoadmap: "Home", navProject: "Next game", navTeam: "Studio", navGenable: "Genable AI" },
    es: { navRoadmap: "Inicio", navProject: "Próximo juego", navTeam: "Estudio", navGenable: "Genable AI" },
    it: { navRoadmap: "Home", navProject: "Prossimo gioco", navTeam: "Studio", navGenable: "Genable AI" },
    de: { navRoadmap: "Start", navProject: "Nächstes Spiel", navTeam: "Studio", navGenable: "Genable AI" },
    zh: { navRoadmap: "首页", navProject: "下一款游戏", navTeam: "工作室", navGenable: "Genable AI" },
    ja: { navRoadmap: "ホーム", navProject: "次回作", navTeam: "スタジオ", navGenable: "Genable AI" },
    ko: { navRoadmap: "홈", navProject: "다음 게임", navTeam: "스튜디오", navGenable: "Genable AI" }
  };
  Object.entries(shared).forEach(([lang, values]) => Object.assign(D[lang] ||= {}, values));
  if (D.fr) D.fr.statusValue = "En finalisation";
  if (D.en) D.en.statusValue = "In finalization";

  D.fr.home = {
    title: "Feather Labs Interactive — Studio de jeux indépendant",
    description: "Studio indépendant dédié avant tout aux jeux vidéo, avec un pôle secondaire de produits numériques.",
    navHome: "Accueil", navGames: "Jeux", navProducts: "Produits", navRoadmap: "Roadmap",
    kicker: "Studio indépendant · Jeux vidéo avant tout",
    heroTitle: "Nous créons des jeux qui ont leur propre voix.",
    heroCopy: "Feather Labs Interactive imagine et développe principalement des jeux vidéo indépendants. En parallèle, notre savoir-faire technique donne naissance à une sélection de produits numériques utiles.",
    discoverGame: "Découvrir Pipi Panic", followStudio: "Suivre le studio",
    storeNote: "La page Google Play sera ajoutée dès la validation de la version de production.", primaryActivity: "Activité principale · Jeux vidéo",
    gamesKicker: "Notre cœur de métier", gamesTitle: "Des jeux indépendants, conçus avec caractère.", gamesIntro: "De l’idée au lancement, nous construisons nos univers, leur gameplay et leur identité avec une production volontairement agile.",
    currentGame: "Jeu en finalisation", pipiIntro: "Un jeu mobile cartoon, direct et volontairement absurde, où chaque urgence devient une situation de chaos.", independentProduction: "Production indépendante", explorePipi: "Explorer le jeu",
    nextGameLabel: "Après Pipi Panic", nextGameTitle: "Une nouvelle création est déjà en préparation.",
    productsKicker: "Activité secondaire", productsTitle: "Notre expertise sert aussi des produits numériques.", productsIntro: "Cette activité annexe transforme nos compétences en développement, automatisation et interface en outils destinés aux professionnels — sans détourner le studio de sa vocation première : créer des jeux.",
    productDevelopment: "Produit en développement", genableIntro: "Un CRM intelligent et configurable pour centraliser contacts, devis, factures, projets et automatisations.", tryDemo: "Tester la démo", learnMore: "En savoir plus →",
    roadmapKicker: "Feuille de route publique", roadmapTitle: "Ce qui avance actuellement.", roadmapIntro: "Une vue volontairement concise des productions annoncées. Les projets confidentiels restent confidentiels jusqu’au bon moment.", finalization: "Finalisation", preproduction: "Préproduction", secondaryProduct: "Pôle produits", nextCreation: "Nouvelle création", pipiRoadmap: "Polissage, publication mobile et préparation du lancement.", nextRoadmap: "Un prochain jeu prend forme avant sa révélation officielle.", genableRoadmap: "Consolidation du CRM et préparation des premiers cas clients.",
    ctaKicker: "Suivre l’aventure", ctaTitle: "Découvrez les créateurs derrière le studio.", ctaCopy: "Retrouvez nos chaînes, nos coulisses et les moyens de nous contacter. Le Discord officiel du studio arrivera plus tard.", meetTeam: "Découvrir l’équipe", contact: "Nous contacter", team: "L’équipe", privacy: "Confidentialité", terms: "Conditions"
  };

  D.en.home = {
    title: "Feather Labs Interactive — Independent game studio", description: "An independent studio focused primarily on video games, with a secondary digital products division.",
    navHome: "Home", navGames: "Games", navProducts: "Products", navRoadmap: "Roadmap", kicker: "Independent studio · Games first", heroTitle: "We create games with a voice of their own.", heroCopy: "Feather Labs Interactive primarily creates independent video games. Alongside them, our technical expertise powers a focused selection of useful digital products.", discoverGame: "Discover Pipi Panic", followStudio: "Follow the studio", storeNote: "The Google Play page will be added as soon as the production release is approved.", primaryActivity: "Primary activity · Video games", gamesKicker: "Our core activity", gamesTitle: "Independent games built with character.", gamesIntro: "From idea to launch, we craft our worlds, gameplay and identity through an intentionally agile production process.", currentGame: "Game in finalization", pipiIntro: "A direct, cartoon mobile game where every urgent situation turns into chaos.", independentProduction: "Independent production", explorePipi: "Explore the game", nextGameLabel: "After Pipi Panic", nextGameTitle: "A new creation is already taking shape.", productsKicker: "Secondary activity", productsTitle: "Our expertise also powers digital products.", productsIntro: "This complementary activity turns our development, automation and interface skills into professional tools — without changing our primary purpose: making games.", productDevelopment: "Product in development", genableIntro: "An intelligent, configurable CRM for contacts, quotes, invoices, projects and automations.", tryDemo: "Try the demo", learnMore: "Learn more →", roadmapKicker: "Public roadmap", roadmapTitle: "What we are working on.", roadmapIntro: "A concise view of announced productions. Confidential projects stay confidential until the right moment.", finalization: "Finalization", preproduction: "Pre-production", secondaryProduct: "Products division", nextCreation: "New creation", pipiRoadmap: "Polish, mobile publishing and launch preparation.", nextRoadmap: "Our next game is taking shape ahead of its official reveal.", genableRoadmap: "CRM consolidation and preparation of initial customer cases.", ctaKicker: "Follow the journey", ctaTitle: "Meet the creators behind the studio.", ctaCopy: "Find our channels, behind-the-scenes updates and contact details. The studio’s official Discord will come later.", meetTeam: "Meet the team", contact: "Contact us", team: "Team", privacy: "Privacy", terms: "Terms"
  };

  ["es", "it", "de", "zh", "ja", "ko"].forEach(lang => { D[lang].home = { ...D.en.home }; });

  Object.keys(D).forEach(lang => {
    const g = D[lang].genable;
    if (g) {
      Object.keys(g).forEach(key => { if (typeof g[key] === "string") g[key] = g[key].replaceAll("Genable AI (WIP)", "Genable AI"); });
    }
    const r = D[lang].roadmap;
    if (r?.timelineIntro && lang === "fr") r.timelineIntro = "La feuille de route distingue notre activité principale de jeux vidéo et notre pôle secondaire de produits numériques.";
  });
})();
