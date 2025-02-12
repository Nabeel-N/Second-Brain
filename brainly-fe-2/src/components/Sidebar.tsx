import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
  onTwitterClick: () => void;
  onYoutubeClick: () => void;
  onClearFilter: () => void;
}

export function Sidebar({
  className,
  isMobile,
  onClose,
  onTwitterClick,
  onYoutubeClick,
  onClearFilter,
}: SidebarProps) {
  return (
    <div
      className={`h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 text-gray-300 border-r border-gray-700 w-72 fixed left-0 top-0 pl-6 ${
        isMobile ? "md:hidden" : "hidden md:block"
      } ${className || ""}`}
    >
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl focus:outline-none"
          aria-label="Close sidebar"
        >
          &times;
        </button>
      )}
      <div className="flex text-2xl pt-8 items-center">
        <div className="pr-2 text-red-500">
          <Logo />
        </div>
        <span className="text-white">Brainly</span>
      </div>
      <div className="pt-8 pl-4">
        <SidebarItem
          text="All"
          icon={<span className="text-gray-300">🌐</span>}
          className="text-gray-300 hover:text-indigo-300 p-2 rounded-md hover:bg-indigo-700"
          onClick={onClearFilter}
        />
        <SidebarItem
          text="Twitter"
          icon={<TwitterIcon className="text-gray-300" />}
          className="text-gray-300 hover:text-indigo-300 p-2 rounded-md hover:bg-indigo-700"
          onClick={onTwitterClick}
        />
        <SidebarItem
          text="YouTube"
          icon={<YoutubeIcon className="text-gray-300" />}
          className="text-gray-300 hover:text-indigo-300 p-2 rounded-md hover:bg-indigo-700"
          onClick={onYoutubeClick}
        />
      </div>
    </div>
  );
}
