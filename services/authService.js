import { User } from "../models/user.js";

export async function login(data) {
    try {
        const user = await User.findOne({email: data.email}).exec();
        return user;
    } catch (error) {
        throw new Error("Error finding user");
    }
}

export async function register(data) {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new Error("Email already exists");

  const user = new User({
    ...data
  });

  return await user.save();
}