import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Initialize Supabase client with Service Role (for admin tasks)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// SIGNUP route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign up user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // immediately confirm user
    });

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Signup successful", user: data.user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Login successful", user: data.user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
