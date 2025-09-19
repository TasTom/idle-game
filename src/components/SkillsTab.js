import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ACTION_CATEGORIES, 
  MINING_ACTIONS, 
  SMITHING_ACTIONS, 
  MAGIC_ACTIONS, 
  COMBAT_ACTIONS, 
  GATHERING_ACTIONS 
} from '../data/gameData';
import '../styles/components/skills-tab.css';

const SkillsTab = ({ character, resources, performAction, isRunning }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [actionProgress, setActionProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState('mining');
  
  // Une seule ref pour contrôler tout
  const actionControlRef = useRef({
    isActive: false,
    currentAction: null,
    progressInterval: null,
    actionTimeout: null
  });

  // Fonction pour nettoyer TOUS les timers
  const cleanupTimers = useCallback(() => {
    const control = actionControlRef.current;
    
    if (control.progressInterval) {
      clearInterval(control.progressInterval);
      control.progressInterval = null;
    }
    
    if (control.actionTimeout) {
      clearTimeout(control.actionTimeout);
      control.actionTimeout = null;
    }
    
    control.isActive = false;
    control.currentAction = null;
  }, []);

  // Fonction pour arrêter l'action actuelle
  const stopAction = useCallback(() => {
    console.log('🛑 Stopping action');
    
    cleanupTimers();
    setActiveAction(null);
    setActionProgress(0);
  }, [cleanupTimers]);

  // Effet pour gérer l'arrêt quand le jeu est pausé
  useEffect(() => {
    if (!isRunning && activeAction) {
      stopAction();
    }
  }, [isRunning, activeAction, stopAction]);

  // Fonction pour démarrer une action
  const startAction = useCallback(async (actionKey) => {
    const categoryActions = getCurrentActions();
    const action = categoryActions[actionKey];
    if (!action) return;

    console.log(`🎯 Starting action: ${actionKey}`);

    // Si c'est la même action, arrêter
    if (activeAction === actionKey) {
      stopAction();
      return;
    }

    // Arrêter l'action précédente IMMÉDIATEMENT
    if (activeAction) {
      stopAction();
    }

    // Initialiser la nouvelle action
    setActiveAction(actionKey);
    setActionProgress(0);
    
    const control = actionControlRef.current;
    control.isActive = true;
    control.currentAction = actionKey;

    // Fonction pour effectuer l'action en boucle
    const performActionLoop = () => {
      if (!control.isActive || control.currentAction !== actionKey || !isRunning) {
        return;
      }

      // Reset progression
      setActionProgress(0);
      
      const startTime = Date.now();
      
      // Animation de progression
      control.progressInterval = setInterval(() => {
        if (!control.isActive || control.currentAction !== actionKey) {
          clearInterval(control.progressInterval);
          control.progressInterval = null;
          return;
        }
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / action.time) * 100, 100);
        setActionProgress(progress);
      }, 50);

      // Timer pour la completion de l'action
      control.actionTimeout = setTimeout(async () => {
        // Nettoyer l'interval de progression
        if (control.progressInterval) {
          clearInterval(control.progressInterval);
          control.progressInterval = null;
        }

        // Vérifier qu'on est toujours actif
        if (!control.isActive || control.currentAction !== actionKey) {
          return;
        }

        // Mettre à 100%
        setActionProgress(100);
        
        try {
          console.log(`💰 Performing action: ${action.name}`);
          await performAction(actionKey);
        } catch (error) {
          console.error('❌ Error performing action:', error);
          stopAction();
          return;
        }

        // ✅ IMMÉDIATEMENT recommencer
        if (control.isActive && control.currentAction === actionKey && isRunning) {
          performActionLoop();
        }
      }, action.time);
    };

    // Démarrer la première itération
    performActionLoop();

  }, [activeAction, isRunning, performAction, stopAction, activeCategory]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      cleanupTimers();
    };
  }, [cleanupTimers]);

  // Obtenir les actions de la catégorie active
  const getCurrentActions = () => {
    const actionMap = {
      mining: MINING_ACTIONS,
      smithing: SMITHING_ACTIONS,
      magic: MAGIC_ACTIONS,
      combat: COMBAT_ACTIONS,
      gathering: GATHERING_ACTIONS
    };
    return actionMap[activeCategory] || MINING_ACTIONS;
  };

  // Vérifier si une action peut être effectuée
  const canAfford = (actionKey) => {
    const action = getCurrentActions()[actionKey];
    if (!action.cost) return true;
    
    return Object.entries(action.cost).every(([resource, amount]) => 
      resources[resource] >= amount
    );
  };

  // Vérifier les prérequis de niveau
  const meetsRequirements = (actionKey) => {
    const action = getCurrentActions()[actionKey];
    if (!action.unlock_req) return true;
    
    return Object.entries(action.unlock_req).every(([skill, level]) => 
      character[skill].level >= level
    );
  };

  const currentActions = getCurrentActions();
  const currentCategory = ACTION_CATEGORIES[activeCategory];

  return (
    <div className="skills-tab">
      <div className="skills-header">
        <h2>⚒️ Skills & Actions</h2>
        <p>Choose a skill category and start your actions!</p>
        
        {!isRunning && (
          <div className="warning-message">
            ⚠️ Game is paused! Click the ▶️ Play button to start actions.
          </div>
        )}
        
        {activeAction && (
          <div className="active-action-info">
            <div className="active-info">
              <span>🔄 Currently performing: <strong>{currentActions[activeAction]?.name}</strong></span>
              <div className="action-status">
                Progress: {Math.floor(actionProgress)}%
                {actionProgress < 100 ? ' - Working...' : ' - Completing...'}
              </div>
            </div>
            <button onClick={stopAction} className="stop-button">
              ⏹️ Stop
            </button>
          </div>
        )}
      </div>

      {/* Navigation des catégories */}
        <div className="category-navigation">
        {Object.entries(ACTION_CATEGORIES).map(([categoryKey, category]) => (
            <button
            key={categoryKey}
            className={`category-button ${activeCategory === categoryKey ? 'active' : ''}`}
            onClick={() => setActiveCategory(categoryKey)}
            data-category={categoryKey}  // ← Important pour les couleurs !
            >
            {category.name}
            </button>
        ))}
        </div>



      {/* Description de la catégorie */}
      <div className="category-description">
        <h3 style={{ color: currentCategory.color }}>
          {currentCategory.name}
        </h3>
        <p>{currentCategory.description}</p>
      </div>

      {/* Actions de la catégorie */}
      <div className="actions-grid">
        {Object.entries(currentActions).map(([actionKey, action]) => {
          const isActive = activeAction === actionKey;
          const canUse = canAfford(actionKey) && meetsRequirements(actionKey);

          return (
            <div 
              key={actionKey}
              className={`action-card ${isActive ? 'active' : ''} ${!canUse ? 'disabled' : ''} ${!isRunning ? 'game-paused' : ''}`}
              onClick={() => isRunning && canUse && startAction(actionKey)}
            >
              <div className="action-header">
                <div className="action-name">{action.name}</div>
                <div className="action-time">{(action.time / 1000).toFixed(1)}s</div>
              </div>

              <div className="action-rewards">
                {action.rewards && Object.entries(action.rewards).map(([resource, amount]) => (
                  <div key={resource} className="reward-item">
                    +{amount} {resource.replace('_', ' ')}
                  </div>
                ))}
              </div>

              <div className="action-xp">
                {action.xp && Object.entries(action.xp).map(([skill, xp]) => (
                  <div key={skill} className="xp-item">
                    +{xp} {skill} XP
                  </div>
                ))}
              </div>

              {action.cost && (
                <div className="action-cost">
                  {Object.entries(action.cost).map(([resource, amount]) => (
                    <div key={resource} className={`cost-item ${resources[resource] >= amount ? 'affordable' : 'expensive'}`}>
                      -{amount} {resource.replace('_', ' ')}
                    </div>
                  ))}
                </div>
              )}

              {!meetsRequirements(actionKey) && action.unlock_req && (
                <div className="requirements">
                  🔒 Requires: {Object.entries(action.unlock_req).map(([skill, level]) => 
                    `${skill} ${level}`
                  ).join(', ')}
                </div>
              )}

              {/* Barre de progression */}
              {isActive && (
                <div className="action-progress">
                  <div 
                    className="progress-fill"
                    style={{ width: `${actionProgress}%` }}
                  />
                  <span className="progress-text">{Math.floor(actionProgress)}%</span>
                </div>
              )}

              {/* Indicateur d'activité */}
              {isActive && (
                <div className="active-indicator">
                  {actionProgress < 100 ? '🔄 Working' : '⚡ Reset'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsTab;
