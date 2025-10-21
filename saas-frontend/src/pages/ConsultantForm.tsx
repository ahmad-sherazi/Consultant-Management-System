import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "../utils/supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";

interface ConsultantFormData {
  consultation_type: string;
  hourly_rate: string;
  experience_years: string;
  available_time: string;
  picture: string;
}

const ConsultantForm = () => {
  const [formData, setFormData] = useState<ConsultantFormData>({
    consultation_type: "",
    hourly_rate: "",
    experience_years: "",
    available_time: "",
    picture: "",
  });

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      const user = session?.user;

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      const { data: profile, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user role:", error);
        setMessage("Could not fetch profile. Please login again.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
        return;
      }

      if (!profile?.role) {
        console.warn("No role found, letting user continue for now.");
      }

      if (profile?.role !== "consultant") {
        setMessage("Access denied: Only consultants can fill this form.");
        setTimeout(() => navigate("/", { replace: true }), 2000);
        return;
      }

   
      const isNew = Boolean((location.state as any)?.new);
      if (!isNew) {
        const { data: existing } = await supabase
          .from("consultants")
          .select(
            "consultation_type, hourly_rate, experience_years, available_time, picture"
          )
          .eq("user_id", user.id)
          .maybeSingle();
        if (existing) {
          setFormData({
            consultation_type: existing.consultation_type || "",
            hourly_rate: existing.hourly_rate?.toString?.() || "",
            experience_years: existing.experience_years?.toString?.() || "",
            available_time: existing.available_time || "",
            picture: existing.picture || "",
          });
        } else {
          setFormData({
            consultation_type: "",
            hourly_rate: "",
            experience_years: "",
            available_time: "",
            picture: "",
          });
        }
      } else {
        
        setFormData({
          consultation_type: "",
          hourly_rate: "",
          experience_years: "",
          available_time: "",
          picture: "",
        });
      }
    };

    checkAuth();

    window.history.pushState(null, "", window.location.href);
    const handleBack = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return setMessage("User not found. Please login again.");

    const fileName = `${user.id}-${Date.now()}-${file.name}`;
    setMessage("Uploading image...");

    const { error: uploadError } = await supabase.storage
      .from("consultant-pictures")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      return setMessage("Error uploading image.");
    }

    const { data: publicUrlData } = supabase.storage
      .from("consultant-pictures")
      .getPublicUrl(fileName);

    setFormData((prev) => ({ ...prev, picture: publicUrlData.publicUrl }));
    setMessage("Image uploaded successfully!");
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setMessage("User not logged in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("consultants")
      .upsert(
        {
          user_id: user.id,
          email: user.email,
          consultation_type: formData.consultation_type,
          hourly_rate: Number(formData.hourly_rate),
          experience_years: Number(formData.experience_years),
          available_time: formData.available_time,
          picture: formData.picture,
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error(error);
      setMessage("Error saving profile. Try again.");
    } else {
      setMessage("Profile saved successfully! Redirecting...");
      setTimeout(() => navigate("/consultants", { replace: true }), 800);
    }

    setLoading(false);
  };

  
  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    navigate("/", { replace: true });
  };

  if (!formData)
    return <p className="text-center text-white mt-10">Loading form...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15)_0%,transparent_70%)] blur-3xl" />
      <div className="relative w-full max-w-lg p-8 rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Consultant Profile</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="consultation_type"
            list="consultation-options"
            placeholder="Consultation Type (e.g. Business, IT, Health)"
            value={formData.consultation_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-white outline-none"
          />
          <datalist id="consultation-options">
            <option value="Business" />
            <option value="Finance" />
            <option value="Marketing" />
            <option value="IT" />
            <option value="Web Development" />
            <option value="Graphic Design" />
            <option value="Legal" />
            <option value="Health" />
            <option value="Coaching" />
            <option value="SEO" />
          </datalist>

          <input
            name="hourly_rate"
            type="number"
            placeholder="Hourly Rate ($)"
            value={formData.hourly_rate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-white outline-none"
          />

          <input
            name="experience_years"
            type="number"
            placeholder="Years of Experience"
            value={formData.experience_years}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-white outline-none"
          />

          <textarea
            name="available_time"
            placeholder="Available Days/Times"
            value={formData.available_time}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-white outline-none"
          />

          <div className="flex flex-col items-center justify-center">
            <label className="text-sm text-gray-300 mb-2">
              Upload Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-gray-200 cursor-pointer"
            />
            {formData.picture && (
              <img
                src={formData.picture}
                alt="Preview"
                className="mt-4 w-24 h-24 rounded-full object-cover border border-white/20 shadow-md"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-white/10 border-white/20 hover:bg-white hover:text-black rounded-xl font-semibold shadow-md transition-all"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm bg-white/10 py-2 rounded-xl border border-white/10">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConsultantForm;
