import { motion, AnimatePresence } from 'framer-motion';
import { PrimaryButton, SecondaryButton } from '../DesignSystem.jsx';

const ModalStyles = () => (
  <style>{`
    .jj-confirm-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(10, 12, 24, 0.5);
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .jj-confirm-card {
      width: 100%;
      max-width: 320px;
      background: var(--jj-white);
      border-radius: 20px;
      padding: 24px;
      text-align: center;
    }

    .jj-confirm-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--jj-text);
      margin: 0 0 8px;
    }

    .jj-confirm-body {
      font-size: 14px;
      font-weight: 400;
      color: var(--jj-text-muted);
      margin: 0 0 20px;
      line-height: 1.5;
    }

    .jj-confirm-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `}</style>
);

function ConfirmLeaveModal({ open, onStay, onLeave }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="jj-confirm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ModalStyles />
          <motion.div
            className="jj-confirm-card"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
          >
            <p className="jj-confirm-title">Leave this conversation?</p>
            <p className="jj-confirm-body">Are you sure? Your progress will be lost.</p>
            <div className="jj-confirm-actions">
              <PrimaryButton onClick={onStay}>Stay</PrimaryButton>
              <SecondaryButton onClick={onLeave}>Leave</SecondaryButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmLeaveModal;
