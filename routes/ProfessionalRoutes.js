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
	uploadFile,
	createProfessionalAccount
} from '../controllers/ProfessionalController.js';
import createUploader from '../config/multer.js';  
import { UpdateprofessionalSchema } from '../validators/updatePorfessionaIntro.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { searchProfessionalsController } from "../controllers/SearchLog.js";
const router = express.Router();
const upload = createUploader('professionals'); 

router.post('/register', createProfessionalAccount);
router.get('/',  authenticateToken, getAllProfessionalsHandler);
router.get('/pro', authenticateToken, getProfessionalByUserIdHandler);
router.post('/',  authenticateToken, celebrate({ [Segments.BODY]: professionalSchema }), createProfessionalHandler);
router.put('/:id', authenticateToken, celebrate({ [Segments.BODY]: UpdateprofessionalSchema }), updateProfessionalIntroductionById);
router.put('/:id/introduction', 
	 authenticateToken,
	upload.single('profile_image'), 
	celebrate({ [Segments.BODY]: UpdateprofessionalSchema }),  
	updateProfessionalInfo
);
router.delete('/:id',authenticateToken, deleteProfessionalHandler);


// Search Log Routes
router.get('/search', searchProfessionalsController);

export default router;
