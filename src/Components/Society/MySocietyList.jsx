import Navbar from "../Navbar";
import { useQuery } from "@tanstack/react-query";
import { getmySocieties } from "../../API/api";
import { useNavigate } from "react-router-dom";

const MySocietyList = () => {
  const navigate = useNavigate();
  const handleLeave = (e, id) => {
    e.stopPropagation(); // Prevent card click navigation
    console.log("Leaving society:", id);
  };

  // VIEW BUTTON FUNCTION
  const handleView = (e, id) => {
    e.stopPropagation();
    navigate(`/society/${id}`);
  };
  const { data: mySocietyData } = useQuery({
    queryKey: ["mysocietylist"],
    queryFn: getmySocieties,
  });

 

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Unknown";
    const now = new Date();
    const past = new Date(dateString);
    const diff = (now - past) / 1000;

    const min = Math.floor(diff / 60);
    const hr = Math.floor(diff / 3600);
    const day = Math.floor(diff / 86400);

    if (diff < 60) return "Just now";
    if (min < 60) return `${min} minutes`;
    if (hr < 24) return `${hr} hours`;
    return `${day} days`;
  };

  return (
    <div className="bg-gray-100">
      <section className="py-7">
        <Navbar />
      </section>

      <section className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Society</h1>
        </div>

        {/* Your Societies */}
        <div className="flex items-center justify-between mt-5">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Your Societies</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mySocietyData?.results?.map((society) => (
            <div
              key={society.id}
              className="bg-gray-50 rounded-lg shadow-md p-4 flex flex-col items-center text-center"
            >
              <img
                src={
                  society.cover_picture ||
                  society.cover_image ||
                  society.creator?.profile_image ||
                  "/placeholder.svg"
                }
                alt={society.name}
                className="w-24 h-24 mb-2 object-cover"
              />
              <h3 className="text-lg sm:text-xl font-semibold">
                {society.name}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Last Active {formatRelativeTime(society.updated_at)} ago
              </p>
              <div className="flex justify-between space-x-2 mt-2">
                <button
                  onClick={(e) => handleLeave(e, society.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
                >
                  Leave
                </button>
                <button
                  onClick={(e) => handleView(e, society.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

      
      </section>
    </div>
  );
};

export default MySocietyList;
