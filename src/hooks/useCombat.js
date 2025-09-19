import { useState, useCallback, useRef } from 'react';
import { ENEMIES, COMBAT_ZONES } from '../data/gameData';

export const useCombat = (character, resources, setResources) => {
  const [currentCombat, setCurrentCombat] = useState(null);
  const [isInCombat, setIsInCombat] = useState(false);
  const combatInterval = useRef(null);

  // Calculer les dégâts d'attaque
  const calculateDamage = useCallback((attacker, defender) => {
    const baseDamage = attacker.attack;
    const defense = defender.defense || 0;
    const damage = Math.max(1, baseDamage - defense + Math.random() * 5);
    return Math.floor(damage);
  }, []);

  // Démarrer un combat
  const startCombat = useCallback((enemyKey) => {
    const enemy = ENEMIES[enemyKey];
    if (!enemy) return;

    console.log(`⚔️ Starting combat with ${enemy.name}`);
    
    const combatState = {
      enemy: { ...enemy, current_hp: enemy.hp },
      player_hp: character.hitpoints.current,
      log: []
    };

    setCurrentCombat(combatState);
    setIsInCombat(true);

    // Boucle de combat automatique
    combatInterval.current = setInterval(() => {
      setCurrentCombat(prev => {
        if (!prev) return null;

        const newCombat = { ...prev };
        
        // Tour du joueur
        const playerDamage = calculateDamage(
          { attack: character.attack.level + character.magic.level },
          { defense: enemy.defense }
        );
        
        newCombat.enemy.current_hp -= playerDamage;
        newCombat.log.unshift(`🗡️ You deal ${playerDamage} damage`);

        // Vérifier si l'ennemi est mort
        if (newCombat.enemy.current_hp <= 0) {
          newCombat.log.unshift(`🎉 You defeated ${enemy.name}!`);
          
          // Donner les récompenses
          setResources(prevResources => {
            const newResources = { ...prevResources };
            
            // XP de combat
            const xpGain = enemy.xp_reward;
            newResources.experience += xpGain;
            
            // Drops
            Object.entries(enemy.drops).forEach(([item, dropData]) => {
              if (Math.random() < dropData.chance) {
                const amount = Math.floor(Math.random() * (dropData.max - dropData.min + 1)) + dropData.min;
                newResources[item] = (newResources[item] || 0) + amount;
                newCombat.log.unshift(`💰 Found ${amount} ${item}`);
              }
            });
            
            return newResources;
          });

          // Terminer le combat
          clearInterval(combatInterval.current);
          setIsInCombat(false);
          setTimeout(() => setCurrentCombat(null), 3000);
          return newCombat;
        }

        // Tour de l'ennemi
        const enemyDamage = calculateDamage(
          { attack: enemy.attack },
          { defense: character.defense.level }
        );
        
        newCombat.player_hp -= enemyDamage;
        newCombat.log.unshift(`💥 ${enemy.name} deals ${enemyDamage} damage`);

        // Vérifier si le joueur est mort
        if (newCombat.player_hp <= 0) {
          newCombat.log.unshift(`💀 You were defeated!`);
          clearInterval(combatInterval.current);
          setIsInCombat(false);
          
          // Respawn avec 1 HP
          setTimeout(() => {
            setCurrentCombat(null);
            // TODO: Appliquer une pénalité
          }, 3000);
        }

        // Limiter le log à 10 entrées
        if (newCombat.log.length > 10) {
          newCombat.log = newCombat.log.slice(0, 10);
        }

        return newCombat;
      });
    }, 2000); // Combat toutes les 2 secondes

  }, [character, calculateDamage, setResources]);

  // Fuir le combat
  const flee = useCallback(() => {
    if (combatInterval.current) {
      clearInterval(combatInterval.current);
    }
    setIsInCombat(false);
    setCurrentCombat(null);
    console.log('🏃 Fled from combat');
  }, []);

  return {
    currentCombat,
    startCombat,
    flee,
    isInCombat
  };
};
