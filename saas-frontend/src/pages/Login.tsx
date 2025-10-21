import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import "../index.css";

type Role = "client" | "consultant" | "";

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profile?.role === "client") {
          navigate("/client-dashboard");
        } else if (profile?.role === "consultant") {
          navigate("/consultant-form");
        }
      }
    };
    checkSession();
  }, [navigate]);


  const fetchUserByEmail = async (emailToCheck: string) => {
    const { data } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("email", emailToCheck)
      .maybeSingle();
    return data;
  };

  
  const ensureRoleProfile = async (role: Role, userId: string, userEmail: string) => {
    const table = role === "client" ? "clients" : "consultants";
    const { data: existing } = await supabase
      .from(table)
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existing) {
      await supabase.from(table).insert([{ user_id: userId, email: userEmail }]);
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!selectedRole) {
      setMessage("⚠️ Please select your role before continuing.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
  
        const existingUser = await fetchUserByEmail(email);
        if (existingUser && existingUser.role && existingUser.role !== selectedRole) {
          setMessage(
            `This email is already registered as "${existingUser.role}". Please login using that role.`
          );
          setLoading(false);
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (signUpError) throw signUpError;
        const authUser = signUpData.user;

        
        if (!authUser) {
          throw new Error("Signup failed — user not returned from Supabase.");
        }

      
        const { error: insertError } = await supabase.from("users").upsert(
          {
            id: authUser.id,
            email: authUser.email,
            role: selectedRole,
          },
          { onConflict: "id" }
        );
        

        if (insertError) throw insertError;

        setMessage("Signup successful! Please verify your email before logging in.");
        setIsSignup(false);
        setLoading(false);
        return;
      } else {
       
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });

        if (signInError) throw signInError;

        const authUser = signInData.user;
        if (!authUser) throw new Error("No user found.");

        const userRow = await fetchUserByEmail(authUser.email!);

  
        if (userRow?.role && userRow.role !== selectedRole) {
          setMessage(
            ` You registered this email as "${userRow.role}". Please login using that role.`
          );
          setLoading(false);
          return;
        }

        
        if (!userRow || !userRow.role) {
          await supabase.from("users").upsert({
            id: authUser.id,
            email: authUser.email,
            role: selectedRole,
          });
        }

        
        await ensureRoleProfile(selectedRole, authUser.id, authUser.email!);

        localStorage.setItem("user", JSON.stringify(authUser));

        if (selectedRole === "client") {
          navigate("/client-dashboard");
        } else {
          navigate("/consultant-form");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-3xl" />

      <div className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl text-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-wide">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-300 text-sm">
            {isSignup
              ? "Sign up to get started with your account"
              : "Login to access your dashboard"}
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole("client")}
            className={`px-4 py-2 rounded-xl border transition ${
              selectedRole === "client"
                ? "bg-white border-slate-800 shadow-lg text-black"
                : "bg-white/10 border-white/20 hover:bg-white/20"
            }`}
          >
            Join as Client
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("consultant")}
            className={`px-4 py-2 rounded-xl border transition ${
              selectedRole === "consultant"
                ? "bg-white border-slate-800 shadow-lg text-black"
                : "bg-white/10 border-white/20 hover:bg-white/20"
            }`}
          >
            Join as Consultant
          </button>
          
            
        </div>

        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              onClick={() => setIsSignup(false)}
              className="mt-2 bg-white/10 border-white/20 hover:bg-white hover:text-black text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex-1"
              disabled={loading}
            >
              {loading && !isSignup ? "Signing in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={(e) => {
                setIsSignup(true);
                const form = e.currentTarget.closest("form");
                if (form) form.requestSubmit();
              }}
              className="mt-2 bg-white/10 border-white/20 hover:bg-white hover:text-black text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex-1"
              disabled={loading}
            >
              {loading && isSignup ? "Creating..." : "Sign Up"}
            </button>
          </div>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300 bg-white/5 py-2 rounded-lg border border-white/10">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;



