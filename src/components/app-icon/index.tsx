import React from "react";

interface AppIconProps {
  onClick?: () => void;
}

export const AppIcon: React.FC<AppIconProps> = ({ onClick }) => {
  return (
    <svg
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13.789.422a4 4 0 0 0-3.578 0l-8 4A4 4 0 0 0 0 8v8a4 4 0 0 0 2.211 3.578l8 4a4 4 0 0 0 3.578 0l8-4A4 4 0 0 0 24 16V8a4 4 0 0 0-2.211-3.578l-8-4ZM8 8a4 4 0 1 1 8 0v8a4 4 0 0 1-8 0V8Z"
        clipRule="evenodd"
      />
      <path fill="currentColor" d="M14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </svg>
  );
};
