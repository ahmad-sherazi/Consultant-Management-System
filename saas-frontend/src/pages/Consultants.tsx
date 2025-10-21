import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { resolvePublicImageUrl } from "../utils/media";

interface ConsultantRow {
  user_id: string;
  email?: string;
  consultation_type?: string;
  hourly_rate?: number;
  experience_years?: number;
  available_time?: string;
  picture?: string;
}

const Consultants: React.FC = () => {
  const [consultants, setConsultants] = useState<ConsultantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      const user = session?.user;
      setCurrentUserId(user?.id || null);

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = profile?.role || null;
      setCurrentRole(role);

        if (role === "consultant") {
        const { data: existing } = await supabase
          .from("consultants")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!existing) {
          navigate("/consultant-form", { replace: true });
          return;
        }
      }

      const { data, error } = await supabase
        .from("consultants")
        .select(
          "user_id, email, consultation_type, hourly_rate, experience_years, available_time, picture"
        )
        .order("user_id", { ascending: true });

      if (!error && data) setConsultants(data);
      setLoading(false);
    };

    load();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
        <p className="text-lg">Loading consultants...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-wide text-gray-900">Consultants</h1>
        <div className="flex gap-3">
          {currentRole === "consultant" && (
            <button
              onClick={() => navigate("/consultant-form")}
              className="bg-gray-900 hover:bg-black text-white text-sm px-4 py-2 rounded-lg"
            >
              Edit My Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-gray-900 hover:bg-black text-white text-sm px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {consultants.length === 0 ? (
        <p className="text-gray-600">No consultants available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {consultants.map((c) => {
            const isOwn = currentUserId && c.user_id === currentUserId;
            return (
              <div
                key={c.user_id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition duration-300 hover:-translate-y-1"
              >
               
                <div className="relative w-full h-64 overflow-hidden">
                  <img
                    src={resolvePublicImageUrl(c.picture)}
                    alt={c.consultation_type || "Consultant"}
                    className="w-full h-full object-cover"
                  />
                </div>

              
                <div className="px-4 py-4">
                  <h3 className="text-lg font-semibold truncate text-gray-900 mb-1">
                    {c.consultation_type || "Consultant"}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-2">
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

                  
                  {isOwn && currentRole === "consultant" && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => navigate("/consultant-form")}
                        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Consultants;
