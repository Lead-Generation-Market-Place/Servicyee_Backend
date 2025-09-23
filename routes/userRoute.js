import express from "express";
import { 
    createUserHandler, 
    deleteUserByIdHandler, 
    getAllUsersHandler, 
    getUserByIdHandler, 
    updateUserByIdHandler 
} from "../controllers/userController.js";

const router = express.Router();

router.post("/create", createUserHandler);
router.get("/all", getAllUsersHandler);
router.get("/:id", getUserByIdHandler);
router.put("/:id/update", updateUserByIdHandler);
router.delete("/:id/delete", deleteUserByIdHandler);

export default router;