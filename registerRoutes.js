
import serviceRoute from './routes/serviceRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import subCategoriesRoute from './routes/subCategoryRoute.js';
import questionRoute from './routes/questionRoute.js'
import answerRoute from './routes/answerRoute.js'
import searchRoute from './routes/searchRoute.js'
export default function registerRoutes(app) {

  app.use('/services', serviceRoute);
  app.use('/categories',categoryRoute)
  app.use('/subcategories',subCategoriesRoute)
  app.use('/questions',questionRoute)
  app.use('/answers',answerRoute)
  app.use('/search',searchRoute)
}
