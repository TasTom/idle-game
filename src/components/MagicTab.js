import React, { useState, useEffect } from 'react';
import { SPELLS } from '../data/gameData';

const MagicTab = ({ character, resources, setResources }) => {
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [spellCooldowns, setSpellCooldowns] = useState({});
  const [activeEffects, setActiveEffects] = useState([]);

  // Gérer les cooldowns
  useEffect(() => {
    const interval = setInterval(() => {
      setSpellCooldowns(prev => {
        const newCooldowns = { ...prev };
        Object.keys(newCooldowns).forEach(spellKey => {
          newCooldowns[spellKey] = Math.max(0, newCooldowns[spellKey] - 1000);
          if (newCooldowns[spellKey] <= 0) {
            delete newCooldowns[spellKey];
          }
        });
        return newCooldowns;
      });

      // Gérer les effets actifs
      setActiveEffects(prev => {
        return prev.filter(effect => {
          effect.remaining -= 1000;
          return effect.remaining > 0;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Lancer un sort
  const castSpell = (spellKey) => {
    const spell = SPELLS[spellKey];
    if (!spell) return;

    // Vérifier les prérequis
    if (spell.unlock_req) {
      const meetsReq = Object.entries(spell.unlock_req).every(([skill, level]) => 
        character[skill].level >= level
      );
      if (!meetsReq) {
        console.log('❌ Spell requirements not met');
        return;
      }
    }

    // Vérifier le cooldown
    if (spellCooldowns[spellKey]) {
      console.log('❌ Spell is on cooldown');
      return;
    }

    // Vérifier le coût
    const canAfford = Object.entries(spell.cost).every(([resource, amount]) => 
      resources[resource] >= amount
    );

    if (!canAfford) {
      console.log('❌ Cannot afford spell cost');
      return;
    }

    // Payer le coût
    setResources(prev => {
      const newResources = { ...prev };
      Object.entries(spell.cost).forEach(([resource, amount]) => {
        newResources[resource] -= amount;
      });
      return newResources;
    });

    // Appliquer le cooldown
    setSpellCooldowns(prev => ({
      ...prev,
      [spellKey]: spell.cooldown
    }));

    // Appliquer l'effet
    applySpellEffect(spellKey, spell);

    console.log(`✨ Cast ${spell.name}!`);
  };

  // Appliquer l'effet d'un sort
  const applySpellEffect = (spellKey, spell) => {
    switch (spellKey) {
      case 'heal':
        // Soigner le joueur immédiatement
        setResources(prev => ({
          ...prev,
          // Assuming we store current HP in resources for simplicity
        }));
        break;
        
      case 'machine_boost':
        // Ajouter un effet temporaire
        setActiveEffects(prev => [...prev, {
          name: 'Machine Boost',
          description: 'Double production speed',
          remaining: spell.effect.duration,
          icon: '⚡'
        }]);
        break;
        
      default:
        console.log(`Unknown spell effect: ${spellKey}`);
    }
  };

  // Calculer le temps de cooldown restant
  const getCooldownText = (spellKey) => {
    const remaining = spellCooldowns[spellKey];
    if (!remaining) return null;
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="magic-tab">
      <div className="magic-header">
        <h2>🔮 Magic</h2>
        <p>Harness the power of desert magic to enhance your abilities!</p>
        
        <div className="mana-display">
          <div className="mana-bar">
            <div 
              className="mana-fill"
              style={{ width: `${(resources.mana / resources.max_mana) * 100}%` }}
            />
            <span className="mana-text">{resources.mana}/{resources.max_mana} Mana</span>
          </div>
          <div className="mana-regen">+1 mana every 5 seconds</div>
        </div>
      </div>

      {/* Active Effects */}
      {activeEffects.length > 0 && (
        <div className="active-effects">
          <h3>✨ Active Effects</h3>
          <div className="effects-list">
            {activeEffects.map((effect, index) => (
              <div key={index} className="effect-item">
                <div className="effect-icon">{effect.icon}</div>
                <div className="effect-info">
                  <div className="effect-name">{effect.name}</div>
                  <div className="effect-description">{effect.description}</div>
                  <div className="effect-timer">
                    {Math.ceil(effect.remaining / 1000)}s remaining
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spell Categories */}
      <div className="spells-section">
        <h3>📚 Available Spells</h3>
        
        <div className="spells-grid">
          {Object.entries(SPELLS).map(([spellKey, spell]) => {
            const meetsReq = !spell.unlock_req || Object.entries(spell.unlock_req).every(([skill, level]) => 
              character[skill].level >= level
            );
            const canAfford = Object.entries(spell.cost).every(([resource, amount]) => 
              resources[resource] >= amount
            );
            const onCooldown = !!spellCooldowns[spellKey];
            const cooldownText = getCooldownText(spellKey);

            return (
              <div 
                key={spellKey}
                className={`spell-card ${!meetsReq ? 'locked' : ''} ${!canAfford ? 'expensive' : ''} ${onCooldown ? 'cooldown' : ''}`}
                onClick={() => meetsReq && canAfford && !onCooldown && castSpell(spellKey)}
              >
                <div className="spell-icon">✨</div>
                <div className="spell-name">{spell.name}</div>
                <div className="spell-description">{spell.description}</div>
                
                <div className="spell-cost">
                  {Object.entries(spell.cost).map(([resource, amount]) => (
                    <div key={resource} className="cost-item">
                      -{amount} {resource}
                    </div>
                  ))}
                </div>

                {spell.cooldown && (
                  <div className="spell-cooldown">
                    Cooldown: {Math.floor(spell.cooldown / 60000)}m {Math.floor((spell.cooldown % 60000) / 1000)}s
                  </div>
                )}

                {!meetsReq && spell.unlock_req && (
                  <div className="spell-requirements">
                    🔒 Requires: {Object.entries(spell.unlock_req).map(([skill, level]) => 
                      `${skill} ${level}`
                    ).join(', ')}
                  </div>
                )}

                {onCooldown && (
                  <div className="cooldown-overlay">
                    <div className="cooldown-text">⏳ {cooldownText}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MagicTab;
