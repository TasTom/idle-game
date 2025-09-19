import React, { useState } from 'react';
import { TOWER_FLOORS } from '../data/gameData';

const TowerTab = ({ tower, setTower, resources, setResources, character }) => {
  const [selectedFloor, setSelectedFloor] = useState(1);

  // Construire un nouvel étage
  const buildFloor = (floorNumber) => {
    const floorData = TOWER_FLOORS[floorNumber];
    if (!floorData || !floorData.unlock_cost) return;

    // Vérifier si on peut payer
    const canAfford = Object.entries(floorData.unlock_cost).every(([resource, cost]) => 
      resources[resource] >= cost
    );

    if (!canAfford) {
      console.log('❌ Cannot afford this floor');
      return;
    }

    // Payer le coût
    setResources(prev => {
      const newResources = { ...prev };
      Object.entries(floorData.unlock_cost).forEach(([resource, cost]) => {
        newResources[resource] -= cost;
      });
      return newResources;
    });

    // Ajouter l'étage
    setTower(prev => ({
      ...prev,
      floors: [...prev.floors, { 
        level: floorNumber, 
        unlocked: true, 
        type: floorData.type,
        buildings: [],
        spirits: []
      }]
    }));

    console.log(`🏗️ Built floor ${floorNumber}!`);
  };

  // Invoquer un esprit
  const summonSpirit = (spiritType) => {
    const spiritCosts = {
      mining_spirit: { mana: 30, soul_essence: 2 },
      crafting_spirit: { mana: 50, soul_essence: 3 },
      research_spirit: { mana: 70, soul_essence: 5 }
    };

    const cost = spiritCosts[spiritType];
    if (!cost) return;

    // Vérifier si on peut payer
    const canAfford = Object.entries(cost).every(([resource, amount]) => 
      resources[resource] >= amount
    );

    if (!canAfford) {
      console.log('❌ Cannot afford this spirit');
      return;
    }

    // Payer le coût
    setResources(prev => {
      const newResources = { ...prev };
      Object.entries(cost).forEach(([resource, amount]) => {
        newResources[resource] -= amount;
      });
      return newResources;
    });

    // Ajouter l'esprit
    const spirit = {
      id: Date.now(),
      type: spiritType,
      level: 1,
      efficiency: 1.0,
      assigned_floor: selectedFloor
    };

    setTower(prev => ({
      ...prev,
      spirits: [...prev.spirits, spirit]
    }));

    console.log(`👻 Summoned ${spiritType}!`);
  };

  const getFloorSpirits = (floorNumber) => {
    return tower.spirits.filter(spirit => spirit.assigned_floor === floorNumber);
  };

  return (
    <div className="tower-tab">
      <div className="tower-header">
        <h2>🏗️ Mage Tower</h2>
        <p>Build your tower higher to unlock new capabilities and house more spirits!</p>
        
        <div className="tower-stats">
          <div className="stat">🏢 Floors: {tower.floors.length}</div>
          <div className="stat">👻 Spirits: {tower.spirits.length}</div>
          <div className="stat">📍 Current Floor: {tower.current_floor}</div>
        </div>
      </div>

      <div className="tower-layout">
        {/* Tower Visualization */}
        <div className="tower-visual">
          <h3>🏰 Tower Structure</h3>
          <div className="tower-floors">
            {/* Render floors from top to bottom */}
            {[...Array(Math.max(10, tower.floors.length + 3))].map((_, index) => {
              const floorNumber = Math.max(10, tower.floors.length + 3) - index;
              const floorData = tower.floors.find(f => f.level === floorNumber);
              const isUnlocked = floorData?.unlocked;
              const canBuild = TOWER_FLOORS[floorNumber] && !isUnlocked;
              
              return (
                <div 
                  key={floorNumber}
                  className={`tower-floor ${isUnlocked ? 'unlocked' : ''} ${selectedFloor === floorNumber ? 'selected' : ''} ${canBuild ? 'buildable' : ''}`}
                  onClick={() => setSelectedFloor(floorNumber)}
                >
                  <div className="floor-number">{floorNumber}</div>
                  <div className="floor-content">
                    {isUnlocked ? (
                      <>
                        <div className="floor-type">
                          {floorData.type === 'workshop' && '🔨'}
                          {floorData.type === 'alchemy' && '🧪'}
                          {floorData.type === 'summoning' && '👻'}
                          {floorData.type === 'enchanting' && '✨'}
                          {floorData.type === 'production' && '⚙️'}
                        </div>
                        <div className="floor-spirits">
                          {getFloorSpirits(floorNumber).length > 0 && (
                            <span className="spirit-count">{getFloorSpirits(floorNumber).length}👻</span>
                          )}
                        </div>
                      </>
                    ) : canBuild ? (
                      <div className="floor-locked">🔒</div>
                    ) : (
                      <div className="floor-empty">⬜</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floor Details */}
        <div className="floor-details">
          <h3>🏢 Floor {selectedFloor} Details</h3>
          
          {tower.floors.find(f => f.level === selectedFloor) ? (
            <div className="floor-info unlocked">
              <div className="floor-status">✅ Unlocked</div>
              
              {TOWER_FLOORS[selectedFloor] && (
                <>
                  <div className="floor-name">{TOWER_FLOORS[selectedFloor].name}</div>
                  <div className="floor-bonus">
                    Bonus: {TOWER_FLOORS[selectedFloor].bonus}
                  </div>
                </>
              )}

              <div className="floor-spirits-section">
                <h4>👻 Assigned Spirits</h4>
                <div className="spirits-list">
                  {getFloorSpirits(selectedFloor).map(spirit => (
                    <div key={spirit.id} className="spirit-item">
                      <div className="spirit-icon">
                        {spirit.type === 'mining_spirit' && '⛏️'}
                        {spirit.type === 'crafting_spirit' && '🔨'}
                        {spirit.type === 'research_spirit' && '📚'}
                      </div>
                      <div className="spirit-info">
                        <div className="spirit-name">{spirit.type.replace('_', ' ')}</div>
                        <div className="spirit-level">Level {spirit.level}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summon-spirits">
                  <h5>Summon New Spirit</h5>
                  <div className="spirit-options">
                    <button 
                      onClick={() => summonSpirit('mining_spirit')}
                      className="summon-btn"
                      disabled={resources.mana < 30 || resources.soul_essence < 2}
                    >
                      ⛏️ Mining Spirit
                      <div className="cost">30 mana, 2 soul essence</div>
                    </button>
                    
                    <button 
                      onClick={() => summonSpirit('crafting_spirit')}
                      className="summon-btn"
                      disabled={resources.mana < 50 || resources.soul_essence < 3}
                    >
                      🔨 Crafting Spirit
                      <div className="cost">50 mana, 3 soul essence</div>
                    </button>
                    
                    <button 
                      onClick={() => summonSpirit('research_spirit')}
                      className="summon-btn"
                      disabled={resources.mana < 70 || resources.soul_essence < 5}
                    >
                      📚 Research Spirit
                      <div className="cost">70 mana, 5 soul essence</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : TOWER_FLOORS[selectedFloor] ? (
            <div className="floor-info locked">
              <div className="floor-status">🔒 Locked</div>
              <div className="floor-name">{TOWER_FLOORS[selectedFloor].name}</div>
              <div className="floor-bonus">
                Bonus: {TOWER_FLOORS[selectedFloor].bonus}
              </div>
              
              {TOWER_FLOORS[selectedFloor].unlock_cost && (
                <div className="unlock-section">
                  <h4>💰 Build Cost</h4>
                  <div className="cost-list">
                    {Object.entries(TOWER_FLOORS[selectedFloor].unlock_cost).map(([resource, cost]) => (
                      <div key={resource} className={`cost-item ${resources[resource] >= cost ? 'affordable' : 'expensive'}`}>
                        {cost} {resource.replace('_', ' ')}
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => buildFloor(selectedFloor)}
                    className="build-btn"
                    disabled={!Object.entries(TOWER_FLOORS[selectedFloor].unlock_cost).every(([resource, cost]) => 
                      resources[resource] >= cost
                    )}
                  >
                    🏗️ Build Floor
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="floor-info empty">
              <div className="floor-status">⬜ Empty</div>
              <p>No floor data available for level {selectedFloor}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TowerTab;
