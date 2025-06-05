import React from "react";

interface TagChipProps {
  tag: string;
  selected: boolean;
  onToggle: () => void;
  className?: string;
}

export default function TagChip({ tag, selected, onToggle, className = "" }: TagChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`text-xs px-2 py-1 rounded cursor-pointer ${selected ? "bg-pink-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"} ${className}`.trim()}
    >
      #{tag}
    </button>
  );
}
