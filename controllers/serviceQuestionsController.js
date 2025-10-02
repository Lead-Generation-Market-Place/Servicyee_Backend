
import { serviceQuestions } from "../services/serviceQuestionService.js";

export async function getServiceQuestions(req, res) {
    try {
        const questions = await serviceQuestions(req.params.serviceId);
        res.status(200).json({questions});
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message:"Unable to get the question",
                error:error?.message || "An unexprected error occured"
            }
        );
    }
}