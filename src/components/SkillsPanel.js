import React from 'react';

const SkillsPanel = ({ 
  activeSkill, 
  setActiveSkill, 
  resources, 
  actionProgress, 
  activeLoopAction 
}) => {
  const skills = [
    {
      id: 'mining',
      name: 'Mining',
      icon: '⛏️',
      level: calculateSkillLevel('mining', resources),
      xp: resources.mining_xp || 0,
      color: '#8B4513'
    },
    {
      id: 'smithing',
      name: 'Smithing',
      icon: '🔥',
      level: calculateSkillLevel('smithing', resources),
      xp: resources.smithing_xp || 0,
      color: '#FF6600'
    },
    {
      id: 'crafting',
      name: 'Crafting',
      icon: '🔨',
      level: calculateSkillLevel('crafting', resources),
      xp: resources.crafting_xp || 0,
      color: '#4CAF50'
    },
    {
      id: 'production',
      name: 'Production',
      icon: '🏭',
      level: 1,
      xp: 0,
      color: '#2196F3'
    },
    {
      id: 'research',
      name: 'Research',
      icon: '🔬',
      level: 1,
      xp: resources.research_points || 0,
      color: '#9C27B0'
    }
  ];

  return (
    <div className="skills-panel">
      <h3>Skills</h3>
      <div className="skills-list">
        {skills.map(skill => (
          <div 
            key={skill.id}
            className={`skill-item ${activeSkill === skill.id ? 'active' : ''}`}
            onClick={() => setActiveSkill(skill.id)}
            style={{ '--skill-color': skill.color }}
          >
            <div className="skill-icon">{skill.icon}</div>
            <div className="skill-info">
              <div className="skill-name">{skill.name}</div>
              <div className="skill-level">Lv. {skill.level}</div>
              {activeLoopAction && activeSkill === skill.id && (
                <div className="skill-activity">🔄 Active</div>
              )}
            </div>
            <div className="skill-progress">
              <div 
                className="progress-bar"
                style={{ width: `${(skill.xp % 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fonction utilitaire pour calculer le niveau
function calculateSkillLevel(skill, resources) {
  const xp = resources[`${skill}_xp`] || 0;
  return Math.floor(xp / 100) + 1; // Système simple
}

export default SkillsPanel;
