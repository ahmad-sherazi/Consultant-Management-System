import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { resolvePublicImageUrl } from "../utils/media";

interface ConsultantProfile {
  user_id: string;
  consultation_type?: string;
  hourly_rate?: number;
  experience_years?: number;
  available_time?: string;
  picture?: string;
}

const ClientDashboard: React.FC = () => {
  const [consultants, setConsultants] = useState<ConsultantProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        navigate("/", { replace: true });
      } else {
        fetchConsultants();
      }
    };
    checkSession();
  }, [navigate]);

  const fetchConsultants = async () => {
    const { data, error } = await supabase.from("consultants").select("*");
    if (error) console.error("Error fetching consultants:", error);
    else setConsultants(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    navigate("/", { replace: true }); 
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-lg">Loading consultants...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-wide text-gray-900">Client Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-900 hover:bg-black text-white text-sm px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </header>

      <h2 className="text-2xl mb-6 font-semibold text-gray-800">
        Available Consultants
      </h2>

      {consultants.length === 0 ? (
        <div className="text-center text-gray-600">
          No consultants available yet.
        </div>
      ) : (
        <>
        
          <div className="flex gap-6 overflow-x-auto scrollbar-hide md:hidden -mx-4 px-4">
          {consultants.map((c) => (
            <div
              key={c.user_id}
                className="flex-shrink-0 w-[250px] bg-white rounded-2xl overflow-hidden shadow-none p-0"
            >
                
                <div className="relative w-full h-64 cursor-pointer overflow-hidden group">
              <img
                    src={resolvePublicImageUrl(c.picture)}
                alt={c.consultation_type || "Consultant"}
                    className="w-full h-full object-cover rounded-t-2xl rounded-b-2xl transform transition duration-500 group-hover:scale-105 group-hover:shadow-2xl"
                  />
                </div>

                <div className="px-4 py-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold truncate text-gray-900">
                {c.consultation_type || "Consultant"}
              </h3>
                      <div className="flex items-center ml-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium ml-1">New</span>
                      </div>
                    </div>

          
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        {c.consultation_type || "General"}
                      </span>
                      {c.available_time && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-green-100 text-green-700">
                          Available
                        </span>
                      )}
                    </div>

                    
                    <div className="flex items-center justify-between text-sm text-gray-700 mt-2">
                      <span className="font-medium">
                        ${c.hourly_rate || "N/A"}{" "}
                        <span className="text-gray-500">/ session</span>
                      </span>
                      <span>{c.experience_years || 0}+ yrs</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {consultants.map((c) => (
              <div
                key={c.user_id}
                className="bg-white rounded-2xl overflow-hidden shadow-none p-0"
              >
              
                <div className="relative w-full h-64 cursor-pointer overflow-hidden group">
                  <img
                    src={resolvePublicImageUrl(c.picture)}
                    alt={c.consultation_type || "Consultant"}
                    className="w-full h-full object-cover rounded-t-2xl rounded-b-2xl transform transition duration-500 group-hover:scale-105 group-hover:shadow-2xl"
                  />
                </div>

                <div className="px-4 py-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold truncate text-gray-900">
                        {c.consultation_type || "Consultant"}
                      </h3>
                      <div className="flex items-center ml-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium ml-1">New</span>
                      </div>
                    </div>

                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        {c.consultation_type || "General"}
                      </span>
                      {c.available_time && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-green-100 text-green-700">
                          Available
                        </span>
                      )}
                    </div>

                   
                    <div className="flex items-center justify-between text-sm text-gray-700 mt-2">
                      <span className="font-medium">
                        ${c.hourly_rate || "N/A"}{" "}
                        <span className="text-gray-500">/ session</span>
                      </span>
                      <span>{c.experience_years || 0}+ yrs</span>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

export default ClientDashboard;
