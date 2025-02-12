import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Sidebar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { SearchBar } from "../components/SearchBar";

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}

interface Content {
  _id: string;
  title: string;
  link: string;
  type: ContentType;
}

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const { contents, refresh } = useContent();
  const [filteredContents, setFilteredContents] = useState<Content[]>(contents);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update filtered contents whenever `contents`, `searchQuery`, or `selectedType` changes
  useEffect(() => {
    setFilteredContents(
      (contents as Content[]).filter((content) => {
        const queryWords = searchQuery
          .toLowerCase()
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        const matchesSearch = queryWords.every(
          (word) =>
            content.title.toLowerCase().includes(word) ||
            content.link.toLowerCase().includes(word)
        );
        const matchesType = selectedType ? content.type === selectedType : true;
        return matchesSearch && matchesType;
      })
    );
  }, [contents, searchQuery, selectedType]);

  // Refresh content when the modal is closed
  useEffect(() => {
    refresh();
  }, [modalOpen]);

  // Handle content deletion
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content`, {
        data: { contentId: id },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setFilteredContents((prevContents) =>
        prevContents.filter((content) => content._id !== id)
      );
    } catch (error) {
      console.log("Error deleting the content", error);
    }
  };

  // Handle search input changes
  const handleChange = (value: string) => {
    setSearchQuery(value.trim());
  };

  // Handle sidebar item clicks (also closes the mobile sidebar)
  const handleSidebarItemClick = (type: ContentType | null) => {
    setSelectedType(type);
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 min-h-screen relative">
      {/* Mobile Header with toggle button */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 shadow-md">
        <div className="text-xl font-semibold">Dashboard</div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md bg-gray-200"
          aria-label="Open sidebar"
        >
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar
          onTwitterClick={() => handleSidebarItemClick(ContentType.Twitter)}
          onYoutubeClick={() => handleSidebarItemClick(ContentType.Youtube)}
          onClearFilter={() => handleSidebarItemClick(null)}
        />
      </div>

      {/* Sidebar for Mobile (toggle overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <Sidebar
            isMobile
            onClose={() => setSidebarOpen(false)}
            onTwitterClick={() => handleSidebarItemClick(ContentType.Twitter)}
            onYoutubeClick={() => handleSidebarItemClick(ContentType.Youtube)}
            onClearFilter={() => handleSidebarItemClick(null)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:ml-72 min-h-screen bg-white rounded-t-3xl md:rounded-t-none md:rounded-l-3xl shadow-lg transition-all duration-300">
        {/* Modal */}
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Search Bar */}
          <SearchBar onChange={handleChange} value={searchQuery} />

          {/* Buttons Container */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {/* Add Content Button */}
            <Button
              className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md hover:from-violet-600 hover:to-indigo-700 transition-all duration-200"
              onClick={() => setModalOpen(true)}
              variant="primary"
              text="Add Content"
              startIcon={<PlusIcon />}
            />

            {/* Share Brain Button */}
            <Button
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
              onClick={async () => {
                try {
                  const response = await axios.post(
                    `${BACKEND_URL}/api/v1/brain/share`,
                    { share: true },
                    {
                      headers: {
                        Authorization: localStorage.getItem("token"),
                      },
                    }
                  );
                  const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
                  await navigator.clipboard.writeText(shareUrl);
                  alert("Share URL copied to clipboard");
                } catch (error) {
                  console.error("Error sharing brain:", error);
                  alert("Failed to share. Please try again.");
                }
              }}
              variant="secondary"
              text="Share Brain"
              startIcon={<ShareIcon />}
            />
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredContents.map(({ type, link, title, _id }) => (
            <Card
              key={_id}
              id={_id}
              type={type}
              link={link}
              title={title}
              onDelete={() => handleDelete(_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}