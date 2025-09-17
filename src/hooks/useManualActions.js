import { useState, useCallback, useEffect } from 'react';
import { ACTION_CONFIG } from '../data/gameData';

export const useManualActions = (resources, setResources, unlockedActions, setUnlockedActions) => {
  const [actionProgress, setActionProgress] = useState({});
  const [activeLoopAction, setActiveLoopAction] = useState(null);
  const [loopInterval, setLoopInterval] = useState(null);
  const [currentProgressInterval, setCurrentProgressInterval] = useState(null);

  const stopActionLoop = useCallback(() => {
    if (loopInterval) {
      clearInterval(loopInterval);
      setLoopInterval(null);
    }
    setActiveLoopAction(null);
    console.log("🛑 Boucle d'action arrêtée");
  }, [loopInterval]);

  // ✅ FONCTION pour vérifier les ressources sans tenir compte des actions en cours
  const hasResourcesForAction = useCallback((actionType) => {
    switch(actionType) {
      case 'smelt_iron':
        return resources.iron_ore >= 1;
      case 'smelt_copper':
        return resources.copper_ore >= 1;
      case 'craft_iron_plate':
        return resources.iron_ingot >= 1;
      case 'craft_iron_rod':
        return resources.iron_ingot >= 1;
      case 'craft_wire':
        return resources.copper_ingot >= 1;
      case 'craft_cable':
        return resources.wire >= 2;
      case 'craft_concrete':
        return resources.limestone >= 3;
      case 'craft_screws':
        return resources.iron_rod >= 1;
      default:
        return true;
    }
  }, [resources]);

  const canPerformAction = useCallback((actionType) => {
    if (actionProgress[actionType] !== undefined) return false;
    
    const config = ACTION_CONFIG[actionType];
    if (!config) return false;

    return hasResourcesForAction(actionType);
  }, [actionProgress, hasResourcesForAction]);

  const cancelCurrentAction = useCallback(() => {
    if (currentProgressInterval) {
      clearInterval(currentProgressInterval);
      setCurrentProgressInterval(null);
    }
    setActionProgress({});
    console.log("Action en cours annulée");
  }, [currentProgressInterval]);

  const performManualAction = useCallback((actionType) => {
    console.log(`🚀 performManualAction pour: ${actionType}`);
    
    // Annuler l'action en cours si une nouvelle démarre
    if (Object.keys(actionProgress).length > 0) {
      cancelCurrentAction();
    }

    if (actionProgress[actionType]) {
      console.log(`⚠️ Action ${actionType} déjà en cours`);
      return;
    }
    
    const config = ACTION_CONFIG[actionType];
    if (!config) {
      console.log(`❌ Config introuvable pour ${actionType}`);
      return;
    }

    // ✅ VÉRIFICATION AVANT de démarrer
    if (!hasResourcesForAction(actionType)) {
      console.log(`❌ Pas assez de ressources pour ${actionType} - ARRÊT`);
      if (activeLoopAction === actionType) {
        stopActionLoop();
      }
      return;
    }
    
    console.log(`⏳ Démarrage de ${actionType}`);
    setActionProgress(prev => ({ ...prev, [actionType]: 0 }));

    const startTime = Date.now();
    const duration = config.time;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      setActionProgress(prev => ({ ...prev, [actionType]: progress }));

      if (progress >= 100) {
        clearInterval(progressInterval);
        setCurrentProgressInterval(null);
        
        console.log(`🎯 ${actionType} terminé`);
        
        // ✅ TRAITEMENT ATOMIQUE des ressources
        setResources(prev => {
          const newResources = { ...prev };
          
          // 1. VÉRIFIER ET CONSOMMER
          let canConsume = true;
          switch(actionType) {
            case 'smelt_iron':
              if (newResources.iron_ore >= 1) {
                newResources.iron_ore -= 1;
                console.log(`💰 Consommé 1 Iron Ore (reste: ${newResources.iron_ore})`);
              } else {
                canConsume = false;
                console.log(`❌ Pas assez d'Iron Ore`);
              }
              break;
            case 'smelt_copper':
              if (newResources.copper_ore >= 1) {
                newResources.copper_ore -= 1;
                console.log(`💰 Consommé 1 Copper Ore (reste: ${newResources.copper_ore})`);
              } else {
                canConsume = false;
                console.log(`❌ Pas assez de Copper Ore`);
              }
              break;
            case 'craft_iron_plate':
              if (newResources.iron_ingot >= 1) {
                newResources.iron_ingot -= 1;
                console.log(`💰 Consommé 1 Iron Ingot (reste: ${newResources.iron_ingot})`);
              } else {
                canConsume = false;
              }
              break;
            case 'craft_iron_rod':
              if (newResources.iron_ingot >= 1) {
                newResources.iron_ingot -= 1;
                console.log(`💰 Consommé 1 Iron Ingot pour Rod (reste: ${newResources.iron_ingot})`);
              } else {
                canConsume = false;
              }
              break;
            case 'craft_wire':
              if (newResources.copper_ingot >= 1) {
                newResources.copper_ingot -= 1;
                console.log(`💰 Consommé 1 Copper Ingot (reste: ${newResources.copper_ingot})`);
              } else {
                canConsume = false;
              }
              break;
            case 'craft_cable':
              if (newResources.wire >= 2) {
                newResources.wire -= 2;
                console.log(`💰 Consommé 2 Wire (reste: ${newResources.wire})`);
              } else {
                canConsume = false;
              }
              break;
            case 'craft_concrete':
              if (newResources.limestone >= 3) {
                newResources.limestone -= 3;
                console.log(`💰 Consommé 3 Limestone (reste: ${newResources.limestone})`);
              } else {
                canConsume = false;
              }
              break;
            case 'craft_screws':
              if (newResources.iron_rod >= 1) {
                newResources.iron_rod -= 1;
                console.log(`💰 Consommé 1 Iron Rod (reste: ${newResources.iron_rod})`);
              } else {
                canConsume = false;
              }
              break;
            default:
              break;
          }
          
          // 2. Si consommation OK, DONNER les récompenses
          if (canConsume) {
            switch(actionType) {
              case 'mine_iron':
                newResources.iron_ore += 1;
                console.log(`⛏️ +1 Iron Ore (total: ${newResources.iron_ore})`);
                break;
              case 'mine_copper':
                newResources.copper_ore += 1;
                break;
              case 'mine_coal':
                newResources.coal += 1;
                break;
              case 'mine_limestone':
                newResources.limestone += 1;
                break;
              case 'collect_water':
                newResources.water += 1;
                break;
              case 'smelt_iron':
                newResources.iron_ingot += 1;
                console.log(`🔥 +1 Iron Ingot (total: ${newResources.iron_ingot})`);
                break;
              case 'smelt_copper':
                newResources.copper_ingot += 1;
                console.log(`🔥 +1 Copper Ingot (total: ${newResources.copper_ingot})`);
                break;
              case 'craft_iron_plate':
                newResources.iron_plate += 1;
                console.log(`🔨 +1 Iron Plate (total: ${newResources.iron_plate})`);
                break;
              case 'craft_iron_rod':
                newResources.iron_rod += 1;
                console.log(`🔨 +1 Iron Rod (total: ${newResources.iron_rod})`);
                break;
              case 'craft_wire':
                newResources.wire += 2;
                console.log(`🔨 +2 Wire (total: ${newResources.wire})`);
                break;
              case 'craft_cable':
                newResources.cable += 1;
                console.log(`🔨 +1 Cable (total: ${newResources.cable})`);
                break;
              case 'craft_concrete':
                newResources.concrete += 1;
                console.log(`🔨 +1 Concrete (total: ${newResources.concrete})`);
                break;
              case 'craft_screws':
                newResources.screws += 4;
                console.log(`🔨 +4 Screws (total: ${newResources.screws})`);
                break;
              case 'research':
                newResources.research_points += 5;
                console.log(`📚 +5 Research Points (total: ${newResources.research_points})`);
                break;
              default:
                break;
            }
          } else {
            // ✅ Si la consommation a échoué ET qu'on est en boucle, arrêter
            console.log(`🛑 Consommation échouée pour ${actionType}`);
            
            // ✅ DÉLAI POUR ÉVITER LES CONFLITS D'ÉTAT
            setTimeout(() => {
              if (activeLoopAction === actionType) {
                console.log(`🛑 Arrêt de la boucle ${actionType} suite à l'échec de consommation`);
                stopActionLoop();
              }
            }, 100);
          }
          
          return newResources;
        });

        // Supprimer la progression terminée
        setActionProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[actionType];
          return newProgress;
        });
      }
    }, 50);

    setCurrentProgressInterval(progressInterval);
  }, [actionProgress, hasResourcesForAction, cancelCurrentAction, setResources, activeLoopAction, stopActionLoop]);

  // ✅ EFFET pour surveiller les ressources et arrêter la boucle
  useEffect(() => {
    if (activeLoopAction && !Object.keys(actionProgress).length) {
      // ✅ Il n'y a pas d'action en cours ET on est en boucle
      // Vérifier si on peut encore faire l'action
      if (!hasResourcesForAction(activeLoopAction)) {
        console.log(`🛑 Plus de ressources pour ${activeLoopAction} - ARRÊT PAR EFFET`);
        stopActionLoop();
      }
    }
  }, [resources, activeLoopAction, actionProgress, hasResourcesForAction, stopActionLoop]);

  const toggleActionLoop = useCallback((actionType) => {
    console.log(`🔄 toggleActionLoop pour: ${actionType}`);
    
    // Si on clique sur l'action déjà active, l'arrêter
    if (activeLoopAction === actionType) {
      console.log(`⏹️ Arrêt de la boucle: ${actionType}`);
      stopActionLoop();
      return;
    }

    // Arrêter l'ancienne boucle
    stopActionLoop();
    cancelCurrentAction();
    
    // ✅ Vérifier les ressources avant de démarrer
    if (!hasResourcesForAction(actionType)) {
      console.log(`❌ Impossible de démarrer ${actionType} - pas de ressources`);
      return;
    }
    
    console.log(`✅ Démarrage de la boucle: ${actionType}`);
    setActiveLoopAction(actionType);
    
    // Démarrer immédiatement la première action
    performManualAction(actionType);
    
    // ✅ BOUCLE SIMPLIFIÉE - elle ne fait QUE lancer les actions
     const newInterval = setInterval(() => {
    console.log(`🔄 Nouvelle itération ${actionType}`);
    performManualAction(actionType);
    }, ACTION_CONFIG[actionType]?.time + 50 || 2050); // ✅ Seulement 50ms

    
    setLoopInterval(newInterval);
  }, [activeLoopAction, performManualAction, hasResourcesForAction, cancelCurrentAction, stopActionLoop]);

  return {
    actionProgress,
    activeLoopAction,
    performManualAction,
    toggleActionLoop,
    stopActionLoop,
    canPerformAction,
    cancelCurrentAction
  };
};
