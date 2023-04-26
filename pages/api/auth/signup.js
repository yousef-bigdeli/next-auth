import { hashPassword } from "@/lib/auth";
import { connectDatabase, getDocument, insertDocument } from "@/lib/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const { email, password } = req.body;
  let client;

  // Connect to the database
  try {
    client = await connectDatabase();
  } catch (error) {
    console.log("Connecting to the database failed!", error);
    res.status(500).json({
      message: "server error. Sign up failed!",
    });
    return;
  }

  // Validation inputs
  if (!email || !email.includes("@")) {
    res.status(422).json({
      message: "Invalid email address!",
    });
    return;
  }

  if (!password || password.trim().length < 7) {
    res.status(422).json({
      message:
        "Invalid input - password should also be at least 7 characters long",
    });
    return;
  }

  // Check if the user exists
  try {
    const existingUser = await getDocument(client, "users", { email });
    if (existingUser.length !== 0) {
      res.status(422).json({ message: "User already exist!" });
      client.close();
      return;
    }
  } catch (error) {
    console.log("Cannot get user information for sign up.", error);
    res.status(500).json({ message: "Server error. Sign up failed!" });
    client.close();
    return;
  }

  // Add new user
  const hashedPassword = await hashPassword(password);

  try {
    await insertDocument(client, "users", {
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Created user!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Server error. cannot create user!",
    });
  }

  client.close();
}

export default handler;
