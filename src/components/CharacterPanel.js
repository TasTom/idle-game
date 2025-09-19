import React from 'react';

const CharacterPanel = ({ character, equipment, totalStats }) => {
  
  // Fonction safe pour récupérer les infos d'un skill
  const getSkillInfo = (skillName) => {
    const skill = character[skillName];
    if (!skill) {
      return { level: 1, xp: 0, xp_to_next: 100 };
    }
    return skill;
  };

  // Calculer le pourcentage d'XP pour la barre de progression
  const getXPPercentage = (skillName) => {
    const skill = getSkillInfo(skillName);
    return (skill.xp / skill.xp_to_next) * 100;
  };

  return (
    <div className="character-panel">
      <div className="character-avatar">
        <div className="avatar-image">🧙‍♂️</div>
        <div className="character-name">Desert Mage</div>
        <div className="character-level">
          Level {getSkillInfo('attack').level + getSkillInfo('magic').level}
        </div>
      </div>

      {/* Stats de combat */}
      <div className="combat-stats">
        <h3>⚔️ Combat Stats</h3>
        
        <div className="stat-row">
          <div className="stat-info">
            <span className="stat-name">❤️ Hitpoints</span>
            <span className="stat-level">Lv.{getSkillInfo('hitpoints').level}</span>
          </div>
          <div className="hp-bar">
            <div 
              className="hp-fill"
              style={{ width: `${(character.hitpoints?.current || 100) / (character.hitpoints?.max || 100) * 100}%` }}
            />
            <span className="stat-text">
              {character.hitpoints?.current || 100}/{character.hitpoints?.max || 100}
            </span>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-info">
            <span className="stat-name">⚔️ Attack</span>
            <span className="stat-level">Lv.{getSkillInfo('attack').level}</span>
          </div>
          <div className="stat-value">{getSkillInfo('attack').level}</div>
        </div>

        <div className="stat-row">
          <div className="stat-info">
            <span className="stat-name">🛡️ Defense</span>
            <span className="stat-level">Lv.{getSkillInfo('defense').level}</span>
          </div>
          <div className="stat-value">{getSkillInfo('defense').level}</div>
        </div>

        <div className="stat-row">
          <div className="stat-info">
            <span className="stat-name">🔮 Magic</span>
            <span className="stat-level">Lv.{getSkillInfo('magic').level}</span>
          </div>
          <div className="stat-value">{getSkillInfo('magic').level}</div>
        </div>
      </div>

      {/* Stats industrielles */}
      <div className="skill-stats">
        <h3>⚒️ Skills</h3>
        
        {['mining', 'smithing', 'woodcutting', 'fishing'].map(skill => {
          const skillInfo = getSkillInfo(skill);
          const percentage = getXPPercentage(skill);
          
          return (
            <div key={skill} className="stat-row">
              <div className="stat-info">
                <span className="stat-name">
                  {skill === 'mining' && '⛏️'}
                  {skill === 'smithing' && '🔨'}
                  {skill === 'woodcutting' && '🪓'}
                  {skill === 'fishing' && '🎣'}
                  {' '}{skill.charAt(0).toUpperCase() + skill.slice(1)}
                </span>
                <span className="stat-level">Lv.{skillInfo.level}</span>
              </div>
              <div className="xp-bar small">
                <div 
                  className="xp-fill"
                  style={{ width: `${percentage}%` }}
                />
                <span className="xp-text">
                  {skillInfo.xp}/{skillInfo.xp_to_next}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Équipement (placeholder pour plus tard) */}
      <div className="equipment-stats">
        <h3>🎒 Equipment</h3>
        <div className="equipment-slots">
          <div className="equipment-slot">
            <span>⚔️ Weapon:</span>
            <span>{equipment?.weapon || 'None'}</span>
          </div>
          <div className="equipment-slot">
            <span>🛡️ Armor:</span>
            <span>{equipment?.body || 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPanel;
