import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null)
  const [consultants, setConsultants] = useState<any[]>([]);
  const [errorText, setErrorText] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      const user = session?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      setUserRole(profile?.role || null);

      if (profile?.role === "consultant") {
        const { data: existing } = await supabase
          .from("consultants")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();
        navigate(existing ? "/consultants" : "/consultant-form", { replace: true });
      } else if (profile?.role === "client") {
        navigate("/client-dashboard", { replace: true });
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

 
  useEffect(() => {
    const fetchConsultants = async () => {
      const { data, error } = await supabase
        .from("consultants")
        .select(
          "user_id, email, consultation_type, hourly_rate, experience_years, available_time, picture"
        );

      if (error) {
        setErrorText(error.message);
        setConsultants([]);
      } else if (data) {
        
        const consultantsWithImages = data.map((c) => ({
          ...c,
          pictureUrl: c.picture || "/default-avatar.png",
        }));
        setConsultants(consultantsWithImages);
      }
      console.log(data, "cons");
    };

    fetchConsultants();
  }, []);

  if (loading) return <p className="text-center mt-20 text-gray-900">Loading...</p>;

  return (
    <div className="min-h-screen bg-white">
      {/* ===================== NEW HERO SECTION ===================== */}
      <div className="relative w-full h-screen overflow-hidden">
        <div className="w-full h-full bg-[url('/landing.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/50" />

        <nav className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-8 py-4">
          <Link to="/" className="text-white text-4xl font-semibold">ConsultPro</Link>

          <div className="hidden md:flex items-center space-x-6 text-white">
            <a className="hover:text-gray-200 transition cursor-pointer">Become an Expert</a>
            <a className="hover:text-gray-200 transition cursor-pointer">Our Mission</a>
            <Link to="/login" className="text-white bg-transparent hover:bg-transparent focus:bg-transparent transform transition-transform text-xl hover:scale-105">
              Sign in
            </Link>
            <Link to="/login" className="rounded-full bg-white text-md text-black px-5 hover:scale-105 transition hover:bg-gray-300 py-2">
              Get started
            </Link>
          </div>
        </nav>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
          <div className="inline-block text-xs font-semibold px-4 py-2 rounded-full bg-white/20 text-white mb-4">Trusted by 10,000+ professionals</div>
          <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl mb-6 animate-pulse-text">
            Connect with expert consultants <span className="text-yellow-200">instantly</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl">
            Book personalized video consultations with verified professionals. Get expert advice, solve problems, and
            grow your business with one-on-one guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="h-12 px-8 bg-white text-black rounded-lg flex items-center justify-center font-semibold hover:bg-gray-100">
              Start consulting →
            </Link>
            <Link to="/login" className="h-12 px-8 bg-transparent text-white border border-white rounded-lg flex items-center justify-center hover:bg-white hover:text-black">
              Browse experts
            </Link>
          </div>
        </div>
      </div>
      {/* ===================== END HERO SECTION ===================== */}

      
      <section className="bg-[#111] py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              
              <span className="text-white text-3xl md:text-3xl font-normal font-serif tracking-wider px-8 flex-shrink-0">
                Trusted by top global publications
              </span>
              <span className="text-white text-3xl md:text-3xl font-normal font-sans tracking-wider px-8 flex-shrink-0">
                Featured in leading media outlets
              </span>
              <span className="text-white text-3xl md:text-3xl font-normal font-mono tracking-wider px-8 flex-shrink-0">
                Recognized by industry leaders
              </span>
              <span className="text-white text-3xl md:text-3xl font-normal font-cursive tracking-wider px-8 flex-shrink-0">
                Endorsed by experts worldwide
              </span>
              <span className="text-white text-3xl md:text-3xl font-normal font-serif tracking-wider px-8 flex-shrink-0">
                Trusted and recommended globally
              </span>
              <span className="text-white text-3xl md:text-3xl font-normal font-sans tracking-wider px-8 flex-shrink-0">
                Featured in top publications
              </span>

             
              <span className="text-white text-3xl md:text-3xl font-normal font-serif tracking-wider px-8 flex-shrink-0">
                Trusted by top global publications
              </span>
              <span className="text-white text-3xl md:text-3xl font-normal font-sans tracking-wider px-8 flex-shrink-0">
                Featured in leading media outlets
              </span>
              <span className="text-white text-3xl md:text-3xl font-normal font-mono tracking-wider px-8 flex-shrink-0">
                Recognized by industry leaders
              </span>
              <span className="text-white text-3xl md:text-3xl font-normal font-cursive tracking-wider px-8 flex-shrink-0">
                Endorsed by experts worldwide
              </span>
              <span className="text-white text-3xl md:text-3xl font-normal font-serif tracking-wider px-8 flex-shrink-0">
                Trusted and recommended globally
              </span>
              <span className="text-white text-3xl md:text-3xl font-normal font-sans tracking-wider px-8 flex-shrink-0">
                Featured in top publications
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Benefits Section with Bigger Blocks */}
      <section className="py-0">
        <div className="grid grid-cols-1 md:grid-cols-3 text-center md:text-left">
          {/* Block 1 */}
          <div className="bg-blue-50 p-16 min-h-[300px] md:min-h-[400px] flex items-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">
                Get access to the world's best
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Choose from our list of the top experts in a variety of topics
              </p>
            </div>
          </div>

         
          <div className="bg-green-50 p-16 min-h-[300px] md:min-h-[400px] flex items-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">
                Personalized advice just for you
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Book a 1-on-1 virtual session & get advice that is tailored to you
              </p>
            </div>
          </div>

        
          <div className="bg-yellow-50 p-16 min-h-[300px] md:min-h-[400px] flex items-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-3xl font-semibold text-gray-900 mb-6">
                Save time and money, guaranteed
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our guarantee — find value in your first session or your money back
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Consultants Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Featured Consultants
          </h2>

          {consultants && consultants.length > 0 ? (
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-6">
                {consultants.map((c) => (
                  <div
                    key={c.user_id || c.id}
                    className="transition-shadow duration-300 ease-in-out rounded-2xl overflow-hidden flex-shrink-0 w-[250px] sm:w-[260px] md:w-[270px] bg-white border-none shadow-lg hover:shadow-xl"
                  >
                   
                    <div className="relative w-full h-96 bg-gray-200 rounded-2xl overflow-hidden cursor-pointer transform transition duration-500 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(0,0,0,0.2),0_8px_10px_rgba(0,0,0,0.1)] -mb-4">
                      <img
                        src={c.pictureUrl}
                        alt={c.consultation_type || "Consultant"}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 bg-white text-gray-900 text-xs font-medium px-2.5 py-1 rounded-md shadow">
                        Top Expert
                      </span>
                    </div>

                    <div className="px-4 py-4 pt-0 mt-6">
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
            </div>
          ) : (
            <div className="text-center text-gray-600">
              No consultants available yet.
            </div>
          )}
        </div>
      </section>

    
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">ConsultPro</h3>
              <p className="text-gray-400">
                The leading platform for professional video consultations and expert advice.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Find Experts</li>
                <li className="hover:text-white cursor-pointer">How it Works</li>
                <li className="hover:text-white cursor-pointer">Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Consultants</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Become a Consultant</li>
                <li className="hover:text-white cursor-pointer">Resources</li>
                <li className="hover:text-white cursor-pointer">Success Stories</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Help Center</li>
                <li className="hover:text-white cursor-pointer">Contact Us</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ConsultPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
