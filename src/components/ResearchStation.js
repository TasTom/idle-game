import React from 'react';

const ResearchStation = ({ techTree, unlockedTech, resources, unlockTechnology }) => {
  const canUnlockTech = (techKey) => {
    const tech = techTree[techKey];
    
    // Vérifier les prérequis
    const prerequisitesMet = tech.prerequisites.every(prereq => 
      unlockedTech.includes(prereq)
    );
    
    // Vérifier les ressources
    const resourcesMet = Object.entries(tech.cost).every(
      ([resource, amount]) => resources[resource] >= amount
    );
    
    // Pas déjà débloqué
    const notUnlocked = !unlockedTech.includes(techKey);
    
    return prerequisitesMet && resourcesMet && notUnlocked;
  };

  const getTechStatus = (techKey) => {
    const tech = techTree[techKey];
    
    if (unlockedTech.includes(techKey)) {
      return { status: 'unlocked', text: '✅ Débloqué' };
    }
    
    const prerequisitesMet = tech.prerequisites.every(prereq => 
      unlockedTech.includes(prereq)
    );
    
    if (!prerequisitesMet) {
      return { status: 'locked', text: '🔒 Prérequis manquants' };
    }
    
    const resourcesMet = Object.entries(tech.cost).every(
      ([resource, amount]) => resources[resource] >= amount
    );
    
    if (!resourcesMet) {
      return { status: 'expensive', text: '💰 Ressources insuffisantes' };
    }
    
    return { status: 'available', text: '🔬 Recherche disponible' };
  };

  return (
    <div className="research-station">
      <div className="research-header">
        <h2>🔬 Station de Recherche</h2>
        <div className="research-progress">
          <p>Technologies débloquées: {unlockedTech.length}/{Object.keys(techTree).length}</p>
          <p>Points de recherche: {Math.floor(resources.research_points)}</p>
        </div>
      </div>

      <div className="tech-tree">
        {Object.entries(techTree).map(([techKey, tech]) => {
          const status = getTechStatus(techKey);
          const canUnlock = canUnlockTech(techKey);

          return (
            <div 
              key={techKey} 
              className={`tech-card ${status.status} ${canUnlock ? 'can-unlock' : ''}`}
            >
              <div className="tech-header">
                <h3>{tech.name}</h3>
                <span className="tech-tier">Tier {tech.tier}</span>
              </div>
              
              <p className="tech-description">{tech.description}</p>
              
              <div className="tech-status">
                <span className={`status-badge ${status.status}`}>
                  {status.text}
                </span>
              </div>

              <div className="tech-cost">
                <strong>Coût:</strong>
                <div className="cost-list">
                  {Object.entries(tech.cost).map(([resource, amount]) => (
                    <div 
                      key={resource}
                      className={`cost-item ${resources[resource] >= amount ? 'affordable' : 'expensive'}`}
                    >
                      <span>{resource}: {amount}</span>
                      <span className="current-amount">({resources[resource] || 0})</span>
                    </div>
                  ))}
                </div>
              </div>

              {tech.prerequisites.length > 0 && (
                <div className="tech-prerequisites">
                  <strong>Prérequis:</strong>
                  <div className="prereq-list">
                    {tech.prerequisites.map(prereq => (
                      <span 
                        key={prereq}
                        className={`prereq-item ${unlockedTech.includes(prereq) ? 'met' : 'unmet'}`}
                      >
                        {unlockedTech.includes(prereq) ? '✅' : '❌'} {techTree[prereq]?.name || prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="tech-unlocks">
                <strong>Débloque:</strong>
                <div className="unlocks-list">
                  {tech.unlocks.map(unlock => (
                    <span key={unlock} className="unlock-item">
                      🔓 {unlock.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => unlockTechnology(techKey)}
                disabled={!canUnlock}
                className={`research-button ${canUnlock ? 'can-research' : 'cannot-research'}`}
              >
                {canUnlock ? 'Rechercher' : 'Indisponible'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResearchStation;
