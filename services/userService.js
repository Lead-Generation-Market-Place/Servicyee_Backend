import { User } from "../models/user.js";

export function createUser(data) {
    const userData = new User(data);
    return userData.save();
}

export function getAllUsers() {
    return User.find().exec();
}
export function updateUserById(id, data) {
    return User.findByIdAndUpdate(id, data,{new:true}).exec();
}

export function getUserById(id) {
    return User.findById(id).select().exec();
}

export function deleteUserByid(id) {
    return User.findByIdAndDelete(id).exec();
}