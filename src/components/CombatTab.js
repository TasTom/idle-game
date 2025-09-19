import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MONSTERS } from '../data/gameData';

import '../styles/components/combat-tab.css';

const CombatTab = ({ character, resources, performCombat, isRunning }) => {
  const [activeCombat, setActiveCombat] = useState(null);
  const [combatProgress, setCombatProgress] = useState(0);
  const [playerHp, setPlayerHp] = useState(character.hitpoints.current);
  const [monsterHp, setMonsterHp] = useState(0);
  const [combatLog, setCombatLog] = useState([]);
  
  // Ref pour gérer le combat
  const combatControlRef = useRef({
    isActive: false,
    currentMonster: null,
    combatInterval: null,
    combatTimeout: null
  });

  // Fonction pour nettoyer les timers
  const cleanupCombat = useCallback(() => {
    const control = combatControlRef.current;
    
    if (control.combatInterval) {
      clearInterval(control.combatInterval);
      control.combatInterval = null;
    }
    
    if (control.combatTimeout) {
      clearTimeout(control.combatTimeout);
      control.combatTimeout = null;
    }
    
    control.isActive = false;
    control.currentMonster = null;
  }, []);

  // Fonction pour arrêter le combat
  const stopCombat = useCallback(() => {
    console.log('🛑 Stopping combat');
    
    cleanupCombat();
    setActiveCombat(null);
    setCombatProgress(0);
    setPlayerHp(character.hitpoints.current);
    setMonsterHp(0);
    setCombatLog([]);
  }, [cleanupCombat, character.hitpoints.current]);

  // Effet pour arrêter si jeu pausé
  useEffect(() => {
    if (!isRunning && activeCombat) {
      stopCombat();
    }
  }, [isRunning, activeCombat, stopCombat]);

  // Calculer les stats de combat du joueur
  const getPlayerCombatStats = () => {
    const baseAttack = character.attack.level;
    const baseDefense = character.defense.level;
    const baseHp = character.hitpoints.max;
    
    return {
      attack: baseAttack,
      defense: baseDefense,
      maxHp: baseHp,
      currentHp: playerHp
    };
  };

  // Ajouter un message au log de combat
  const addToCombatLog = (message, type = 'info') => {
    setCombatLog(prev => [...prev.slice(-4), { message, type, timestamp: Date.now() }]);
  };

  // Fonction pour commencer le combat
  const startCombat = useCallback(async (monsterId) => {
    const monster = MONSTERS[monsterId];
    if (!monster) return;

    console.log(`⚔️ Starting combat with: ${monster.name}`);

    // Si c'est le même monstre, arrêter
    if (activeCombat === monsterId) {
      stopCombat();
      return;
    }

    // Arrêter le combat précédent
    if (activeCombat) {
      stopCombat();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Initialiser le nouveau combat
    setActiveCombat(monsterId);
    setCombatProgress(0);
    setPlayerHp(character.hitpoints.current);
    setMonsterHp(monster.hp);
    setCombatLog([]);
    
    const control = combatControlRef.current;
    control.isActive = true;
    control.currentMonster = monsterId;

    addToCombatLog(`⚔️ Combat started against ${monster.name}!`, 'combat');

    const playerStats = getPlayerCombatStats();
    let currentPlayerHp = playerStats.currentHp;
    let currentMonsterHp = monster.hp;

    // Boucle de combat
    const combatLoop = () => {
      if (!control.isActive || control.currentMonster !== monsterId || !isRunning) {
        return;
      }

      // Tour du joueur
      const playerDamage = Math.max(1, playerStats.attack - monster.defense);
      currentMonsterHp -= playerDamage;
      addToCombatLog(`⚔️ You deal ${playerDamage} damage!`, 'player');
      setMonsterHp(currentMonsterHp);

      // Vérifier si le monstre est mort
      if (currentMonsterHp <= 0) {
        // Victoire !
        addToCombatLog(`🎉 ${monster.name} defeated!`, 'victory');
        
        // Donner les récompenses
        performCombat(monsterId, 'victory');
        
        // Reset et recommencer
        setTimeout(() => {
          if (control.isActive && control.currentMonster === monsterId) {
            currentMonsterHp = monster.hp;
            setMonsterHp(currentMonsterHp);
            addToCombatLog(`🔄 New ${monster.name} appears!`, 'info');
          }
        }, 1000);
        
        return;
      }

      // Tour du monstre après 1 seconde
      setTimeout(() => {
        if (!control.isActive || control.currentMonster !== monsterId) return;

        const monsterDamage = Math.max(1, monster.attack - playerStats.defense);
        currentPlayerHp -= monsterDamage;
        addToCombatLog(`💥 ${monster.name} deals ${monsterDamage} damage!`, 'monster');
        setPlayerHp(currentPlayerHp);

        // Vérifier si le joueur est mort
        if (currentPlayerHp <= 0) {
          addToCombatLog(`💀 You were defeated!`, 'defeat');
          stopCombat();
          return;
        }

        // Continuer le combat après 2 secondes
        control.combatTimeout = setTimeout(combatLoop, 2000);
      }, 1000);
    };

    // Commencer le premier tour
    control.combatTimeout = setTimeout(combatLoop, 1000);

  }, [activeCombat, isRunning, performCombat, stopCombat, character, playerHp]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      cleanupCombat();
    };
  }, [cleanupCombat]);

  // Vérifier si on peut combattre un monstre
  const canFightMonster = (monsterId) => {
    const monster = MONSTERS[monsterId];
    if (!monster.unlock_req) return true;
    
    return Object.entries(monster.unlock_req).every(([skill, level]) => 
      character[skill].level >= level
    );
  };

  const playerStats = getPlayerCombatStats();

  return (
    <div className="combat-tab">
      <div className="combat-header">
        <h2>⚔️ Combat Arena</h2>
        <p>Fight monsters to gain experience and loot!</p>
        
        {!isRunning && (
          <div className="warning-message">
            ⚠️ Game is paused! Click the ▶️ Play button to start fighting.
          </div>
        )}
      </div>

      {/* Stats du joueur */}
      <div className="player-stats">
        <h3>🧙‍♂️ Your Combat Stats</h3>
        <div className="stats-row">
          <div className="stat-item">
            <span>❤️ HP: {playerHp}/{playerStats.maxHp}</span>
            <div className="hp-bar">
              <div 
                className="hp-fill"
                style={{ width: `${(playerHp / playerStats.maxHp) * 100}%` }}
              />
            </div>
          </div>
          <div className="stat-item">
            <span>⚔️ Attack: {playerStats.attack}</span>
          </div>
          <div className="stat-item">
            <span>🛡️ Defense: {playerStats.defense}</span>
          </div>
        </div>
      </div>

      {/* Combat actif */}
      {activeCombat && (
        <div className="active-combat">
          <div className="combat-info">
            <h3>🔥 Fighting: {MONSTERS[activeCombat].name}</h3>
            <button onClick={stopCombat} className="stop-combat-btn">
              ⏹️ Flee
            </button>
          </div>
          
          <div className="monster-health">
            <span>❤️ {MONSTERS[activeCombat].name} HP: {monsterHp}/{MONSTERS[activeCombat].hp}</span>
            <div className="monster-hp-bar">
              <div 
                className="monster-hp-fill"
                style={{ width: `${(monsterHp / MONSTERS[activeCombat].hp) * 100}%` }}
              />
            </div>
          </div>

          <div className="combat-log">
            <h4>📜 Combat Log</h4>
            <div className="log-messages">
              {combatLog.map((log, index) => (
                <div key={index} className={`log-message ${log.type}`}>
                  {log.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Liste des monstres */}
      <div className="monsters-grid">
        {Object.entries(MONSTERS).map(([monsterId, monster]) => {
          const isActive = activeCombat === monsterId;
          const canFight = canFightMonster(monsterId);

          return (
            <div 
              key={monsterId}
              className={`monster-card ${isActive ? 'active' : ''} ${!canFight ? 'disabled' : ''} ${!isRunning ? 'game-paused' : ''}`}
              onClick={() => isRunning && canFight && startCombat(monsterId)}
            >
              <div className="monster-header">
                <div className="monster-name">
                  <span className="monster-emoji">{monster.emoji}</span>
                  {monster.name}
                </div>
                <div className="monster-level">Lv.{monster.level}</div>
              </div>

              <div className="monster-stats">
                <div className="stat">❤️ {monster.hp}</div>
                <div className="stat">⚔️ {monster.attack}</div>
                <div className="stat">🛡️ {monster.defense}</div>
              </div>

              <div className="monster-rewards">
                <div className="reward">💰 {monster.gold_reward[0]}-{monster.gold_reward[1]} gold</div>
                <div className="reward">✨ {monster.xp_reward} XP</div>
              </div>

              <div className="monster-loot">
                {Object.entries(monster.loot_table).map(([item, data]) => (
                  <div key={item} className="loot-item">
                    {(data.chance * 100).toFixed(0)}% {item.replace('_', ' ')}
                  </div>
                ))}
              </div>

              {!canFight && monster.unlock_req && (
                <div className="requirements">
                  🔒 Requires: {Object.entries(monster.unlock_req).map(([skill, level]) => 
                    `${skill} ${level}`
                  ).join(', ')}
                </div>
              )}

              {isActive && (
                <div className="active-indicator">
                  🔥 Fighting
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CombatTab;
