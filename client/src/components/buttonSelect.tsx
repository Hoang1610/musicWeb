import React from "react";
import { motion } from "framer-motion";

interface GlassSegmentedControlProps {
  selected: 0 | 1 | 2;
  onSelect: (option: 0 | 1 | 2) => void;
}
const text = ["Danh sách phát", "Karaoke", "Lời bài hát"];
const options = [0, 1, 2];

export const ButtonSelect: React.FC<GlassSegmentedControlProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="relative flex w-full max-w-lg items-center rounded-full bg-black/40 p-1 backdrop-blur-xl border border-white/10 shadow-2xl">
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <button
            key={option}
            onClick={() => onSelect(option as 0 | 1 | 2)}
            className={`relative z-10 flex-1 py-2.5 text-sm font-semibold transition-colors duration-200 sm:text-base ${
              isSelected ? "text-white" : "text-white/60 hover:text-white/90"
            }`}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {isSelected && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 z-[-1] rounded-full bg-white/20 shadow-inner border border-white/10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {text[option]}
          </button>
        );
      })}
    </div>
  );
};
