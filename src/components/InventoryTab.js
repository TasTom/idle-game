import React, { useState } from 'react';
import { EQUIPMENT_ITEMS, EQUIPMENT_RARITIES, EQUIPMENT_TYPES } from '../data/gameData';
import '../styles/components/inventory-tab.css';

const InventoryTab = ({ 
  character, 
  resources, 
  equipment, 
  onEquipItem, 
  onUnequipItem, 
  onSellItem,
  onCraftItem 
}) => {
  const [activeTab, setActiveTab] = useState('inventory');

  // Calculer les stats totales avec équipement
  const calculateTotalStats = () => {
    let totalStats = {
      attack: character.attack.level,
      defense: character.defense.level,
      magic: character.magic.level
    };

    Object.values(equipment).forEach(itemId => {
      if (itemId && EQUIPMENT_ITEMS[itemId]) {
        const item = EQUIPMENT_ITEMS[itemId];
        Object.entries(item.stats).forEach(([stat, value]) => {
          totalStats[stat] = (totalStats[stat] || 0) + value;
        });
      }
    });

    return totalStats;
  };

  // Obtenir tous les items dans l'inventaire
  const getInventoryItems = () => {
    const items = [];
    
    Object.entries(resources).forEach(([itemId, quantity]) => {
      if (quantity > 0 && EQUIPMENT_ITEMS[itemId]) {
        items.push({ id: itemId, ...EQUIPMENT_ITEMS[itemId], quantity });
      }
    });

    return items.sort((a, b) => a.name.localeCompare(b.name));
  };

  // Vérifier si un item peut être crafté
  const canCraftItem = (itemId) => {
    const item = EQUIPMENT_ITEMS[itemId];
    if (!item.craft_req) return false;

    // Vérifier les prérequis de niveau
    if (item.unlock_req) {
      const meetsReq = Object.entries(item.unlock_req).every(([skill, level]) => 
        character[skill].level >= level
      );
      if (!meetsReq) return false;
    }

    // Vérifier les matériaux
    return Object.entries(item.craft_req).every(([resource, amount]) => 
      resources[resource] >= amount
    );
  };

  const totalStats = calculateTotalStats();
  const inventoryItems = getInventoryItems();
  const craftableItems = Object.entries(EQUIPMENT_ITEMS).filter(([id, item]) => 
    item.craft_req && canCraftItem(id)
  );

  return (
    <div className="inventory-tab">
      <div className="inventory-header">
        <h2>🎒 Inventory & Equipment</h2>
        <p>Manage your gear and craft new equipment!</p>
      </div>

      {/* Navigation des onglets */}
      <div className="inventory-navigation">
        <button 
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          📦 Inventory
        </button>
        <button 
          className={`tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipment')}
        >
          ⚔️ Equipment
        </button>
        <button 
          className={`tab-btn ${activeTab === 'crafting' ? 'active' : ''}`}
          onClick={() => setActiveTab('crafting')}
        >
          🔨 Crafting
        </button>
      </div>

      {/* Stats totales */}
      <div className="total-stats">
        <h3>📊 Total Combat Stats</h3>
        <div className="stats-display">
          <div className="stat-item">
            <span className="stat-label">⚔️ Attack:</span>
            <span className="stat-value">
              {character.attack.level}
              {totalStats.attack > character.attack.level && (
                <span className="bonus">+{totalStats.attack - character.attack.level}</span>
              )}
              = {totalStats.attack}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">🛡️ Defense:</span>
            <span className="stat-value">
              {character.defense.level}
              {totalStats.defense > character.defense.level && (
                <span className="bonus">+{totalStats.defense - character.defense.level}</span>
              )}
              = {totalStats.defense}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">🔮 Magic:</span>
            <span className="stat-value">
              {character.magic.level}
              {totalStats.magic > character.magic.level && (
                <span className="bonus">+{totalStats.magic - character.magic.level}</span>
              )}
              = {totalStats.magic}
            </span>
          </div>
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'inventory' && (
        <div className="inventory-content">
          <h3>📦 Your Items ({inventoryItems.length})</h3>
          
          {inventoryItems.length === 0 ? (
            <div className="empty-message">
              <p>🎒 Your inventory is empty!</p>
              <p>Craft items or get them from combat to fill it up.</p>
            </div>
          ) : (
            <div className="items-grid">
              {inventoryItems.map(item => {
                const rarity = EQUIPMENT_RARITIES[item.rarity];
                const isEquipped = equipment[item.type] === item.id;

                return (
                  <div 
                    key={item.id}
                    className={`item-card ${item.rarity} ${isEquipped ? 'equipped' : ''}`}
                    style={{ borderColor: rarity.color }}
                  >
                    <div className="item-header">
                      <div className="item-info">
                        <span className="item-emoji">{item.emoji}</span>
                        <div>
                          <div className="item-name" style={{ color: rarity.color }}>
                            {item.name}
                          </div>
                          <div className="item-type">{EQUIPMENT_TYPES[item.type].name}</div>
                        </div>
                      </div>
                      <div className="item-quantity">×{item.quantity}</div>
                    </div>

                    <div className="item-stats">
                      {Object.entries(item.stats).map(([stat, value]) => (
                        <div key={stat} className="stat">
                          +{value} {stat}
                        </div>
                      ))}
                    </div>

                    <div className="item-actions">
                      {!isEquipped ? (
                        <button 
                          onClick={() => onEquipItem(item.id)}
                          className="equip-btn"
                        >
                          ⚡ Equip
                        </button>
                      ) : (
                        <button 
                          onClick={() => onUnequipItem(item.type)}
                          className="unequip-btn"
                        >
                          ❌ Unequip
                        </button>
                      )}
                      
                      <button 
                        onClick={() => onSellItem(item.id)}
                        className="sell-btn"
                      >
                        💰 Sell ({item.sell_price}g)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'equipment' && (
        <div className="equipment-content">
          <h3>⚔️ Currently Equipped</h3>
          
          <div className="equipment-slots">
            {Object.entries(EQUIPMENT_TYPES).map(([slotType, slotInfo]) => {
              const equippedItemId = equipment[slotType];
              const equippedItem = equippedItemId ? EQUIPMENT_ITEMS[equippedItemId] : null;

              return (
                <div key={slotType} className="equipment-slot">
                  <div className="slot-header">
                    <span className="slot-emoji">{slotInfo.emoji}</span>
                    <span className="slot-name">{slotInfo.name}</span>
                  </div>
                  
                  <div className="slot-content">
                    {equippedItem ? (
                      <div className="equipped-item">
                        <span className="equipped-emoji">{equippedItem.emoji}</span>
                        <div className="equipped-info">
                          <div 
                            className="equipped-name"
                            style={{ color: EQUIPMENT_RARITIES[equippedItem.rarity].color }}
                          >
                            {equippedItem.name}
                          </div>
                          <div className="equipped-stats">
                            {Object.entries(equippedItem.stats).map(([stat, value]) => (
                              <span key={stat} className="equipped-stat">
                                +{value} {stat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={() => onUnequipItem(slotType)}
                          className="unequip-btn small"
                        >
                          ❌
                        </button>
                      </div>
                    ) : (
                      <div className="empty-slot">
                        <span className="empty-text">Empty</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'crafting' && (
        <div className="crafting-content">
          <h3>🔨 Available Crafts ({craftableItems.length})</h3>
          
          {craftableItems.length === 0 ? (
            <div className="empty-message">
              <p>🔨 No items available to craft!</p>
              <p>Level up your skills and gather materials to unlock crafting recipes.</p>
            </div>
          ) : (
            <div className="crafts-grid">
              {craftableItems.map(([itemId, item]) => {
                const rarity = EQUIPMENT_RARITIES[item.rarity];

                return (
                  <div 
                    key={itemId}
                    className={`craft-card ${item.rarity}`}
                    style={{ borderColor: rarity.color }}
                  >
                    <div className="craft-header">
                      <span className="craft-emoji">{item.emoji}</span>
                      <div>
                        <div className="craft-name" style={{ color: rarity.color }}>
                          {item.name}
                        </div>
                        <div className="craft-type">{EQUIPMENT_TYPES[item.type].name}</div>
                      </div>
                    </div>

                    <div className="craft-stats">
                      {Object.entries(item.stats).map(([stat, value]) => (
                        <div key={stat} className="craft-stat">
                          +{value} {stat}
                        </div>
                      ))}
                    </div>

                    <div className="craft-requirements">
                      <div className="req-title">Materials needed:</div>
                      {Object.entries(item.craft_req).map(([resource, amount]) => (
                        <div key={resource} className="req-item">
                          {amount}x {resource.replace('_', ' ')} 
                          ({resources[resource] || 0} owned)
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => onCraftItem(itemId)}
                      className="craft-btn"
                    >
                      🔨 Craft Item
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryTab;
