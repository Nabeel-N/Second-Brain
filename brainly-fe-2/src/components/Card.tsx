import { ShareIcon } from "../icons/ShareIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
  id: string;
  children?: React.ReactNode;
  onDelete: () => void;
}
export function Card({ title, link, type, children, onDelete }: CardProps) {
  return (
    <div className="transition-transform transform hover:scale-105">
      {/* Card Container */}
      <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          {/* Title */}
          <div
            className="flex items-center text-center text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl px-2 py-2 shadow-lg"
            title={title}
          >
            {title}
          </div>
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-1 transition-colors duration-200"
            >
              <DeleteIcon />
            </button>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg p-2 transition-colors duration-200"
            >
              <ShareIcon />
            </a>
          </div>
        </div>
        {/* Content Section */}
        <div className="pt-3">
          {type === "youtube" && (
            <iframe
              className="w-full rounded-md aspect-video"
              src={link.replace("watch", "embed").replace("?v=", "/")}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
          {type === "twitter" && (
            <blockquote className="twitter-tweet">
              <a href={link.replace("x.com", "twitter.com")}></a>
            </blockquote>
          )}
        </div>
      </div>
      {/* Footer Section */}
      <div className="flex justify-end mt-2">{children}</div>
    </div>
  );
}