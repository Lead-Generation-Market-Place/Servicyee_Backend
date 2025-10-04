import express from 'express';
import { celebrate, Segments } from 'celebrate';
import { professionalSchema } from '../validators/professionalValidator.js';
import {
	getAllProfessionalsHandler,
	createProfessionalHandler,
	deleteProfessionalHandler,
	getProfessionalByUserIdHandler,
	updateProfessionalIntroductionById,
	updateProfessionalInfo,
	uploadFile
} from '../controllers/ProfessionalController.js';
import createUploader from '../config/multer.js';  
import { UpdateprofessionalSchema } from '../validators/updatePorfessionaIntro.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();
const upload = createUploader('professionals'); 
router.get('/',  authMiddleware, getAllProfessionalsHandler);
router.get('/pro', authMiddleware, getProfessionalByUserIdHandler);
router.post('/',  authMiddleware, celebrate({ [Segments.BODY]: professionalSchema }), createProfessionalHandler);
router.put('/:id', authMiddleware, celebrate({ [Segments.BODY]: UpdateprofessionalSchema }), updateProfessionalIntroductionById);
router.put('/:id/introduction', 
	 authMiddleware,
	upload.single('profile_image'), 
	celebrate({ [Segments.BODY]: UpdateprofessionalSchema }),  
	updateProfessionalInfo
);
router.delete('/:id',authMiddleware, deleteProfessionalHandler);


export default router;
