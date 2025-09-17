import React from 'react';
import { ACTION_CONFIG } from '../data/gameData';

const ManualActionsTab = ({ 
  resources, 
  unlockedActions, 
  actionProgress, 
  activeLoopAction,
  toggleActionLoop,
  canPerformAction,
  skillType = 'all' // ✅ NOUVEAU : pour filtrer par compétence
}) => {
  
  // ✅ STYLE MELVOR : Rendu en cartes
  const renderMelvorAction = (actionKey, actionData, categoryClass) => {
    const config = ACTION_CONFIG[actionKey];
    const isUnlocked = unlockedActions.includes(actionKey);
    const inProgress = actionProgress[actionKey] !== undefined;
    const progress = actionProgress[actionKey] || 0;
    const isLooping = activeLoopAction === actionKey;
    const hasResources = canPerformAction ? canPerformAction(actionKey) : actionData.canAfford;

    if (!isUnlocked) {
      return (
        <div key={actionKey} className="action-card disabled">
          <div className="action-icon">🔒</div>
          <div className="action-name">{actionData.name}</div>
          <div className="action-description">
            {actionData.lockMessage || 'Non débloqué'}
          </div>
        </div>
      );
    }

    return (
      <div 
        key={actionKey}
        onClick={() => toggleActionLoop(actionKey)}
        className={`action-card ${categoryClass} 
          ${inProgress ? 'in-progress' : ''} 
          ${!hasResources && !isLooping ? 'no-resources' : ''} 
          ${isLooping ? 'active' : ''}
          ${!hasResources && !inProgress && !isLooping ? 'disabled-look' : ''}`}
      >
        <div className="action-icon">{actionData.icon}</div>
        <div className="action-name">{actionData.name}</div>
        <div className="action-description">
          {actionData.reward || actionData.recipe}
          {isLooping && ' 🔄'}
          {!hasResources && !inProgress && !isLooping && ' ❌'}
        </div>
        
        {/* Status indicators */}
        {isLooping && (
          <div className="action-status looping">
            <span className="status-text">EN BOUCLE</span>
          </div>
        )}
        
        {!hasResources && !inProgress && !isLooping && (
          <div className="action-status no-resources">
            <span className="status-text">RESSOURCES INSUFFISANTES</span>
          </div>
        )}

        {inProgress && (
          <div className="action-progress">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
            <span className="progress-text">{Math.floor(progress)}%</span>
          </div>
        )}
      </div>
    );
  };

  // ✅ FILTRAGE PAR COMPÉTENCE
  const getActionsForSkill = (skill) => {
    switch(skill) {
      case 'mining':
        return ['mine_iron', 'mine_copper', 'mine_coal', 'mine_limestone', 'collect_water'];
      case 'smithing':
        return ['smelt_iron', 'smelt_copper'];
      case 'crafting':
        return ['craft_iron_plate', 'craft_iron_rod', 'craft_screws', 'craft_wire', 'craft_cable', 'craft_concrete'];
      case 'research':
        return ['research'];
      default:
        return ['mine_iron', 'mine_copper', 'mine_coal', 'mine_limestone', 'collect_water', 'smelt_iron', 'smelt_copper', 'craft_iron_plate', 'craft_iron_rod', 'craft_screws', 'craft_wire', 'craft_cable', 'craft_concrete', 'research'];
    }
  };

  // ✅ DONNÉES D'ACTIONS CENTRALISÉES
  const getActionData = (actionKey) => {
    const actionDataMap = {
      // Mining
      mine_iron: { icon: '⛏️', name: 'Mine Iron', reward: '+1 Iron Ore', canAfford: true, category: 'mining' },
      mine_copper: { icon: '🟫', name: 'Mine Copper', reward: '+1 Copper Ore', canAfford: true, category: 'mining' },
      mine_coal: { icon: '⚫', name: 'Mine Coal', reward: '+1 Coal', canAfford: true, category: 'mining' },
      mine_limestone: { icon: '⚪', name: 'Mine Limestone', reward: '+1 Limestone', canAfford: true, category: 'mining' },
      collect_water: { icon: '💧', name: 'Collect Water', reward: '+1 Water', canAfford: true, category: 'mining' },
      
      // Smithing
      smelt_iron: { 
        icon: '🔥', 
        name: 'Smelt Iron', 
        recipe: '1 Iron Ore → 1 Iron Ingot',
        canAfford: resources.iron_ore >= 1,
        category: 'smithing'
      },
      smelt_copper: { 
        icon: '🟤', 
        name: 'Smelt Copper', 
        recipe: '1 Copper Ore → 1 Copper Ingot',
        canAfford: resources.copper_ore >= 1,
        category: 'smithing'
      },
      
      // Crafting
      craft_iron_plate: { 
        icon: '🔳', 
        name: 'Iron Plate', 
        recipe: '1 Iron Ingot → 1 Iron Plate',
        canAfford: resources.iron_ingot >= 1,
        category: 'crafting'
      },
      craft_iron_rod: { 
        icon: '📏', 
        name: 'Iron Rod', 
        recipe: '1 Iron Ingot → 1 Iron Rod',
        canAfford: resources.iron_ingot >= 1,
        category: 'crafting'
      },
      craft_screws: { 
        icon: '🔩', 
        name: 'Screws', 
        recipe: '1 Iron Rod → 4 Screws',
        canAfford: resources.iron_rod >= 1,
        category: 'crafting'
      },
      craft_wire: { 
        icon: '🔌', 
        name: 'Wire', 
        recipe: '1 Copper Ingot → 2 Wire',
        canAfford: resources.copper_ingot >= 1,
        lockMessage: 'Unlock with "Basic Production" research',
        category: 'crafting'
      },
      craft_cable: { 
        icon: '🔗', 
        name: 'Cable', 
        recipe: '2 Wire → 1 Cable',
        canAfford: resources.wire >= 2,
        lockMessage: 'Unlock with "Basic Production" research',
        category: 'crafting'
      },
      craft_concrete: { 
        icon: '🧱', 
        name: 'Concrete', 
        recipe: '3 Limestone → 1 Concrete',
        canAfford: resources.limestone >= 3,
        lockMessage: 'Unlock with "Basic Production" research',
        category: 'crafting'
      },
      
      // Research
      research: {
        icon: '📚',
        name: 'Research',
        reward: '+5 Research Points',
        canAfford: true,
        category: 'research'
      }
    };

    return actionDataMap[actionKey] || {};
  };

  // ✅ STYLE MELVOR SINGLE SKILL VIEW
  if (skillType !== 'all') {
    const actionsToShow = getActionsForSkill(skillType);
    
    return (
      <div className="melvor-skill-actions">
        {/* Indicateur global actif */}
        {activeLoopAction && (
          <div className="active-loop-indicator">
            <div className="loop-info">
              <span className="loop-icon">🔄</span>
              <div className="loop-details">
                <div className="loop-action">{getActionData(activeLoopAction).name}</div>
                <div className="loop-status">Currently Active</div>
              </div>
            </div>
            <button 
              onClick={() => toggleActionLoop(activeLoopAction)}
              className="stop-loop-btn"
            >
              ⏹️ Stop
            </button>
          </div>
        )}

        <div className="actions-grid">
          {actionsToShow.map(actionKey => {
            const actionData = getActionData(actionKey);
            return renderMelvorAction(actionKey, actionData, actionData.category);
          })}
        </div>
      </div>
    );
  }

  // ✅ VUE COMPLÈTE (si skillType === 'all')
  return (
    <div className="manual-actions melvor-style">
      <div className="section-header">
        <h2>⛏️ Manual Actions</h2>
        <p>Click on an action to loop it automatically! Click again or on another action to stop.</p>
      </div>
      
      {/* Indicateur global */}
      {activeLoopAction && (
        <div className="active-loop-indicator">
          <div className="loop-info">
            <span className="loop-icon">🔄</span>
            <div className="loop-details">
              <div className="loop-action">{getActionData(activeLoopAction).name}</div>
              <div className="loop-status">Currently Active</div>
            </div>
          </div>
          <button 
            onClick={() => toggleActionLoop(activeLoopAction)}
            className="stop-loop-btn"
          >
            ⏹️ Stop All
          </button>
        </div>
      )}
      
      {/* MINING SECTION */}
      <div className="skill-section">
        <h3 className="skill-title">⛏️ Mining</h3>
        <div className="actions-grid">
          {['mine_iron', 'mine_copper', 'mine_coal', 'mine_limestone', 'collect_water'].map(actionKey => {
            const actionData = getActionData(actionKey);
            return renderMelvorAction(actionKey, actionData, 'mining');
          })}
        </div>
      </div>

      {/* SMITHING SECTION */}
      <div className="skill-section">
        <h3 className="skill-title">🔥 Smithing</h3>
        <div className="actions-grid">
          {['smelt_iron', 'smelt_copper'].map(actionKey => {
            const actionData = getActionData(actionKey);
            return renderMelvorAction(actionKey, actionData, 'smithing');
          })}
        </div>
      </div>

      {/* CRAFTING SECTION */}
      <div className="skill-section">
        <h3 className="skill-title">🔨 Crafting</h3>
        <div className="actions-grid">
          {['craft_iron_plate', 'craft_iron_rod', 'craft_screws', 'craft_wire', 'craft_cable', 'craft_concrete'].map(actionKey => {
            const actionData = getActionData(actionKey);
            return renderMelvorAction(actionKey, actionData, 'crafting');
          })}
        </div>
      </div>

      {/* RESEARCH SECTION */}
      <div className="skill-section">
        <h3 className="skill-title">🔬 Research</h3>
        <div className="actions-grid">
          {renderMelvorAction('research', getActionData('research'), 'research')}
        </div>
      </div>
      
      {/* PROGRESSION HINT */}
      <div className="progression-hint">
        <h3>🎯 Recommended Progression:</h3>
        <div className="progression-steps">
          <div className="step">
            <span className="step-number">1</span>
            <span className="step-text">Mine resources → Iron Ore, Copper Ore, Limestone</span>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <span className="step-text">Smelt ores → Iron Ingot, Copper Ingot</span>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <span className="step-text">Craft components → Iron Plate, Cable, Concrete</span>
          </div>
          <div className="step">
            <span className="step-number">4</span>
            <span className="step-text">Research → Accumulate 50 Research Points</span>
          </div>
          <div className="step">
            <span className="step-number">5</span>
            <span className="step-text">Unlock "Basic Production" → Start automation!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualActionsTab;
