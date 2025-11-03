import { motion, AnimatePresence } from "framer-motion";
import "./BottomSheet.css";

const BottomSheet = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="sheet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className="bottom-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Handle bar */}
            <div className="sheet-handle" onClick={onClose}></div>

            {/* Sheet content */}
            <div className="sheet-content">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
