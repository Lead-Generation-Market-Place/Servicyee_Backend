import { 
    createUser, 
    deleteUserByid, 
    getAllUsers, getUserById, 
    updateUserById 
} from "../services/userService.js";

export async function createUserHandler(req, res) {
    try {
        const userData = await createUser(req.body);
        res.status(201).json(userData);
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error creating user", 
            error:error?.message || "An unexpected error occured"});
    }
}

export async function getAllUsersHandler(req, res) {
    try {
        const usersData = await getAllUsers(req, res);
        res.json(usersData)
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Unable to get user data",
            error:error?.message || "An unexpected error occured"
        });
    }
}

export async function getUserByIdHandler(req, res) {
    try {
        const userData = await getUserById(req.params.id);
        res.json(userData);
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Unable to get user: ", 
            error:error?.message || "An unexpected error occured"
        });
    }
}

export async function updateUserByIdHandler(req, res) {
    try {
        const user = await updateUserById(req.params.id, req.body);
        res.status(200).json({message:"User updated successfully", user});
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Unable to update user",
            error:error?.message || "An unexpected error occured"
        });
    }
}

export async function deleteUserByIdHandler(req, res) {
    try {
        await deleteUserByid(req.params.id);
        res.status(200).json({message:"User has been deleted successfully"});
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Unable to delete user",
            error:error?.message || "An unexpected error occured"
        });
    }
}