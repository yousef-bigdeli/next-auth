import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  let client, user;

  // Get session
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const userEmail = session.user.email;
  const { oldPassword, newPassword } = req.body;

  // Connect to the database
  try {
    client = await connectDatabase();
  } catch (error) {
    console.log("Connecting to the database failed!", error);
    res.status(500).json({
      message: "server error. Change password failed!",
    });
    return;
  }

  // Get user from database
  const userCollection = client
    .db(process.env.MONGO_DBNAME)
    .collection("users");

  try {
    user = await userCollection.findOne({ email: userEmail });
  } catch (error) {
    console.log("Get user failed!", error);
    res.status(500).json({
      message: "Internal server error. Cannot get user information",
    });
    client.close();
    return;
  }

  if (!user) {
    res.status(401).json({ message: "User not found!" });
    client.close();
    return;
  }

  // Verify user password
  const isVerified = await verifyPassword(oldPassword, user.password);
  if (!isVerified) {
    res.status(403).json({ message: "Invalid password" });
    client.close();
    return;
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update with new hashed password
  try {
    await userCollection.updateOne(
      { email: userEmail },
      { $set: { password: hashedPassword } }
    );
  } catch (error) {
    console.log("Update password failed!", error);
    res.status(500).json({
      message: "Internal server error. Cannot update password!",
    });
    client.close();
    return;
  }

  client.close();
  res.status(200).json({ message: "Password updated!" });
}

export default handler;
