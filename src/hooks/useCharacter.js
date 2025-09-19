import { useState, useCallback, useEffect } from 'react';
import { EQUIPMENT_DATA } from '../data/gameData';

export const useCharacter = (character, setCharacter, equipment) => {
  
  // Calculer l'XP nécessaire pour le prochain niveau
  const calculateXPToNext = (currentLevel) => {
    return Math.floor(100 * Math.pow(1.2, currentLevel - 1));
  };

  // Gagner de l'XP dans une compétence
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
        skillData.xp_to_next = calculateXPToNext(skillData.level);
        
        console.log(`🎉 ${skill} leveled up to ${skillData.level}!`);
        
        // Bonus spéciaux par niveau
        if (skill === 'hitpoints') {
          skillData.max = skillData.level * 10;
          skillData.current = Math.min(skillData.current + 10, skillData.max);
        }
      }
      
      return newCharacter;
    });
  }, [setCharacter]);

  // Calculer les stats totales avec équipement
  const calculateStats = useCallback(() => {
    const baseStats = {
      attack: character.attack.level,
      defense: character.defense.level,
      magic: character.magic.level,
      hp: character.hitpoints.max,
      mining_speed: 1.0,
      crafting_speed: 1.0,
      production_bonus: 1.0
    };

    // Ajouter les bonus d'équipement
    Object.values(equipment).forEach(item => {
      if (item && EQUIPMENT_DATA[item]) {
        const itemData = EQUIPMENT_DATA[item];
        if (itemData.stats) {
          Object.entries(itemData.stats).forEach(([stat, value]) => {
            if (baseStats[stat] !== undefined) {
              baseStats[stat] += value;
            }
          });
        }
      }
    });

    return baseStats;
  }, [character, equipment]);

  // Vérifier si le joueur peut effectuer une action
  const canPerformAction = useCallback((actionKey) => {
    // Implémenter la logique de vérification des prérequis
    return true; // Simplifié pour l'instant
  }, [character]);

  // Soigner le joueur
  const heal = useCallback((amount) => {
    setCharacter(prev => ({
      ...prev,
      hitpoints: {
        ...prev.hitpoints,
        current: Math.min(prev.hitpoints.max, prev.hitpoints.current + amount)
      }
    }));
  }, [setCharacter]);

  // Infliger des dégâts
  const takeDamage = useCallback((amount) => {
    setCharacter(prev => ({
      ...prev,
      hitpoints: {
        ...prev.hitpoints,
        current: Math.max(0, prev.hitpoints.current - amount)
      }
    }));
  }, [setCharacter]);

  return {
    gainXP,
    calculateStats,
    canPerformAction,
    heal,
    takeDamage
  };
};
