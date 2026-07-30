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

    // Check if email already exists
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (findError && findError.code !== "PGRST116") {
      console.log(findError);
    }

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password,
        },
      ])
      .select();

    if (error) {
      console.error(error);

      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: data[0],
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
};

// ======================
// LOGIN USER
// ======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (data.password !== password) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: data,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
};