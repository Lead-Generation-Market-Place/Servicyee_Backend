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
	createProfessionalAccount,
	createProfessionalStepThree,
	createProfessionalStepFour,
	createProfessionalStepSeven,
	createProfessionalStepEight,
	getServicesQuestionsPro,
	createProfessionalStepNine,
	// createProfessionalReview,
	getProfessionalProfile,
	addProfessionalFiles,
	createFeaturedProjectHandler,
	getFeaturedProjectByIdHandler,
	getFeaturedProjectsHandler,
	getFeaturedProjectsByServiceHandler,
	updateFeaturedProjectHandler,
	deleteFeaturedProjectHandler,
	addFilesToFeaturedProjectHandler,
	removeFilesFromFeaturedProjectHandler,
	getLicenseTypesHandler,
	getCitiesHandler,
	saveProfessionalLicenseHandler,
	getAllProfessionalLicensesHandler,
	getProfessionalLicenseByIdHandler,
	updateProfessionalLicenseHandler,
	deleteProfessionalLicenseHandler,
	createProfessionalGetSteps
} from '../controllers/ProfessionalController.js';
import {
	addQuestionHandler,
	getAllQuestionsHandler,
	addAnswerHandler,
	getFaqsByProfessionalHandler
} from '../controllers/FAQController.js';
import createUploader from '../config/multer.js';
import { UpdateprofessionalSchema } from '../validators/updatePorfessionaIntro.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { searchProfessionalsController } from "../controllers/SearchLog.js";
import {  SendReviewEmailCustomer } from '../controllers/SendReviewEmailController.js';
const router = express.Router();
const upload = createUploader('professionals');
const featuredProjectUpload = createUploader('featuredProjects');



// Professional Registration Route with account creation
router.post('/register', createProfessionalAccount);
router.put('/update-business-name/:id', authenticateToken, createProfessionalStepThree);
router.put('/businessInfo/:id', authenticateToken, upload.single('profile'), createProfessionalStepFour);
router.put('/availability/:id', authenticateToken, createProfessionalStepSeven);
router.post('/services-answers', authenticateToken, createProfessionalStepEight);
router.post('/servicesLocation', authenticateToken, createProfessionalStepNine);
router.get('/questionsAnswers', authenticateToken, getServicesQuestionsPro);
router.get('/professional_steps', authenticateToken, createProfessionalGetSteps);
router.post('/profileReviewsCustomer', authenticateToken, SendReviewEmailCustomer);
router.get('/progress', authenticateToken, getProfessionalByUserIdHandler);
// End of Professional Registration Route with account cretion
router.post(
  "/files",
  authenticateToken,
  upload.array("files"),
  addProfessionalFiles
);
// CRUD Routes for Professionals Account Management
router.get('/',  authenticateToken, getAllProfessionalsHandler);
router.post('/',  authenticateToken, celebrate({ [Segments.BODY]: professionalSchema }), createProfessionalHandler);
router.put('/:id', authenticateToken, celebrate({ [Segments.BODY]: UpdateprofessionalSchema }), updateProfessionalIntroductionById);
router.put('/:id/introduction', 
	 authenticateToken,
	upload.single('profile_image'), 
	celebrate({ [Segments.BODY]: UpdateprofessionalSchema }),  
	updateProfessionalInfo
);
router.delete('/:id',authenticateToken, deleteProfessionalHandler);

// End of CRUD Routes for Professionals Account Management


// FeaturedProject Routes
router.post('/featured-projects', authenticateToken, featuredProjectUpload.array('files'), createFeaturedProjectHandler);
router.get('/featured-projects', authenticateToken, getFeaturedProjectsHandler);
router.get('/featured-projects/:id', authenticateToken, getFeaturedProjectByIdHandler);
router.get('/featured-projects/service/:serviceId', authenticateToken, getFeaturedProjectsByServiceHandler);
router.put('/featured-projects/:id', authenticateToken, featuredProjectUpload.array('files'), updateFeaturedProjectHandler);
router.delete('/featured-projects/:id', authenticateToken, deleteFeaturedProjectHandler);
router.post('/featured-projects/:id/files', authenticateToken, addFilesToFeaturedProjectHandler);
router.delete('/featured-projects/:id/files', authenticateToken, removeFilesFromFeaturedProjectHandler);

// Search Log Routes
router.get('/search', searchProfessionalsController);

// Simple FAQ Routes (Just What You Need)
router.post('/faq/questions', authenticateToken, addQuestionHandler);
router.get('/faq/questions', authenticateToken, getAllQuestionsHandler);
router.post('/faq/answers', authenticateToken, addAnswerHandler);
router.get('/faq/:professionalId/faqs', authenticateToken, getFaqsByProfessionalHandler);

// Dropdown Data Routes
router.get('/license-types', getLicenseTypesHandler);
router.get('/cities', getCitiesHandler);

// Professional License Routes
router.post('/licenses', authenticateToken, saveProfessionalLicenseHandler);
router.get('/licenses/:professional_id', authenticateToken, getAllProfessionalLicensesHandler);
router.get('/licenses/:professional_id/:license_id', authenticateToken, getProfessionalLicenseByIdHandler);
router.put('/licenses/:professional_id/:license_id', authenticateToken, updateProfessionalLicenseHandler);
router.delete('/licenses/:professional_id/:license_id', authenticateToken, deleteProfessionalLicenseHandler);

export default router;
