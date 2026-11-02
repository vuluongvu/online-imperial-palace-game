import React, { useEffect, useState } from 'react';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { useGameStore } from '../../stores/useGameStore';
import { getNpcDialogue, DialogueChoice } from '../../data/npcDialogues';
import { INTERACTABLE_ENTITIES } from '../../data/palaceGameplayData';

export const NpcDialogue: React.FC = () => {
  const activeInteractableId = useGameplayStore((s) => s.activeInteractableId);
  const interactionView = useGameplayStore((s) => s.interactionView);
  const closeInteraction = useGameplayStore((s) => s.closeInteraction);
  const showInteractionPanel = useGameplayStore((s) => s.showInteractionPanel);
  const currentQuestStep = useGameplayStore((s) => s.currentQuestStep);
  const handleLaiBoQuestInteraction = useGameplayStore(
    (s) => s.handleLaiBoQuestInteraction
  );
  const navigateToLandmark = useGameStore((s) => s.navigateToLandmark);

  // Hiệu ứng typewriter xuất hiện chữ tự nhiên
  const [displayedText, setDisplayedText] = useState('');

  const entity = INTERACTABLE_ENTITIES.find((e) => e.id === activeInteractableId);

  // Chỉ hiển thị NpcDialogue khi activeInteractable là NPC và interactionView === 'dialogue'
  const isNpcDialogueVisible =
    Boolean(entity && entity.type === 'npc' && interactionView === 'dialogue');

  const dialogue = entity ? getNpcDialogue(entity.id, currentQuestStep) : null;
  const fullQuote = dialogue?.quote ?? '';

  useEffect(() => {
    if (!isNpcDialogueVisible) {
      setDisplayedText('');
      return;
    }

    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      i += 2;
      if (i >= fullQuote.length) {
        setDisplayedText(fullQuote);
        clearInterval(timer);
      } else {
        setDisplayedText(fullQuote.slice(0, i));
      }
    }, 18);

    return () => clearInterval(timer);
  }, [isNpcDialogueVisible, fullQuote]);

  if (!isNpcDialogueVisible || !dialogue || !entity) return null;

  const handleChoiceClick = (choice: DialogueChoice) => {
    if (choice.action === 'close') {
      closeInteraction();
    } else if (choice.action === 'accept_quest') {
      if (entity.buildingId === 'lai_bo') {
        handleLaiBoQuestInteraction();
      } else if (entity.buildingId === 'cong_chinh') {
        navigateToLandmark('lai_bo');
      }
      closeInteraction();
    } else if (choice.action === 'open_panel') {
      showInteractionPanel(choice.targetTab ?? entity.defaultTab);
    }
  };

  return (
    <div className="npc-dialogue-overlay" onClick={closeInteraction}>
      <div
        className="npc-dialogue-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="npc-dialogue-portrait-side">
          <div className="npc-dialogue-avatar-box">
            <span className="npc-portrait-symbol">{dialogue.portrait}</span>
          </div>
          <span className="npc-rank-badge">{entity.title}</span>
        </div>

        <div className="npc-dialogue-content-side">
          <div className="npc-name-header">
            <h3 className="npc-name">{entity.name}</h3>
            <button
              type="button"
              className="npc-close-btn"
              onClick={closeInteraction}
              title="Đóng (ESC)"
            >
              ✕
            </button>
          </div>

          <div className="npc-speech-bubble">
            <p className="npc-quote-text">{displayedText}</p>
          </div>

          <div className="npc-choices-row">
            {dialogue.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className="npc-choice-btn"
                onClick={() => handleChoiceClick(choice)}
              >
                <span className="choice-bullet">❯</span>
                <span>{choice.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
