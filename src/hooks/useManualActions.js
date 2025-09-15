import { useState, useCallback } from 'react';
import { ACTION_CONFIG } from '../data/gameData';

export const useManualActions = (resources, setResources, unlockedActions, setUnlockedActions) => {
  const [actionProgress, setActionProgress] = useState({});
  const [activeLoopAction, setActiveLoopAction] = useState(null); // Action en boucle active
  const [loopInterval, setLoopInterval] = useState(null); // Un seul intervalle à la fois

  const canPerformAction = useCallback((actionType) => {
    if (actionProgress[actionType] !== undefined) return false;
    
    const config = ACTION_CONFIG[actionType];
    if (!config) return false;

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
  }, [resources, actionProgress]);

  const performManualAction = useCallback((actionType) => {
    if (actionProgress[actionType]) return;
    
    const config = ACTION_CONFIG[actionType];
    if (!config) return;

    let canStart = true;
    const requiredResources = {};

    switch(actionType) {
      case 'smelt_iron':
        if (resources.iron_ore < 1) canStart = false;
        else requiredResources.iron_ore = 1;
        break;
      case 'smelt_copper':
        if (resources.copper_ore < 1) canStart = false;
        else requiredResources.copper_ore = 1;
        break;
      case 'craft_iron_plate':
        if (resources.iron_ingot < 1) canStart = false;
        else requiredResources.iron_ingot = 1;
        break;
      case 'craft_iron_rod':
        if (resources.iron_ingot < 1) canStart = false;
        else requiredResources.iron_ingot = 1;
        break;
      case 'craft_wire':
        if (resources.copper_ingot < 1) canStart = false;
        else requiredResources.copper_ingot = 1;
        break;
      case 'craft_cable':
        if (resources.wire < 2) canStart = false;
        else requiredResources.wire = 2;
        break;
      case 'craft_concrete':
        if (resources.limestone < 3) canStart = false;
        else requiredResources.limestone = 3;
        break;
      case 'craft_screws':
        if (resources.iron_rod < 1) canStart = false;
        else requiredResources.iron_rod = 1;
        break;
      default:
        break;
    }

    if (!canStart) {
      // Si on ne peut pas démarrer et qu'on était en boucle, arrêter la boucle
      if (activeLoopAction === actionType) {
        stopActionLoop();
      }
      return;
    }

    // Consommer les ressources IMMÉDIATEMENT
    if (Object.keys(requiredResources).length > 0) {
      setResources(prev => {
        const newResources = { ...prev };
        Object.entries(requiredResources).forEach(([resource, amount]) => {
          newResources[resource] -= amount;
        });
        return newResources;
      });
    }
    
    // Démarrer la progression
    setActionProgress(prev => ({ ...prev, [actionType]: 0 }));

    const startTime = Date.now();
    const duration = config.time;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      setActionProgress(prev => ({ ...prev, [actionType]: progress }));

      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Action terminée - donner les récompenses
        setResources(prev => {
          const newResources = { ...prev };
          
          switch(actionType) {
            case 'mine_iron':
              newResources.iron_ore += 1;
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
              break;
            case 'smelt_copper':
              newResources.copper_ingot += 1;
              break;
            case 'craft_iron_plate':
              newResources.iron_plate += 1;
              break;
            case 'craft_iron_rod':
              newResources.iron_rod += 1;
              break;
            case 'craft_wire':
              newResources.wire += 2;
              break;
            case 'craft_cable':
              newResources.cable += 1;
              break;
            case 'craft_concrete':
              newResources.concrete += 1;
              break;
            case 'craft_screws':
              newResources.screws += 4;
              break;
            case 'research':
              newResources.research_points += 5;
              break;
            default:
              break;
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
  }, [resources, actionProgress, activeLoopAction, setResources]);

  // 🆕 NOUVELLE LOGIQUE - Démarrer/arrêter la boucle au clic
  const toggleActionLoop = useCallback((actionType) => {
    // Si on clique sur l'action déjà active, l'arrêter
    if (activeLoopAction === actionType) {
      stopActionLoop();
      return;
    }

    // Sinon, arrêter l'ancienne boucle et démarrer la nouvelle
    stopActionLoop();
    
    setActiveLoopAction(actionType);
    
    // Démarrer immédiatement la première action
    performManualAction(actionType);
    
    // Démarrer la boucle
    const newInterval = setInterval(() => {
      if (canPerformAction(actionType)) {
        performManualAction(actionType);
      } else {
        // Plus de ressources, arrêter automatiquement
        stopActionLoop();
      }
    }, ACTION_CONFIG[actionType]?.time + 200 || 2200); // +200ms de délai
    
    setLoopInterval(newInterval);
  }, [activeLoopAction, performManualAction, canPerformAction]);

  const stopActionLoop = useCallback(() => {
    if (loopInterval) {
      clearInterval(loopInterval);
      setLoopInterval(null);
    }
    setActiveLoopAction(null);
  }, [loopInterval]);

  return {
    actionProgress,
    activeLoopAction,
    performManualAction,
    toggleActionLoop,
    stopActionLoop,
    canPerformAction
  };
};
