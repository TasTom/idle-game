import React from 'react';
import { ACTION_CONFIG } from '../data/gameData';

const ManualActionsTab = ({ 
  resources, 
  unlockedActions, 
  actionProgress, 
  activeLoopAction,
  toggleActionLoop
}) => {
  
  const renderActionButton = (actionKey, actionData, categoryClass) => {
    const config = ACTION_CONFIG[actionKey];
    const isUnlocked = unlockedActions.includes(actionKey);
    const inProgress = actionProgress[actionKey] !== undefined;
    const progress = actionProgress[actionKey] || 0;
    const isLooping = activeLoopAction === actionKey;

    if (!isUnlocked) {
      return (
        <div key={actionKey} className="manual-button locked">
          🔒 {actionData.name}
          <small>{actionData.lockMessage || 'Non débloqué'}</small>
        </div>
      );
    }

    return (
      <button 
        key={actionKey}
        onClick={() => toggleActionLoop(actionKey)}
        className={`manual-button ${categoryClass} ${inProgress ? 'in-progress' : ''} ${!actionData.canAfford ? 'no-resources' : ''} ${isLooping ? 'looping' : ''}`}
      >
        <div className="button-content">
          <div className="action-header">
            {actionData.icon} {actionData.name}
            {isLooping && <span className="loop-indicator">🔄</span>}
          </div>
          <small>
            {actionData.reward || actionData.recipe}
            {isLooping && ' - EN BOUCLE'}
          </small>
        </div>
        
        {inProgress && (
          <div className="progress-overlay">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="progress-text">{Math.floor(progress)}%</span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="manual-actions">
      <h2>⛏️ Actions Manuelles</h2>
      <p><strong>Clique sur un bouton</strong> pour le répéter en boucle automatiquement ! Clique à nouveau ou sur un autre bouton pour arrêter.</p>
      
      {/* Indicateur global */}
      {activeLoopAction && (
        <div className="active-loop-indicator">
          <span>🔄 Action en boucle : <strong>{activeLoopAction.replace('_', ' ')}</strong></span>
          <button 
            onClick={() => toggleActionLoop(activeLoopAction)}
            className="stop-loop-btn"
          >
            ⏹️ Arrêter
          </button>
        </div>
      )}
      
      <div className="manual-categories">
        {/* EXTRACTION */}
        <div className="manual-category">
          <h3>🪨 Extraction Manuelle</h3>
          <div className="manual-buttons-grid">
            {['mine_iron', 'mine_copper', 'mine_coal', 'mine_limestone', 'collect_water'].map(actionKey => {
              const actionData = {
                mine_iron: { icon: '🪨', name: 'Miner Fer', reward: '+1 Iron Ore', canAfford: true },
                mine_copper: { icon: '🟫', name: 'Miner Cuivre', reward: '+1 Copper Ore', canAfford: true },
                mine_coal: { icon: '⚫', name: 'Miner Charbon', reward: '+1 Coal', canAfford: true },
                mine_limestone: { icon: '⚪', name: 'Miner Calcaire', reward: '+1 Limestone', canAfford: true },
                collect_water: { icon: '💧', name: 'Collecter Eau', reward: '+1 Water', canAfford: true }
              }[actionKey];

              return renderActionButton(actionKey, actionData, 'extract');
            })}
          </div>
        </div>

        {/* FONDERIE MANUELLE */}
        <div className="manual-category">
          <h3>🔥 Fonderie Manuelle</h3>
          <div className="manual-buttons-grid">
            {['smelt_iron', 'smelt_copper'].map(actionKey => {
              const actionData = {
                smelt_iron: { 
                  icon: '🔩', 
                  name: 'Fondre Fer', 
                  recipe: '1 Iron Ore → 1 Iron Ingot',
                  canAfford: resources.iron_ore >= 1
                },
                smelt_copper: { 
                  icon: '🟤', 
                  name: 'Fondre Cuivre', 
                  recipe: '1 Copper Ore → 1 Copper Ingot',
                  canAfford: resources.copper_ore >= 1
                }
              }[actionKey];

              return renderActionButton(actionKey, actionData, 'smelt');
            })}
          </div>
        </div>

        {/* ARTISANAT MANUEL - TIER 1 */}
        <div className="manual-category">
          <h3>🔧 Artisanat Tier 1 - Fer</h3>
          <div className="manual-buttons-grid">
            {['craft_iron_plate', 'craft_iron_rod', 'craft_screws'].map(actionKey => {
              const actionData = {
                craft_iron_plate: { 
                  icon: '🔳', 
                  name: 'Plaque de Fer', 
                  recipe: '1 Iron Ingot → 1 Iron Plate',
                  canAfford: resources.iron_ingot >= 1
                },
                craft_iron_rod: { 
                  icon: '📏', 
                  name: 'Tige de Fer', 
                  recipe: '1 Iron Ingot → 1 Iron Rod',
                  canAfford: resources.iron_ingot >= 1
                },
                craft_screws: { 
                  icon: '🔩', 
                  name: 'Vis', 
                  recipe: '1 Iron Rod → 4 Screws',
                  canAfford: resources.iron_rod >= 1
                }
              }[actionKey];

              return renderActionButton(actionKey, actionData, 'craft');
            })}
          </div>
        </div>

        {/* ARTISANAT MANUEL - TIER 2 */}
        <div className="manual-category">
          <h3>🔧 Artisanat Tier 2 - Cuivre & Matériaux</h3>
          <div className="manual-buttons-grid">
            {['craft_wire', 'craft_cable', 'craft_concrete'].map(actionKey => {
              const actionData = {
                craft_wire: { 
                  icon: '🔌', 
                  name: 'Fil Électrique', 
                  recipe: '1 Copper Ingot → 2 Wire',
                  canAfford: resources.copper_ingot >= 1,
                  lockMessage: 'Tier 2 - Recherche "Basic Production"'
                },
                craft_cable: { 
                  icon: '🔗', 
                  name: 'Câble', 
                  recipe: '2 Wire → 1 Cable',
                  canAfford: resources.wire >= 2,
                  lockMessage: 'Tier 2 - Recherche "Basic Production"'
                },
                craft_concrete: { 
                  icon: '🧱', 
                  name: 'Béton', 
                  recipe: '3 Limestone → 1 Concrete',
                  canAfford: resources.limestone >= 3,
                  lockMessage: 'Tier 2 - Recherche "Basic Production"'
                }
              }[actionKey];

              return renderActionButton(actionKey, actionData, 'craft');
            })}
          </div>
        </div>

        {/* 🔬 RECHERCHE - SECTION IMPORTANTE */}
        <div className="manual-category">
          <h3>🔬 Recherche Manuelle</h3>
          <div className="manual-buttons-grid">
            <button 
              onClick={() => toggleActionLoop('research')}
              className={`manual-button research ${actionProgress['research'] !== undefined ? 'in-progress' : ''} ${activeLoopAction === 'research' ? 'looping' : ''}`}
            >
              <div className="button-content">
                <div className="action-header">
                  📚 Étudier
                  {activeLoopAction === 'research' && <span className="loop-indicator">🔄</span>}
                </div>
                <small>
                  +5 Research Points
                  {activeLoopAction === 'research' && ' - EN BOUCLE'}
                </small>
              </div>
              
              {actionProgress['research'] !== undefined && (
                <div className="progress-overlay">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${actionProgress['research']}%` }}
                    />
                  </div>
                  <span className="progress-text">{Math.floor(actionProgress['research'])}%</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="progression-hint">
        <h3>🎯 Progression Recommandée :</h3>
        <ol>
          <li><strong>Mine des ressources</strong> → Iron Ore, Copper Ore, Limestone</li>
          <li><strong>Fonds les minerais</strong> → Iron Ingot, Copper Ingot</li>
          <li><strong>Crée des composants</strong> → Iron Plate, Cable, Concrete</li>
          <li><strong>Étudie</strong> → Accumule 50 Research Points</li>
          <li><strong>Débloquer "Basic Production"</strong> → Commence l'automation !</li>
        </ol>
      </div>
    </div>
  );
};

export default ManualActionsTab;
