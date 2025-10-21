// import { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../utils/supabaseClient";

// interface ClientFormData {
//   project_title: string;
//   project_description: string;
//   budget: string;
//   timeline: string;
// }

// const ClientForm = () => {
//   const [formData, setFormData] = useState<ClientFormData>({
//     project_title: "",
//     project_description: "",
//     budget: "",
//     timeline: "",
//   });
//   const [message, setMessage] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const { data } = await supabase.auth.getSession();
//       const session = data?.session;
//       const user = session?.user;
//       if (!user) {
//         navigate("/login", { replace: true });
//         return;
//       }

//       const { data: profile, error } = await supabase
//         .from("users")
//         .select("role")
//         .eq("id", user.id)
//         .maybeSingle();

//       if (error) {
//         setMessage("❌ Could not fetch profile. Please login again.");
//         setTimeout(() => navigate("/login", { replace: true }), 1500);
//         return;
//       }

//       if (profile?.role !== "client") {
//         setMessage("Access denied: Only clients can fill this form.");
//         setTimeout(() => navigate("/", { replace: true }), 1500);
//         return;
//       }

//       // Prefill if existing
//       const { data: clientRow } = await supabase
//         .from("clients")
//         .select("project_title, project_description, budget, timeline")
//         .eq("user_id", user.id)
//         .maybeSingle();
//       if (clientRow) {
//         setFormData({
//           project_title: clientRow.project_title || "",
//           project_description: clientRow.project_description || "",
//           budget: clientRow.budget?.toString?.() || "",
//           timeline: clientRow.timeline || "",
//         });
//       }
//     };
//     checkAuth();
//   }, [navigate]);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     const { data: userData } = await supabase.auth.getUser();
//     const user = userData?.user;
//     if (!user) {
//       setMessage("User not logged in.");
//       setLoading(false);
//       return;
//     }

//     const { error } = await supabase
//       .from("clients")
//       .upsert(
//         {
//           user_id: user.id,
//           email: user.email,
//           project_title: formData.project_title,
//           project_description: formData.project_description,
//           budget: Number(formData.budget) || null,
//           timeline: formData.timeline,
//         },
//         { onConflict: "user_id" }
//       );

//     if (error) {
//       setMessage("❌ Error saving client details. Try again.");
//     } else {
//       setMessage("✅ Details saved! Redirecting to dashboard...");
//       setTimeout(() => navigate("/client-dashboard", { replace: true }), 800);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-3xl" />
//       <div className="relative w-full max-w-lg p-8 rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold">Client Requirement</h2>
//           <button
//             onClick={async () => {
//               await supabase.auth.signOut();
//               navigate("/", { replace: true });
//             }}
//             className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold"
//           >
//             Logout
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="project_title"
//             placeholder="Project Title"
//             value={formData.project_title}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
//           />

//           <textarea
//             name="project_description"
//             placeholder="Describe your project needs"
//             value={formData.project_description}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
//           />

//           <input
//             name="budget"
//             type="number"
//             placeholder="Budget (USD)"
//             value={formData.budget}
//             onChange={handleChange}
//             className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
//           />

//           <input
//             name="timeline"
//             placeholder="Timeline (e.g., 4-6 weeks)"
//             value={formData.timeline}
//             onChange={handleChange}
//             className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-md transition-all"
//           >
//             {loading ? "Saving..." : "Save Details"}
//           </button>
//         </form>

//         {message && (
//           <p className="mt-4 text-center text-sm bg-white/10 py-2 rounded-xl border border-white/10">
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClientForm;


