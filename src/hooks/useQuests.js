import { useCallback } from 'react';

export const useQuests = (quests, setQuests, character, resources) => {
  
  // Vérifier la progression d'une quête
  const checkQuestProgress = useCallback((actionKey, actionData) => {
    setQuests(prevQuests => {
      const newQuests = { ...prevQuests };
      
      Object.values(newQuests).forEach(quest => {
        if (quest.completed) return;
        
        quest.objectives.forEach(objective => {
          switch (objective.type) {
            case 'mine':
              if (actionKey.includes('mine') && actionData.rewards[objective.target]) {
                objective.current = (objective.current || 0) + actionData.rewards[objective.target];
              }
              break;
              
            case 'craft':
              if (actionKey.includes('craft') && actionData.rewards[objective.target]) {
                objective.current = (objective.current || 0) + actionData.rewards[objective.target];
              }
              break;
              
            case 'kill_any':
              if (actionKey.includes('fight')) {
                objective.current = (objective.current || 0) + 1;
              }
              break;
              
            case 'cast_spell':
              if (actionKey === `cast_${objective.spell}`) {
                objective.current = (objective.current || 0) + 1;
              }
              break;
          }
        });
      });
      
      return newQuests;
    });
  }, [setQuests]);

  // Compléter une quête
  const completeQuest = useCallback((questId) => {
    const quest = quests[questId];
    if (!quest || quest.completed) return;

    console.log(`🎉 Quest completed: ${quest.name}`);
    
    // Marquer comme complétée
    setQuests(prev => ({
      ...prev,
      [questId]: { ...prev[questId], completed: true }
    }));

    // Donner les récompenses (cette logique devrait être dans le composant parent)
    return quest.rewards;
  }, [quests, setQuests]);

  // Débloquer une nouvelle quête
  const unlockQuest = useCallback((questId) => {
    // Logique pour débloquer de nouvelles quêtes
    console.log(`🔓 New quest unlocked: ${questId}`);
  }, []);

  return {
    checkQuestProgress,
    completeQuest,
    unlockQuest
  };
};
