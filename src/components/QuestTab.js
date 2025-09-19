import React from 'react';

const QuestTab = ({ quests, character, resources, completeQuest }) => {
  
  // Vérifier si un objectif est complété
  const isObjectiveComplete = (objective) => {
    switch (objective.type) {
      case 'mine':
        return objective.current >= objective.amount;
      case 'level':
        return character[objective.skill].level >= objective.level;
      case 'craft':
        return objective.current >= objective.amount;
      case 'kill_any':
        return objective.current >= objective.amount;
      default:
        return false;
    }
  };

  // Vérifier si une quête est complète
  const isQuestComplete = (quest) => {
    return quest.objectives.every(isObjectiveComplete);
  };

  // Calculer le pourcentage de progression d'une quête
  const getQuestProgress = (quest) => {
    const completedObjectives = quest.objectives.filter(isObjectiveComplete).length;
    return (completedObjectives / quest.objectives.length) * 100;
  };

  // Séparer les quêtes par statut
  const activeQuests = Object.values(quests).filter(quest => !quest.completed);
  const completedQuests = Object.values(quests).filter(quest => quest.completed);

  return (
    <div className="quest-tab">
      <div className="quest-header">
        <h2>📜 Quests</h2>
        <p>Complete quests to earn rewards and unlock new content!</p>
        
        <div className="quest-stats">
          <div className="stat">📝 Active: {activeQuests.length}</div>
          <div className="stat">✅ Completed: {completedQuests.length}</div>
        </div>
      </div>

      {/* Active Quests */}
      <div className="active-quests">
        <h3>🎯 Active Quests</h3>
        
        {activeQuests.length === 0 ? (
          <div className="no-quests">
            <p>🎉 All quests completed! New quests will unlock as you progress.</p>
          </div>
        ) : (
          <div className="quests-list">
            {activeQuests.map(quest => (
              <div key={quest.id} className="quest-card">
                <div className="quest-header-section">
                  <div className="quest-title">{quest.name}</div>
                  <div className="quest-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${getQuestProgress(quest)}%` }}
                      />
                    </div>
                    <span className="progress-text">
                      {quest.objectives.filter(isObjectiveComplete).length}/{quest.objectives.length}
                    </span>
                  </div>
                </div>

                <div className="quest-description">
                  {quest.description}
                </div>

                <div className="quest-objectives">
                  <h4>📋 Objectives</h4>
                  {quest.objectives.map((objective, index) => (
                    <div 
                      key={index} 
                      className={`objective ${isObjectiveComplete(objective) ? 'completed' : ''}`}
                    >
                      <div className="objective-icon">
                        {isObjectiveComplete(objective) ? '✅' : '◯'}
                      </div>
                      <div className="objective-text">
                        {objective.type === 'mine' && `Mine ${objective.amount} ${objective.target}`}
                        {objective.type === 'level' && `Reach ${objective.skill} level ${objective.level}`}
                        {objective.type === 'craft' && `Craft ${objective.amount} ${objective.target}`}
                        {objective.type === 'kill_any' && `Defeat ${objective.amount} enemies`}
                      </div>
                      <div className="objective-progress">
                        {objective.type === 'level' 
                          ? `${character[objective.skill].level}/${objective.level}`
                          : `${objective.current}/${objective.amount}`
                        }
                      </div>
                    </div>
                  ))}
                </div>

                <div className="quest-rewards">
                  <h4>🎁 Rewards</h4>
                  <div className="rewards-list">
                    {quest.rewards.xp && (
                      <div className="reward-item">🌟 {quest.rewards.xp} XP</div>
                    )}
                    {quest.rewards.gold && (
                      <div className="reward-item">💰 {quest.rewards.gold} Gold</div>
                    )}
                    {quest.rewards.items && quest.rewards.items.map(item => (
                      <div key={item} className="reward-item">🎒 {item}</div>
                    ))}
                    {quest.rewards.unlock && (
                      <div className="reward-item unlock">🔓 Unlock: {quest.rewards.unlock}</div>
                    )}
                  </div>
                </div>

                {isQuestComplete(quest) && (
                  <button 
                    className="complete-quest-btn"
                    onClick={() => completeQuest(quest.id)}
                  >
                    ✅ Complete Quest
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div className="completed-quests">
          <h3>✅ Completed Quests</h3>
          
          <div className="completed-list">
            {completedQuests.map(quest => (
              <div key={quest.id} className="quest-card completed">
                <div className="quest-title">{quest.name}</div>
                <div className="quest-description">{quest.description}</div>
                <div className="completion-badge">✅ Completed</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestTab;
