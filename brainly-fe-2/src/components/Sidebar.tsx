import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  className?: string;
  onTwitterClick: () => void;
  onYoutubeClick: () => void;
  onClearFilter: () => void; // Clear filter handler
}

export function Sidebar({ className, onTwitterClick, onYoutubeClick, onClearFilter }: SidebarProps) {
  return (
    <div
      className={`h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 text-gray-300 border-r border-gray-700 w-72 fixed left-0 top-0 pl-6 hidden md:block ${
        className || ""
      }`}
    >
      <div className="flex text-2xl pt-8 items-center">
        <div className="pr-2 text-red-500">
          <Logo />
        </div>
        <span className="text-white">Brainly</span>
      </div>
      <div className="pt-8 pl-4">
        
        {/* Clear Filter */}
        <SidebarItem
          text="All"
          icon={<span className="text-gray-300">🌐</span>} // Globe icon for "All"
          className="text-gray-300 hover:text-indigo-300 p-2 rounded-md hover:bg-indigo-700"
          onClick={onClearFilter}
        />
        {/* Twitter Icon */}
        <SidebarItem
          text="Twitter"
          icon={<TwitterIcon className="text-gray-300" />}
          className="text-gray-300 hover:text-indigo-300 p-2 rounded-md hover:bg-indigo-700"
          onClick={onTwitterClick}
        />
        {/* YouTube Icon */}
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