    // Configuration des chemins selon le mode
    const CONFIG = {
      edl: {
        basePath: 'photo/visite360/prieuré/edl/',
        plans: {
          rdc: 'photo/visite360/prieuré/edl/plans/planRDC.webp',
          r1: 'photo/visite360/prieuré/edl/plans/planR+1.webp',
          rdj: 'photo/visite360/prieuré/edl/plans/planRDJ.webp'
        },
        video: 'photo/visite360/prieuré/edl/360/FPV16-9.mp4'
      },
      projet: {
        basePath: 'photo/visite360/prieuré/projet/',
        plans: {
          rdc: 'photo/visite360/prieuré/projet/plans/planRDC.webp',
          r1: 'photo/visite360/prieuré/projet/plans/planR+1.webp',
          rdj: 'photo/visite360/prieuré/projet/plans/planRDJ.webp'
        },
        video: 'photo/visite360/prieuré/projet/video/FPV16-9.mp4'
      }
    };
    
    let currentMode = 'edl';
    let currentFloor = 'rdc';
    let gyroActive = false;
    let viewer;
    
    // Fonction pour obtenir le chemin d'une image 360°
    function get360Path(sceneName) {
      return CONFIG[currentMode].basePath + '360/' + sceneName + '.webp';
    }
    
    // Fonction pour obtenir le chemin d'une image preview
    function getPreviewPath(sceneName) {
      return CONFIG[currentMode].basePath + 'preview/' + sceneName + '.webp';
    }
    
    // Fonction pour obtenir le chemin d'un plan
    function getPlanPath(floor) {
      return CONFIG[currentMode].plans[floor];
    }

    // Fonction d'entrée sur le site
    function enterSite() {
      const welcomeScreen = document.getElementById('welcome-screen');
      const enterBtn = document.querySelector('.enter-btn');
      const loadingDots = document.getElementById('loading-dots');
      
      // Masquer le bouton et afficher le chargement
      enterBtn.style.display = 'none';
      loadingDots.style.display = 'flex';
      
      // Simuler un temps de chargement pour l'effet
      setTimeout(() => {
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transition = 'opacity 0.8s ease';
        
        setTimeout(() => {
          welcomeScreen.style.display = 'none';
          
          // Afficher la barre de navigation avec animation
          showNavigation();
          
          // Afficher le plan après l'animation de la barre
          setTimeout(() => {
            showPlan();
          }, 400);
        }, 800);
      }, 1500);
    }

    // Afficher la barre de navigation avec animation
    function showNavigation() {
      const navigation = document.getElementById('main-navigation');
      const body = document.body;
      
      // Réinitialiser le display si nécessaire
      navigation.style.display = 'flex';
      
      // Forcer un reflow pour que l'animation fonctionne
      navigation.offsetHeight;
      
      // Afficher la navigation
      navigation.classList.add('show');
      body.classList.add('navigation-visible');
    }

    // Masquer la barre de navigation avec animation
    function hideNavigation() {
      const navigation = document.getElementById('main-navigation');
      const body = document.body;
      
      navigation.classList.remove('show');
      body.classList.remove('navigation-visible');
    }

    // Afficher les boutons flottants
    function showFloatingControls() {
      const floatingControls = document.getElementById('floating-controls');
      floatingControls.style.display = 'flex';
      setTimeout(() => {
        floatingControls.classList.add('show');
      }, 100);
      updateFloatingInterface();
    }
    
    // Masquer les boutons flottants
    function hideFloatingControls() {
      const floatingControls = document.getElementById('floating-controls');
      floatingControls.classList.remove('show');
      setTimeout(() => {
        floatingControls.style.display = 'none';
      }, 300);
    }
    
    // Mettre à jour l'interface des boutons flottants
    function updateFloatingInterface() {
      // Mettre à jour les boutons de mode
      document.querySelectorAll('.floating-mode-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      const targetMode = currentMode === 'edl' ? 'edl' : 'projet';
      const activeBtn = document.querySelector(`.floating-mode-btn[onclick*="'${targetMode}'"]`);
      if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-pressed', 'true');
      }
      
      // Mettre à jour les boutons d'étage
      document.querySelectorAll('.floating-floor-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      const activeFloorBtn = document.querySelector(`.floating-floor-btn[onclick*="'${currentFloor}'"]`);
      if (activeFloorBtn) {
        activeFloorBtn.classList.add('active');
        activeFloorBtn.setAttribute('aria-pressed', 'true');
      }
    }

    // Fonction pour détecter mobile
    function isMobile() {
      return window.innerWidth <= 768;
    }

    // Synchronisation de l'interface selon la phase et l'étage
    function updateInterface() {
      // Mettre à jour les boutons de navigation
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      const targetMode = currentMode === 'edl' ? 'edl' : 'projet';
      const activeBtn = document.querySelector(`.mode-btn[onclick*="'${targetMode}'"]`);
      if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-pressed', 'true');
      }
      
      document.querySelectorAll('.floor-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      const activeFloorBtn = document.querySelector(`.floor-nav-btn[onclick*="'${currentFloor}'"]`);
      if (activeFloorBtn) {
        activeFloorBtn.classList.add('active');
        activeFloorBtn.setAttribute('aria-pressed', 'true');
      }
      
      // Mettre à jour les plans
      updatePlans();
    }

    // Gestion des erreurs d'images manquantes
    function handleImageError(imagePath, fallbackPath) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(imagePath);
        img.onerror = () => {
          console.warn(`Image non trouvée: ${imagePath}, utilisation de: ${fallbackPath}`);
          resolve(fallbackPath);
        };
        img.src = imagePath;
      });
    }

    // Mettre à jour tous les plans selon la phase et l'étage avec gestion d'erreur
    async function updatePlans() {
      const planPath = getPlanPath(currentFloor);
      const fallbackPath = 'photo/visite360/prieuré/edl/plans/planRDC.webp';
      
      try {
        const validPath = await handleImageError(planPath, fallbackPath);
        
        document.getElementById('plan-fullscreen-img').src = validPath;
        document.getElementById('plan-mini-img').src = validPath;
        document.getElementById('plan-mini-img-projet').src = validPath.replace('/edl/', '/projet/');
        
        updateZones();
      } catch (error) {
        console.error('Erreur lors du chargement du plan:', error);
        document.getElementById('plan-fullscreen-img').src = fallbackPath;
        document.getElementById('plan-mini-img').src = fallbackPath;
        document.getElementById('plan-mini-img-projet').src = fallbackPath.replace('/edl/', '/projet/');
        updateZones();
      }
    }

    // Mettre à jour les images de samplesroom selon le mode
    function updateSamplesroomImages() {
      document.getElementById('nav-exterieur3').querySelector('img').src = getPreviewPath('extérieur3');
      document.getElementById('nav-yoga').querySelector('img').src = getPreviewPath('yoga');
      document.querySelector('#samplesroom-section > img').src = get360Path('samplesroom');
    }

    // Mettre à jour l'affichage des zones
    function updateZones() {
      try {
        // Zones plein écran
        document.querySelectorAll('[id^="fullscreen-zones-"]').forEach(zone => zone.style.display = 'none');
        const fullscreenZoneSuffix = currentMode === 'projet' ? `-projet` : '';
        const fullscreenId = `fullscreen-zones-${currentFloor}${fullscreenZoneSuffix}`;
        const fullscreenElement = document.getElementById(fullscreenId);
        if (fullscreenElement) {
          fullscreenElement.style.display = 'block';
        }
        
        // Zones miniatures plan EDL
        const zoneRdc = document.getElementById('zones-rdc');
        const zoneR1 = document.getElementById('zones-r1');
        const zoneRdj = document.getElementById('zones-rdj');
        
        if (zoneRdc) zoneRdc.style.display = 'none';
        if (zoneR1) zoneR1.style.display = 'none';
        if (zoneRdj) zoneRdj.style.display = 'none';
        
        // Zones miniatures plan PROJET
        const zoneRdcProjét = document.getElementById('zones-rdc-projet');
        const zoneR1Projet = document.getElementById('zones-r1-projet');
        const zoneRdjProjet = document.getElementById('zones-rdj-projet');
        
        if (zoneRdcProjét) zoneRdcProjét.style.display = 'none';
        if (zoneR1Projet) zoneR1Projet.style.display = 'none';
        if (zoneRdjProjet) zoneRdjProjet.style.display = 'none';
        
        // Afficher la bonne zone selon le mode
        if (currentMode === 'projet') {
          const zoneProjet = document.getElementById(`zones-${currentFloor}-projet`);
          if (zoneProjet) zoneProjet.style.display = 'block';
        } else {
          const zoneEdl = document.getElementById(`zones-${currentFloor}`);
          if (zoneEdl) zoneEdl.style.display = 'block';
        }
      } catch (error) {
        console.error('Erreur dans updateZones():', error);
      }
    }

    // Changement de mode (edl/projet) avec gestion d'erreur
    function switchMode(mode) {
      if (mode === 'avant') mode = 'edl'; // Conversion pour compatibilité
      if (mode === currentMode) return;

      const previousMode = currentMode;
      currentMode = mode;
      updateInterface();
      updateFloatingInterface(); // Mettre à jour aussi les boutons flottants
      updateSamplesroomImages();

      // Si on est dans une photo 360°, changer la scène
      if (viewer && document.getElementById('panorama').style.display === 'block') {
        const currentScene = viewer.getScene();
        const baseScene = currentScene.replace('_projet', '').replace('_edl', '');

        // Cherche la scene equivalente (meme position sur le plan) dans le nouveau mode
        const targetScene = (typeof window.findEquivalentScene === 'function')
          ? window.findEquivalentScene(baseScene, previousMode, mode)
          : baseScene;

        loadScene(targetScene);
      }
    }

    // Changement d'étage
    function switchToFloor(floor) {
      if (floor === currentFloor) return;
      
      currentFloor = floor;
      updateInterface();
      updateFloatingInterface(); // Mettre à jour aussi les boutons flottants
      
      // Si on est dans le plan plein écran, le mettre à jour
      if (document.getElementById('plan-fullscreen').style.display === 'flex') {
        // Pas besoin de faire plus, updateInterface() s'en charge
      }
      // Si on est dans une autre vue, revenir au plan
      else {
        showPlan();
      }
    }

    // Initialisation Panellum (différée)
    function initPanellum(firstSceneKey) {
      const firstScene = firstSceneKey || 'yoga';
      viewer = pannellum.viewer('panorama', {
        autoLoad: true,
        default: {
          firstScene: firstScene,
          sceneFadeDuration: 400,
          showZoomCtrl: false,
          showFullscreenCtrl: false,
          showControls: false,
          mouseZoom: true,
          orientationOnByDefault: false,
          friction: 0.15
        },


        // EDL
      scenes: {
        // RDJ - samplesroom maintenant gérée comme image normale
        yoga: {
          panorama: "photo/visite360/prieuré/edl/360/yoga.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 10, yaw: 60, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/samplesroom.webp" alt="samplesroom">`;
              },
              clickHandlerFunc: function(){ showSamplesroom(); }
            },
            {
              pitch: 10, yaw: 40, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur3.webp" alt="extérieur3">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'extérieur3_projet' : 'extérieur3';
                viewer.loadScene(targetScene); 
              }
            }
          ]
        },
        extérieur3 : {
          panorama: "photo/visite360/prieuré/edl/360/extérieur3.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: -32, yaw: 5, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/samplesroom.webp" alt="samplesroom">`;
              },
              clickHandlerFunc: function(){ showSamplesroom(); }
            },
            {
              pitch: -20, yaw: 25, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/yoga.webp" alt="yoga">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'yoga_projet' : 'yoga';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: -17, yaw: -20, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréception.webp" alt="salleréception">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréception'); }
            },
            {
              pitch: -2, yaw: -20, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/grandesalle.webp" alt="grandesalle">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('grandesalle'); }
            },
            {
              pitch: -10, yaw: 30, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion.webp" alt="salleréunion">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion'); }
            },
            {
              pitch: 0, yaw: 30, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/mezzanine.webp" alt="mezzanine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('mezzanine'); }
            }
          ]
        },

        
        // RDC - EDL
        extérieur : {
          panorama: "photo/visite360/prieuré/edl/360/extérieur.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: -2, yaw: -72, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur2.webp" alt="extérieur2">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'extérieur2_projet' : 'extérieur2';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: -10, yaw: -55, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'salleréunion2_projet' : 'salleréunion2';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: -10, yaw: -2, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/cuisine.webp" alt="Cuisine">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'cuisine_projet' : 'cuisine';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: 15, yaw: -2, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/billard.webp" alt="billard">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'billard_projet' : 'billard';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: -10, yaw: 50, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréception.webp" alt="salleréception">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'salleréception_projet' : 'salleréception';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: 10, yaw: 50, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/grandesalle.webp" alt="grandesalle">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'grandesalle_projet' : 'grandesalle';
                viewer.loadScene(targetScene); 
              }
            }
          ]
        },
        extérieur2 : {
          panorama: "photo/visite360/prieuré/edl/360/extérieur2.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: -3, yaw: -37, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion.webp" alt="salleréunion">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'salleréunion_projet' : 'salleréunion';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: 10, yaw: -37, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/mezzanine.webp" alt="mezzanine">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'mezzanine_projet' : 'mezzanine';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: -5, yaw: -5, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'salleréunion2_projet' : 'salleréunion2';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: -5, yaw: 20, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'extérieur_projet' : 'extérieur';
                viewer.loadScene(targetScene); 
              }
            }
          ]
        },
        salleréunion : {
          panorama: "photo/visite360/prieuré/edl/360/salleréunion.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -105, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur3.webp" alt="extérieur3">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur3'); }
            },
            {
              pitch: 0, yaw: -50, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/wc.webp" alt="wc">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('wc'); }
            },
            {
              pitch: 0, yaw: -35, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréception.webp" alt="salleréception">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréception'); }
            },
            {
              pitch: 0, yaw: -25, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/cuisine.webp" alt="cuisine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('cuisine'); }
            },
            {
              pitch: 0, yaw: 0, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            },
            {
              pitch: 0, yaw: 10, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur'); }
            },
            {
              pitch: 0, yaw: 45, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur2.webp" alt="extérieur2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur2'); }
            }
          ]
        },
        salleréunion2: {
          panorama: "photo/visite360/prieuré/edl/360/salleréunion2.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 32, yaw: 0, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/mezzanine.webp" alt="mezzanine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('mezzanine'); }
            },
            {
              pitch: 0, yaw: -10, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion.webp" alt="salleréunion">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion'); }
            },
            {
              pitch: 0, yaw: 20, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/wc.webp" alt="wc">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('wc'); }
            },
            {
              pitch: 0, yaw: 30, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréception.webp" alt="salleréception">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréception'); }
            },
            {
              pitch: 0, yaw: 40, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/cuisine.webp" alt="cuisine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('cuisine'); }
            },
            {
              pitch: 20, yaw: 75, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/billard.webp" alt="billard">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('billard'); }
            },
            {
              pitch: 0, yaw: 170, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur'); }
            },
            {
              pitch: 0, yaw: 250, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur2.webp" alt="extérieur2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur2'); }
            }
          ]
        },
        cuisine : {
          panorama: "photo/visite360/prieuré/edl/360/cuisine.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -80, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            },
            {
              pitch: 0, yaw: -50, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion.webp" alt="salleréunion">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion'); }
            },
            {
              pitch: 0, yaw: -10, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/wc.webp" alt="wc">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('wc'); }
            },
            {
              pitch: 0, yaw: 70, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréception.webp" alt="salleréception">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréception'); }
            },
            {
              pitch: 0, yaw: 180, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur'); }
            }
          ]
        },
        wc : {
          panorama: "photo/visite360/prieuré/edl/360/wc.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -250, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréception.webp" alt="salleréception">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréception'); }
            },
            {
              pitch: 0, yaw: -210, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/cuisine.webp" alt="cuisine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('cuisine'); }
            },
            {
              pitch: 0, yaw: -120, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            }
          ]
        },
        salleréception: {
          panorama: "photo/visite360/prieuré/edl/360/sallereception.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -100, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur'); }
            },
            {
              pitch: 0, yaw: -15, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/cuisine.webp" alt="cuisine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('cuisine'); }
            },
            {
              pitch: 0, yaw: 3, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            },
            {
              pitch: 0, yaw: 15, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/wc.webp" alt="wc">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('wc'); }
            },
            {
              pitch: 10, yaw: 145, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur3.webp" alt="extérieur3">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur3'); }
            }
          ]
        },
        

        // R+1
        billard : {
          panorama: "photo/visite360/prieuré/edl/360/billard.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: 215, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur'); }
            },
            {
              pitch: -20, yaw: 233, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            },
            {
              pitch: 0, yaw: 300, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/petitesalle.webp" alt="petitesalle">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('petitesalle'); }
            },
            {
              pitch: 0, yaw: 330, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/toilette.webp" alt="toilette">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('toilette'); }
            },
            {
              pitch: 0, yaw: 380, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/grandesalle.webp" alt="grandesalle">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('grandesalle'); }
            }
          ]
        },
        grandesalle : {
          panorama: "photo/visite360/prieuré/edl/360/grandesalle.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: 0, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/billard.webp" alt="billard">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('billard'); }
            },
            {
              pitch: 0, yaw: 85, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/toilette.webp" alt="toilette">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('toilette'); }
            },
            {
              pitch: 0, yaw: 200, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur3.webp" alt="extérieur3">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur3'); }
            }
          ]
        },
        petitesalle : {
          panorama: "photo/visite360/prieuré/edl/360/petitesalle.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -170, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/toilette.webp" alt="toilette">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('toilette'); }
            },
            {
              pitch: 0, yaw: -130, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/grandesalle.webp" alt="grandesalle">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('grandesalle'); }
            },
            {
              pitch: 0, yaw: -60, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/billard.webp" alt="billard">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('billard'); }
            },
          ]
        },
        toilette : {
          panorama: "photo/visite360/prieuré/edl/360/toilette.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -145, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/grandesalle.webp" alt="grandesalle">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('grandesalle'); }
            },
            {
              pitch: 0, yaw: -105, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/billard.webp" alt="billard">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('billard'); }
            },
            {
              pitch: 0, yaw: -50, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/petitesalle.webp" alt="petitesalle">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('petitesalle'); }
            },
            {
              pitch: 0, yaw: 30, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/mezzanine.webp" alt="mezzanine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('mezzanine'); }
            }
          ]
        },
        mezzanine : {
          panorama: "photo/visite360/prieuré/edl/360/mezzanine.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -53, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/toilette.webp" alt="toilette">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('toilette'); }
            },
            {
              pitch: -10, yaw: 30, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            }
          ]
        },






          
        // PROJET
        // RDJ 
        formation_p: {
          panorama: "photo/visite360/prieuré/projet/360/formation_p.png",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 10, yaw: 40, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/projet/preview/formation_p.png" alt="formation_p">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'formation_projet' : 'formation';
                viewer.loadScene(targetScene); 
              }
            }
          ]
        },
        formation2_p : {
          panorama: "photo/visite360/prieuré/projet/360/formation2_p.png",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: -32, yaw: 5, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/projet/preview/entree_p.png" alt="samplesroom">`;
              },
              clickHandlerFunc: function(){ showSamplesroom(); }
            },
            {
              pitch: -20, yaw: 25, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/projet/preview/formation2" alt="yoga">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'yoga_projet' : 'yoga';
                viewer.loadScene(targetScene); 
              }
            },
          ]
        },
        extérieur3_p: {
          panorama: "photo/visite360/prieuré/projet/360/extérieur3.png",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 10, yaw: 40, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/projet/preview/extérieur3_p.png" alt="extérieur3">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'extérieur3_projet' : 'extérieur3';
                viewer.loadScene(targetScene); 
              }
            }
          ]
        },

        // RDC PROJET
        boutique_projet: {
          panorama: "photo/visite360/prieuré/projet/360/projet-_BOUTIQUE-360.png",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: []
        },
        boutique1_projet: {
          panorama: "photo/visite360/prieuré/projet/360/projet-_BOUTIQUE-360.png",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: []
        },
        atelier_projet: {
          panorama: "photo/visite360/prieuré/projet/360/projet-_ATELIER-360.png",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: []
        },
        cuisine_projet: {
          panorama: "photo/visite360/prieuré/projet/360/projet-_CUISINE-360.png",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: []
        },

        // R+1 PROJET
        test_projet: {
          panorama: "photo/visite360/prieuré/projet/360/projet-_TEST-360.png",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: []
        },
        fillet_projet: {
          panorama: "photo/visite360/prieuré/projet/360/projet-_FORMATION 2-360.png",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: []
        },

        
        // RDC - EDL
        extérieur : {
          panorama: "photo/visite360/prieuré/edl/360/extérieur.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: -2, yaw: -72, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur2.webp" alt="extérieur2">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'extérieur2_projet' : 'extérieur2';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: -10, yaw: -55, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'salleréunion2_projet' : 'salleréunion2';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: -10, yaw: -2, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/cuisine.webp" alt="Cuisine">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'cuisine_projet' : 'cuisine';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: 15, yaw: -2, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/billard.webp" alt="billard">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'billard_projet' : 'billard';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: -10, yaw: 50, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréception.webp" alt="salleréception">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'salleréception_projet' : 'salleréception';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: 10, yaw: 50, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/grandesalle.webp" alt="grandesalle">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'grandesalle_projet' : 'grandesalle';
                viewer.loadScene(targetScene); 
              }
            }
          ]
        },
        extérieur2 : {
          panorama: "photo/visite360/prieuré/edl/360/extérieur2.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: -3, yaw: -37, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion.webp" alt="salleréunion">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'salleréunion_projet' : 'salleréunion';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: 10, yaw: -37, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/mezzanine.webp" alt="mezzanine">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'mezzanine_projet' : 'mezzanine';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: -5, yaw: -5, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'salleréunion2_projet' : 'salleréunion2';
                viewer.loadScene(targetScene); 
              }
            },
            {
              pitch: -5, yaw: 20, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ 
                const targetScene = currentMode === 'projet' ? 'extérieur_projet' : 'extérieur';
                viewer.loadScene(targetScene); 
              }
            }
          ]
        },
        salleréunion : {
          panorama: "photo/visite360/prieuré/edl/360/salleréunion.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -105, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur3.webp" alt="extérieur3">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur3'); }
            },
            {
              pitch: 0, yaw: -50, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/wc.webp" alt="wc">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('wc'); }
            },
            {
              pitch: 0, yaw: -35, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréception.webp" alt="salleréception">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréception'); }
            },
            {
              pitch: 0, yaw: -25, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/cuisine.webp" alt="cuisine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('cuisine'); }
            },
            {
              pitch: 0, yaw: 0, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            },
            {
              pitch: 0, yaw: 10, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur'); }
            },
            {
              pitch: 0, yaw: 45, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur2.webp" alt="extérieur2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur2'); }
            }
          ]
        },
        salleréunion2: {
          panorama: "photo/visite360/prieuré/edl/360/salleréunion2.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 32, yaw: 0, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/mezzanine.webp" alt="mezzanine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('mezzanine'); }
            },
            {
              pitch: 0, yaw: -10, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion.webp" alt="salleréunion">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion'); }
            },
            {
              pitch: 0, yaw: 20, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/wc.webp" alt="wc">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('wc'); }
            },
            {
              pitch: 0, yaw: 30, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréception.webp" alt="salleréception">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréception'); }
            },
            {
              pitch: 0, yaw: 40, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/cuisine.webp" alt="cuisine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('cuisine'); }
            },
            {
              pitch: 20, yaw: 75, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/billard.webp" alt="billard">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('billard'); }
            },
            {
              pitch: 0, yaw: 170, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur'); }
            },
            {
              pitch: 0, yaw: 250, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur2.webp" alt="extérieur2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur2'); }
            }
          ]
        },
        cuisine : {
          panorama: "photo/visite360/prieuré/edl/360/cuisine.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -80, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            },
            {
              pitch: 0, yaw: -50, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion.webp" alt="salleréunion">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion'); }
            },
            {
              pitch: 0, yaw: -10, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/wc.webp" alt="wc">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('wc'); }
            },
            {
              pitch: 0, yaw: 70, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréception.webp" alt="salleréception">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréception'); }
            },
            {
              pitch: 0, yaw: 180, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur'); }
            }
          ]
        },
        wc : {
          panorama: "photo/visite360/prieuré/edl/360/wc.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -250, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréception.webp" alt="salleréception">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréception'); }
            },
            {
              pitch: 0, yaw: -210, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/cuisine.webp" alt="cuisine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('cuisine'); }
            },
            {
              pitch: 0, yaw: -120, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            }
          ]
        },
        salleréception: {
          panorama: "photo/visite360/prieuré/edl/360/sallereception.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -100, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur'); }
            },
            {
              pitch: 0, yaw: -15, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/cuisine.webp" alt="cuisine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('cuisine'); }
            },
            {
              pitch: 0, yaw: 3, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            },
            {
              pitch: 0, yaw: 15, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/wc.webp" alt="wc">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('wc'); }
            },
            {
              pitch: 10, yaw: 145, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur3.webp" alt="extérieur3">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur3'); }
            }
          ]
        },
        

        // R+1
        billard : {
          panorama: "photo/visite360/prieuré/edl/360/billard.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: 215, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur.webp" alt="extérieur">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur'); }
            },
            {
              pitch: -20, yaw: 233, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            },
            {
              pitch: 0, yaw: 300, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/petitesalle.webp" alt="petitesalle">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('petitesalle'); }
            },
            {
              pitch: 0, yaw: 330, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/toilette.webp" alt="toilette">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('toilette'); }
            },
            {
              pitch: 0, yaw: 380, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/grandesalle.webp" alt="grandesalle">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('grandesalle'); }
            }
          ]
        },
        grandesalle : {
          panorama: "photo/visite360/prieuré/edl/360/grandesalle.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: 0, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/billard.webp" alt="billard">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('billard'); }
            },
            {
              pitch: 0, yaw: 85, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/toilette.webp" alt="toilette">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('toilette'); }
            },
            {
              pitch: 0, yaw: 200, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/extérieur3.webp" alt="extérieur3">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('extérieur3'); }
            }
          ]
        },
        petitesalle : {
          panorama: "photo/visite360/prieuré/edl/360/petitesalle.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -170, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/toilette.webp" alt="toilette">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('toilette'); }
            },
            {
              pitch: 0, yaw: -130, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/grandesalle.webp" alt="grandesalle">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('grandesalle'); }
            },
            {
              pitch: 0, yaw: -60, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/billard.webp" alt="billard">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('billard'); }
            },
          ]
        },
        toilette : {
          panorama: "photo/visite360/prieuré/edl/360/toilette.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -145, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/grandesalle.webp" alt="grandesalle">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('grandesalle'); }
            },
            {
              pitch: 0, yaw: -105, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/billard.webp" alt="billard">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('billard'); }
            },
            {
              pitch: 0, yaw: -50, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/petitesalle.webp" alt="petitesalle">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('petitesalle'); }
            },
            {
              pitch: 0, yaw: 30, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/mezzanine.webp" alt="mezzanine">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('mezzanine'); }
            }
          ]
        },
        mezzanine : {
          panorama: "photo/visite360/prieuré/edl/360/mezzanine.webp",
          type: "equirectangular",
          fadeInDuration: 800,
          fadeOutDuration: 800,
          hotSpots: [
            {
              pitch: 0, yaw: -53, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/toilette.webp" alt="toilette">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('toilette'); }
            },
            {
              pitch: -10, yaw: 30, type: "info", text: "",
              createTooltipFunc: function(div){
                div.classList.add('mini-thumb');
                div.innerHTML = `<img src="photo/visite360/prieuré/edl/preview/salleréunion2.webp" alt="salleréunion2">`;
              },
              clickHandlerFunc: function(){ viewer.loadScene('salleréunion2'); }
            }
          ]
        }
      }
    });
    }

    // Toggle Gyroscope
    async function toggleGyro() {
      const btn = document.getElementById('gyro-btn');
      if (!gyroActive) {
        // iOS 13+ nécessite une permission explicite
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          try {
            const perm = await DeviceOrientationEvent.requestPermission();
            if (perm !== 'granted') return;
          } catch(e) { return; }
        }
        gyroActive = true;
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        if (viewer) viewer.setUpdate(true);
        // Activer l'orientation dans pannellum
        if (viewer) {
          try { viewer.startOrientation(); } catch(e) {}
        }
      } else {
        gyroActive = false;
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        if (viewer) {
          try { viewer.stopOrientation(); } catch(e) {}
        }
      }
    }

    // Début visite depuis le plan plein écran avec vérification
    function startVisit(scene) {
      // On N'INIT PAS pannellum ici — loadScene() le fera avec la bonne scene en first

      const plan = document.getElementById('plan-fullscreen');
      plan.classList.add('fade-out');
      setTimeout(() => {
        plan.style.display = 'none';
        document.getElementById('panorama').style.display = 'block';
        
        // Afficher le bon plan mini selon le mode
        const planMiniId = currentMode === 'projet' ? 'plan-mini-projet' : 'plan-mini';
        document.getElementById('plan-mini').style.display = 'none';
        document.getElementById('plan-mini-projet').style.display = 'none';
        document.getElementById(planMiniId).style.display = 'block';
        
        // Masquer la barre de navigation et afficher les boutons flottants
        hideNavigation();
        showFloatingControls();
        
        if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
          document.getElementById('gyro-btn').style.display = 'flex';
        }
        
        // Charger la scène avec la bonne phase
        loadScene(scene);
      }, 800);
    }

    // Changement de scène depuis le plan mini avec vérification
    function loadScene(sceneName) {
      const sceneKey = currentMode === 'projet' ? sceneName + '_projet' : sceneName;
      const wasNull = !viewer;

      // Premiere init : on fait demarrer pannellum directement sur la bonne scene
      if (!viewer) {
        initPanellum(sceneKey);
      }

      // Verifie que la scene demandee existe, sinon fallback sur le nom de base
      const scenes = viewer.getConfig().scenes || {};
      let finalKey = sceneKey;
      if (!scenes[finalKey]) {
        if (scenes[sceneName]) {
          console.warn(`Scène ${sceneKey} non trouvée, utilisation de ${sceneName}`);
          finalKey = sceneName;
        } else {
          console.error(`Aucune scène trouvée pour ${sceneName}`);
          return;
        }
      }

      // Si le viewer existait deja OU s'il vient d'etre cree mais la scene differe du firstScene,
      // on force le chargement
      if (!wasNull || viewer.getScene() !== finalKey) {
        viewer.loadScene(finalKey);
      }

      preloadNearbyScenes(finalKey);
    }

    // Cache des images deja preloadees pour eviter les doublons
    const preloadedImages = new Set();
    let preloadQueue = [];
    let isPreloading = false;

    // Precharge une URL d'image en arriere-plan (basse priorite)
    function preloadImage(url) {
      if (preloadedImages.has(url)) return;
      preloadedImages.add(url);
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'lazy';
      img.src = url;
    }

    // Traite la queue de preload une par une (evite de saturer la bande passante)
    function processPreloadQueue() {
      if (isPreloading || preloadQueue.length === 0) return;
      isPreloading = true;
      const url = preloadQueue.shift();
      if (preloadedImages.has(url)) {
        isPreloading = false;
        processPreloadQueue();
        return;
      }
      preloadedImages.add(url);
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = function() {
        isPreloading = false;
        // Petit delai pour ne pas saturer
        setTimeout(processPreloadQueue, 100);
      };
      img.src = url;
    }

    function queuePreload(url) {
      if (!preloadedImages.has(url) && !preloadQueue.includes(url)) {
        preloadQueue.push(url);
      }
      processPreloadQueue();
    }

    // Precharge les scenes accessibles depuis la scene actuelle (via hotspots)
    function preloadNearbyScenes(currentSceneKey) {
      if (!viewer) return;
      const scenes = viewer.getConfig().scenes;
      const current = scenes[currentSceneKey];
      if (!current || !current.hotSpots) return;

      // Precharge d'abord les scenes voisines (priorite haute)
      current.hotSpots.forEach(hs => {
        if (hs.sceneId && scenes[hs.sceneId] && scenes[hs.sceneId].panorama) {
          queuePreload(scenes[hs.sceneId].panorama);
        }
      });

      // Puis precharge progressivement toutes les autres scenes (priorite basse)
      setTimeout(() => {
        Object.keys(scenes).forEach(k => {
          if (scenes[k] && scenes[k].panorama) {
            queuePreload(scenes[k].panorama);
          }
        });
      }, 2000);
    }

    // Retour au plan plein écran
    function returnToFullPlan() {
      document.getElementById('panorama').style.display = 'none';
      document.getElementById('plan-mini').style.display = 'none';
      document.getElementById('plan-mini-projet').style.display = 'none';
      document.getElementById('gyro-btn').style.display = 'none';
      
      // Masquer les boutons flottants et réafficher la barre normale
      hideFloatingControls();
      showNavigation();
      
      // Attendre que la barre soit visible avant d'afficher le plan
      setTimeout(() => {
        showPlan();
      }, 600);
    }



    // Afficher le plan plein écran
    function showPlan() {
      // Masquer toutes les autres sections
      document.getElementById('video-section').style.display = 'none';
      document.getElementById('panorama').style.display = 'none';
      document.getElementById('plan-mini').style.display = 'none';
      document.getElementById('plan-mini-projet').style.display = 'none';
      document.getElementById('samplesroom-section').style.display = 'none';
      
      // Afficher le plan
      const plan = document.getElementById('plan-fullscreen');
      plan.style.display = 'flex';
      plan.classList.remove('fade-out');
      
      updateInterface();
    }

    // Afficher la vidéo
    function showVideo() {
      // Masquer toutes les autres sections
      document.getElementById('plan-fullscreen').style.display = 'none';
      document.getElementById('panorama').style.display = 'none';
      document.getElementById('plan-mini').style.display = 'none';
      document.getElementById('samplesroom-section').style.display = 'none';
      
      // Masquer la barre de navigation avec animation
      hideNavigation();
      
      const videoSection = document.getElementById('video-section');
      const video = videoSection.querySelector('video');
      const source = video.querySelector('source');
      
      // Mettre à jour le chemin de la vidéo selon le mode actuel
      source.src = CONFIG[currentMode].video;
      video.load(); // Recharger la vidéo avec le nouveau chemin
      
      video.currentTime = 0;
      videoSection.style.display = 'flex';
      video.play();
    }

    // Fermer la vidéo
    function closeVideo() {
      const videoSection = document.getElementById('video-section');
      const video = videoSection.querySelector('video');
      video.pause();
      videoSection.style.display = 'none';
      
      // Réafficher la barre de navigation avec animation
      showNavigation();
      
      // Attendre que la barre soit visible avant d'afficher le plan
      setTimeout(() => {
        showPlan();
      }, 600); // Augmenté pour laisser plus de temps à l'animation
    }

    // Afficher samplesroom comme image normale
    function showSamplesroom() {
      document.getElementById('panorama').style.display = 'none';
      document.getElementById('plan-mini').style.display = 'block';
      document.getElementById('samplesroom-section').style.display = 'flex';
      
      // S'assurer que le plan mini affiche le bon étage
      currentFloor = 'rdj';
      updateInterface();
    }

    // Début visite samplesroom depuis le plan plein écran
    function startSamplesroomVisit() {
      const plan = document.getElementById('plan-fullscreen');
      plan.classList.add('fade-out');
      setTimeout(() => {
        plan.style.display = 'none';
        showSamplesroom();
      }, 800);
    }

    // Navigation depuis samplesroom vers yoga avec vérification
    function goToYoga() {
      if (!viewer) {
        initPanellum();
      }
      document.getElementById('samplesroom-section').style.display = 'none';
      document.getElementById('panorama').style.display = 'block';
      
      // Afficher les boutons flottants
      showFloatingControls();
      
      const targetScene = currentMode === 'projet' ? 'yoga_projet' : 'yoga';
      
      if (viewer.getConfig().scenes[targetScene]) {
        viewer.loadScene(targetScene);
      } else {
        console.warn(`Scène non trouvée: ${targetScene}, chargement de yoga`);
        viewer.loadScene('yoga');
      }
    }

    // Navigation depuis samplesroom vers extérieur3 avec vérification
    function goToExterieur3() {
      if (!viewer) {
        initPanellum();
      }
      document.getElementById('samplesroom-section').style.display = 'none';
      document.getElementById('panorama').style.display = 'block';
      
      // Afficher les boutons flottants
      showFloatingControls();
      
      const targetScene = currentMode === 'projet' ? 'extérieur3_projet' : 'extérieur3';
      
      if (viewer.getConfig().scenes[targetScene]) {
        viewer.loadScene(targetScene);
      } else {
        console.warn(`Scène non trouvée: ${targetScene}, chargement d'extérieur3`);
        viewer.loadScene('extérieur3');
      }
    }

    // Fermer samplesroom
    function closeSamplesroom() {
      document.getElementById('samplesroom-section').style.display = 'none';
      document.getElementById('plan-mini').style.display = 'none';
      showPlan();
    }

    // Initialisation au chargement de la page
    document.addEventListener('DOMContentLoaded', function() {
      // Initialiser l'interface
      updateInterface();
      updateSamplesroomImages();
      
      // Afficher le bouton gyro sur mobile
      if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        document.getElementById('gyro-btn').style.display = 'flex';
      }
      
      // Gestion des erreurs globales
      window.addEventListener('error', function(e) {
        console.error('Erreur détectée:', e.error);
      });
      
      // Gestion du clavier pour l'accessibilité
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          // Fermer les modales ouvertes
          if (document.getElementById('video-section').style.display === 'flex') {
            closeVideo();
          }
          if (document.getElementById('samplesroom-section').style.display === 'flex') {
            closeSamplesroom();
          }
        }
      });
      
      // Test de connectivité des images critiques
      const criticalImages = [
        'photo/visite360/prieuré/edl/plans/planRDC.webp',
        'photo/logo/Noir long.webp'
      ];
      
      criticalImages.forEach(imagePath => {
        const img = new Image();
        img.onerror = () => {
          console.warn(`Image critique non trouvée: ${imagePath}`);
        };
        img.src = imagePath;
      });
    });
    
    // Fonction utilitaire pour déboguer
    function debugInfo() {
      console.log('=== DEBUG INFO ===');
      console.log('Current Mode:', currentMode);
      console.log('Current Floor:', currentFloor);
      console.log('Viewer initialized:', !!viewer);
      if (viewer) {
        console.log('Current Scene:', viewer.getScene());
        console.log('Available Scenes:', Object.keys(viewer.getConfig().scenes));
      }
      console.log('==================');
    }
    
    // Exposer la fonction de debug globalement (pour les tests)
    window.debugInfo = debugInfo;
