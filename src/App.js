import React, { useState, useEffect, useCallback } from 'react';
import CharacterPanel from './components/CharacterPanel';
import SkillsTab from './components/SkillsTab';
import MusicPlayer from './components/MusicPlayer';
import CombatTab from './components/CombatTab';
import InventoryTab from './components/InventoryTab';

import { 
  INITIAL_RESOURCES, 
  CHARACTER_STATS, 
  ACTION_CONFIG,
  MONSTERS,
  EQUIPMENT_ITEMS   
} from './data/gameData';

import './styles/DesertMageRPG.css';

function App() {
  // États principaux
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [character, setCharacter] = useState(CHARACTER_STATS);
  const [activeTab, setActiveTab] = useState('skills');
  const [isRunning, setIsRunning] = useState(false);
  
  // État de l'équipement
  const [equipment, setEquipment] = useState({
    weapon: null,
    body: null,
    legs: null,
    boots: null,
    gloves: null,
    helmet: null
  });

  // ✅ FONCTION INSTANTANÉE pour gagner de l'XP (pas d'await)
  const gainXP = useCallback((skill, amount) => {
    console.log(`🎯 Gaining ${amount} XP in ${skill}`);
    
    setCharacter(prev => {
      const newCharacter = { ...prev };
      const skillData = newCharacter[skill];
      
      if (!skillData) {
        console.warn(`Skill ${skill} not found`);
        return prev;
      }

      // Ajouter l'XP
      skillData.xp += amount;
      
      // Vérifier les level ups
      while (skillData.xp >= skillData.xp_to_next) {
        skillData.xp -= skillData.xp_to_next;
        skillData.level += 1;
        skillData.xp_to_next = Math.floor(100 * Math.pow(1.2, skillData.level - 1));
        
        console.log(`🎉 ${skill} leveled up to ${skillData.level}!`);
      }
      
      return newCharacter;
    });
  }, []);

  // ✅ FONCTION INSTANTANÉE pour effectuer une action (pas d'await ni de setTimeout)
  const performAction = useCallback((actionKey) => {
    const action = ACTION_CONFIG[actionKey];
    if (!action) {
      console.error(`❌ Action ${actionKey} not found`);
      return;
    }

    console.log(`💰 INSTANT reward for: ${action.name}`);

    // Vérifier et payer les coûts IMMÉDIATEMENT
    if (action.cost) {
      const canAfford = Object.entries(action.cost).every(([resource, amount]) => 
        resources[resource] >= amount
      );
      
      if (!canAfford) {
        console.log('❌ Cannot afford this action');
        return;
      }
      
      // Payer les coûts
      setResources(prev => {
        const newResources = { ...prev };
        Object.entries(action.cost).forEach(([resource, amount]) => {
          newResources[resource] -= amount;
        });
        return newResources;
      });
    }

    // Donner les récompenses IMMÉDIATEMENT
    if (action.rewards) {
      setResources(prev => {
        const newResources = { ...prev };
        Object.entries(action.rewards).forEach(([resource, amount]) => {
          newResources[resource] = (newResources[resource] || 0) + amount;
        });
        return newResources;
      });
    }

    // Donner l'XP IMMÉDIATEMENT
    if (action.xp) {
      Object.entries(action.xp).forEach(([skill, xp]) => {
        gainXP(skill, xp);
      });
    }

    console.log(`✅ INSTANT completion: ${action.name}`);
  }, [resources, gainXP]);

  const performCombat = useCallback((monsterId, result) => {
  const monster = MONSTERS[monsterId];
  if (!monster) return;

  if (result === 'victory') {
    console.log(`🎉 Victory against ${monster.name}!`);

    // Donner l'or
    const goldEarned = Math.floor(Math.random() * (monster.gold_reward[1] - monster.gold_reward[0] + 1)) + monster.gold_reward[0];
    setResources(prev => ({
      ...prev,
      gold: prev.gold + goldEarned
    }));

    // Donner l'XP
    gainXP('attack', monster.xp_reward);
    gainXP('defense', Math.floor(monster.xp_reward / 3));

    // Calculer le loot
    Object.entries(monster.loot_table).forEach(([item, data]) => {
      if (Math.random() < data.chance) {
        const amount = Array.isArray(data.amount) 
          ? Math.floor(Math.random() * (data.amount[1] - data.amount[0] + 1)) + data.amount[0]
          : data.amount;
        
        setResources(prev => ({
          ...prev,
          [item]: (prev[item] || 0) + amount
        }));
        
        console.log(`💎 Looted ${amount} ${item}!`);
      }
    });
  }
}, [gainXP]);

const onEquipItem = useCallback((itemId) => {
  const item = EQUIPMENT_ITEMS[itemId];
  if (!item || !resources[itemId] || resources[itemId] <= 0) {
    console.log('❌ Cannot equip item: not found or no quantity');
    return;
  }

  console.log(`⚡ Equipping: ${item.name}`);

  // Déséquiper l'item actuel dans ce slot s'il y en a un
  if (equipment[item.type]) {
    onUnequipItem(item.type);
  }

  // Équiper le nouvel item
  setEquipment(prev => ({
    ...prev,
    [item.type]: itemId
  }));

  // Retirer 1 de l'inventaire
  setResources(prev => ({
    ...prev,
    [itemId]: prev[itemId] - 1
  }));

}, [resources, equipment]);

const onUnequipItem = useCallback((slotType) => {
  const equippedItemId = equipment[slotType];
  if (!equippedItemId) return;

  const item = EQUIPMENT_ITEMS[equippedItemId];
  console.log(`❌ Unequipping: ${item.name}`);

  // Remettre l'item dans l'inventaire
  setResources(prev => ({
    ...prev,
    [equippedItemId]: (prev[equippedItemId] || 0) + 1
  }));

  // Enlever de l'équipement
  setEquipment(prev => ({
    ...prev,
    [slotType]: null
  }));

}, [equipment]);

const onSellItem = useCallback((itemId) => {
  const item = EQUIPMENT_ITEMS[itemId];
  if (!item || !resources[itemId] || resources[itemId] <= 0) return;

  console.log(`💰 Selling: ${item.name} for ${item.sell_price} gold`);

  // Ajouter l'or
  setResources(prev => ({
    ...prev,
    gold: prev.gold + item.sell_price,
    [itemId]: prev[itemId] - 1
  }));

}, [resources]);

const onCraftItem = useCallback((itemId) => {
  const item = EQUIPMENT_ITEMS[itemId];
  if (!item.craft_req) return;

  // Vérifier les matériaux
  const canCraft = Object.entries(item.craft_req).every(([resource, amount]) => 
    resources[resource] >= amount
  );

  if (!canCraft) {
    console.log('❌ Cannot craft: insufficient materials');
    return;
  }

  console.log(`🔨 Crafting: ${item.name}`);

  // Payer les matériaux
  setResources(prev => {
    const newResources = { ...prev };
    Object.entries(item.craft_req).forEach(([resource, amount]) => {
      newResources[resource] -= amount;
    });
    return newResources;
  });

  // Ajouter l'item crafté
  setResources(prev => ({
    ...prev,
    [itemId]: (prev[itemId] || 0) + 1
  }));

  // Donner de l'XP
  gainXP('smithing', 25);

}, [resources, gainXP]);

  // Calculer les stats totales avec équipement
  const totalStats = {
    attack: character.attack.level,
    defense: character.defense.level,
    magic: character.magic.level,
    hp: character.hitpoints.max
  };

  return (
    <div className="desert-mage-rpg">
      {/* Header avec stats principales */}
      <header className="game-header">
        <div className="header-left">
          <h1>🧙‍♂️ Desert Mage RPG</h1>
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`main-button ${isRunning ? 'running' : ''}`}
          >
            {isRunning ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>

        <div className="header-center">
          <div className="status-bars">
            <div className="stat-bar hp">
              ❤️ HP: {character.hitpoints.current}/{character.hitpoints.max}
            </div>
            <div className="stat-bar mana">
              🔮 Mana: {resources.mana || 0}/{resources.max_mana || 50}
            </div>
            <div className="stat-bar energy">
              ⚡ Energy: {resources.energy || 0}/{resources.max_energy || 100}
            </div>
            <div className="stat-bar gold">
              💰 Gold: {resources.gold || 0}
            </div>
            <div className="music-bar">
              <MusicPlayer />
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="level-display">
            Level {character.attack.level + character.magic.level} | XP: {resources.experience || 0}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          ⚒️ Skills
        </button>
        <button
          className={`tab-button ${activeTab === 'combat' ? 'active' : ''}`}
          onClick={() => setActiveTab('combat')}
        >
          ⚔️ Combat
        </button>
        <button
          className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          🎒 Inventory
        </button>
      </nav>

      {/* Layout principal */}
      <div className="game-layout">
        {/* Sidebar gauche - Personnage */}
        <aside className="character-sidebar">
          <CharacterPanel 
            character={character}
            equipment={equipment}
            totalStats={totalStats}
          />
        </aside>

        {/* Contenu principal */}
        <main className="main-content">
          {activeTab === 'skills' && (
            <SkillsTab 
              character={character}
              resources={resources}
              performAction={performAction}
              isRunning={isRunning}
            />
          )}
          
         {activeTab === 'combat' && (
          <CombatTab 
            character={character}
            resources={resources}
            performCombat={performCombat}
            isRunning={isRunning}
          />
        )}

          {activeTab === 'inventory' && (
            <InventoryTab 
              character={character}
              resources={resources}
              equipment={equipment}
              onEquipItem={onEquipItem}
              onUnequipItem={onUnequipItem}
              onSellItem={onSellItem}
              onCraftItem={onCraftItem}
            />
          )}
        </main>

        {/* Sidebar droite - Logs/Notifications */}
        <aside className="activity-sidebar">
          <div className="activity-log">
            <h3>📊 Stats</h3>
            <div className="resource-display">
              <div>⛏️ Iron Ore: {resources.iron_ore || 0}</div>
              <div>🥉 Copper Ore: {resources.copper_ore || 0}</div>
              <div>⚗️ Soul Essence: {resources.soul_essence || 0}</div>
            </div>
            
            <h3>Recent Activity</h3>
            <div className="activity-items">
              <p>✨ Game ready! Start by clicking on skills.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
