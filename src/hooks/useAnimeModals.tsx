
import { useState } from 'react';

export function useAnimeModals() {
  const [showListModal, setShowListModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  
  return {
    showListModal,
    showProgressModal,
    showScoreModal,
    showRemoveDialog,
    showNotesModal,
    setShowListModal,
    setShowProgressModal,
    setShowScoreModal,
    setShowRemoveDialog,
    setShowNotesModal
  };
}
