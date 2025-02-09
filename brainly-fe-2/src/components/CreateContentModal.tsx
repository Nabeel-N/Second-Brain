import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}

// Controlled Component
export function CreateContentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    if (!title || !link) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        {
          link,
          title,
          type,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      onClose();
    } catch (error) {
      console.error("Error adding content:", error);
      alert("Failed to add content. Please try again.");
    }
  }

  if (!open) return null;

  return (
    <div>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
        >
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
            >
              <CrossIcon />
            </button>
          </div>

          {/* Title and Link Inputs */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Add Content</h1>
            <Input
              reference={titleRef}
              placeholder="Title"
              className="w-full px-4 py-2 mb-4 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300"
            />
            <Input
              reference={linkRef}
              placeholder="Link"
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300"
            />
          </div>

          {/* Content Type Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Type</h2>
            <div className="flex gap-4 justify-center">
              <Button
                text="YouTube"
                variant={type === ContentType.Youtube ? "primary" : "secondary"}
                onClick={() => setType(ContentType.Youtube)}
                className={`px-6 py-2 rounded-full transition duration-300 ${
                  type === ContentType.Youtube
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              />
              <Button
                text="Twitter"
                variant={type === ContentType.Twitter ? "primary" : "secondary"}
                onClick={() => setType(ContentType.Twitter)}
                className={`px-6 py-2 rounded-full transition duration-300 ${
                  type === ContentType.Twitter
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              text="Submit"
              onClick={addContent}
              className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full shadow-md hover:from-purple-600 hover:to-blue-600 transition duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}