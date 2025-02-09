import React from "react";

interface SidebarItemProps {
  text: string;
  icon: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SidebarItem({ text, icon, className, onClick }: SidebarItemProps) {
  return (
    <div
      className={`flex items-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      {icon && <div className="mr-2">{icon}</div>}
      <span>{text}</span>
    </div>
  );
}