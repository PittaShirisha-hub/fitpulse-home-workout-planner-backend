import supabase from "../config/supabase.js";

// ======================
// REGISTER USER
// ======================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password }])
      .select();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: data[0],
    });

  } catch (err) {
    res.status(500).json({
      error: "Server error",
    });
  }
};


// ======================
// LOGIN USER  ✅ ADD THIS BELOW
// ======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // 2️⃣ Find user
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // 3️⃣ Check password
    if (data.password !== password) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // 4️⃣ Success
    res.status(200).json({
      message: "Login successful",
      user: data,
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};