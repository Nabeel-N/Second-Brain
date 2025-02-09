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
  const [selectedType, setSelectedType] = useState<ContentType | null>(null); // Track selected content type
  const { contents, refresh } = useContent();
  const [filteredContents, setFilteredContents] = useState<Content[]>(contents);

  // Update filtered contents whenever `contents`, `searchQuery`, or `selectedType` changes
  useEffect(() => {
    setFilteredContents(
      (contents as Content[]).filter((content) => {
        // Filter by search query
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

        // Filter by selected type
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
  const handlechange = (value: string) => {
    setSearchQuery(value.trim());
  };

  // Handle sidebar item clicks
  const handleSidebarItemClick = (type: ContentType | null) => {
    setSelectedType(type); // Set the selected type (or null to show all)
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 min-h-screen">
      {/* Sidebar */}
      <Sidebar
        className="w-full md:w-72 bg-white shadow-lg"
        onTwitterClick={() => handleSidebarItemClick(ContentType.Twitter)}
        onYoutubeClick={() => handleSidebarItemClick(ContentType.Youtube)}
        onClearFilter={() => handleSidebarItemClick(null)} // Clear filter
      />

      {/* Main Content Area */}
      <div className="p-6 md:ml-72 min-h-screen bg-white rounded-t-3xl md:rounded-t-none md:rounded-l-3xl shadow-lg">
        {/* Modal */}
        <CreateContentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Search Bar */}
          <SearchBar onChange={handlechange} value={searchQuery} />

          {/* Buttons Container */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-5">
            {/* Add Content Button */}
            <Button
              className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-center font-semibold py-3 px-3 rounded-xl shadow-md hover:from-violet-600 hover:to-indigo-700 transition-all duration-200"
              onClick={() => {
                setModalOpen(true);
              }}
              variant="primary"
              text="Add Content"
              startIcon={<PlusIcon />}
            />
            {/* Share Brain Button */}
            <Button
              className="bg-emerald-600 py-3 px-3 text-center text-white font-semibold rounded-xl shadow-md hover:bg-emerald-800 transition-all duration-200"
              onClick={async () => {
                const response = await axios.post(
                  `${BACKEND_URL}/api/v1/brain/share`,
                  {
                    share: true,
                  },
                  {
                    headers: {
                      Authorization: localStorage.getItem("token"),
                    },
                  }
                );
                const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
                await navigator.clipboard.writeText(shareUrl);
                alert("Share URL copied to clipboard");
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
