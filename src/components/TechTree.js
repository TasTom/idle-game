import React from 'react';

const TechTree = ({ techTree, unlockedTech, resources, unlockTechnology }) => {
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
      return { status: 'unlocked', text: '✅ Débloqué', color: '#228B22' };
    }
    
    const prerequisitesMet = tech.prerequisites.every(prereq => 
      unlockedTech.includes(prereq)
    );
    
    if (!prerequisitesMet) {
      return { status: 'locked', text: '🔒 Prérequis manquants', color: '#666' };
    }
    
    const resourcesMet = Object.entries(tech.cost).every(
      ([resource, amount]) => resources[resource] >= amount
    );
    
    if (!resourcesMet) {
      return { status: 'expensive', text: '💰 Ressources insuffisantes', color: '#DC143C' };
    }
    
    return { status: 'available', text: '🔬 Disponible !', color: '#FFD700' };
  };

  // Organiser les techs par tier pour l'affichage en arbre
  const techsByTier = {};
  Object.entries(techTree).forEach(([techKey, tech]) => {
    if (!techsByTier[tech.tier]) {
      techsByTier[tech.tier] = [];
    }
    techsByTier[tech.tier].push({ key: techKey, ...tech });
  });

  return (
    <div className="tech-tree-container">
      <div className="tech-tree-header">
        <h2>🌳 Arbre Technologique</h2>
        <div className="progress-stats">
          <div className="stat">
            <span className="stat-label">Progression:</span>
            <span className="stat-value">
              {unlockedTech.length}/{Object.keys(techTree).length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Points de recherche:</span>
            <span className="stat-value research-points">
              {Math.floor(resources.research_points)}
            </span>
          </div>
        </div>
      </div>

      <div className="tech-tree">
        {Object.entries(techsByTier)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([tier, techs]) => (
          <div key={tier} className="tech-tier">
            <div className="tier-header">
              <h3>Tier {tier}</h3>
              <div className="tier-progress">
                {techs.filter(tech => unlockedTech.includes(tech.key)).length}/{techs.length}
              </div>
            </div>
            
            <div className="tier-techs">
              {techs.map(tech => {
                const status = getTechStatus(tech.key);
                const canUnlock = canUnlockTech(tech.key);
                
                return (
                  <div 
                    key={tech.key}
                    className={`tech-node ${status.status} ${canUnlock ? 'pulsing' : ''}`}
                  >
                    <div className="tech-content">
                      <div className="tech-header">
                        <h4>{tech.name}</h4>
                        <div 
                          className={`status-indicator ${status.status}`}
                          style={{ backgroundColor: status.color }}
                        />
                      </div>
                      
                      <p className="tech-description">{tech.description}</p>
                      
                      {/* Prérequis */}
                      {tech.prerequisites.length > 0 && (
                        <div className="prerequisites">
                          <span className="section-label">Prérequis:</span>
                          <div className="prereq-list">
                            {tech.prerequisites.map(prereq => (
                              <span 
                                key={prereq}
                                className={`prereq ${unlockedTech.includes(prereq) ? 'met' : 'unmet'}`}
                              >
                                {unlockedTech.includes(prereq) ? '✅' : '❌'} 
                                {techTree[prereq]?.name || prereq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Coût */}
                      <div className="tech-cost">
                        <span className="section-label">Coût:</span>
                        <div className="cost-list">
                          {Object.entries(tech.cost).map(([resource, amount]) => {
                            const hasEnough = resources[resource] >= amount;
                            return (
                              <div 
                                key={resource}
                                className={`cost-item ${hasEnough ? 'affordable' : 'expensive'}`}
                              >
                                <span className="resource-name">
                                  {resource.replace('_', ' ')}:
                                </span>
                                <span className="cost-amount">
                                  {amount}
                                </span>
                                <span className="current-amount">
                                  ({resources[resource] || 0})
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Débloque */}
                      <div className="unlocks">
                        <span className="section-label">Débloque:</span>
                        <div className="unlock-list">
                          {tech.unlocks.map(unlock => (
                            <span key={unlock} className="unlock-item">
                              🔓 {unlock.replace('_', ' ').replace('mk', 'Mk.')}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bouton de recherche */}
                      <button
                        onClick={() => unlockTechnology(tech.key)}
                        disabled={!canUnlock}
                        className={`research-btn ${canUnlock ? 'available' : 'unavailable'}`}
                      >
                        {status.status === 'unlocked' ? '✅ Recherché' :
                         canUnlock ? '🔬 Rechercher' : 
                         status.text}
                      </button>
                    </div>
                    
                    {/* Lignes de connexion vers les prérequis */}
                    {tech.prerequisites.length > 0 && (
                      <div className="connection-lines">
                        {tech.prerequisites.map(prereq => (
                          <div 
                            key={prereq} 
                            className={`connection ${unlockedTech.includes(prereq) ? 'active' : 'inactive'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechTree;
