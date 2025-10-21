// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../utils/supabaseClient";

// const AuthCallback = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (session?.user) {
//         // ✅ Fetch role from users table to decide where to go
//         const { data: userData, error } = await supabase
//           .from("users")
//           .select("role")
//           .eq("id", session.user.id)
//           .single();

//         if (error) {
//           console.error("Error fetching user role:", error);
//           navigate("/login");
//           return;
//         }

//         if (userData?.role === "consultant") {
//           navigate("/ConsultantForm");
//         } else if (userData?.role === "client") {
//           navigate("/client-dashboard");
//         } else {
//           navigate("/login");
//         }
//       } else {
//         navigate("/login");
//       }
//     };

//     handleSession();
//   }, [navigate]);

//   return (
//     <div className="flex items-center justify-center min-h-screen text-white bg-black">
//       <h1>Verifying your account...</h1>
//     </div>
//   );
// };

// export default AuthCallback;
