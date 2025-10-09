import professionalRoutes from "./ProfessionalRoutes.js";
import locationRoutes from "./LocationRoutes.js";
import wishlistsRoutes from "./wishlistsRoute.js";
import findServiceProsRoute from "./findServiceProsRoute.js";
import serviceRoute from "./serviceRoute.js";
import categoryRoute from "./categoryRoute.js";
import subCategoriesRoute from "./subCategoryRoute.js";
import questionRoute from "./questionRoute.js";
import answerRoute from "./answerRoute.js";
import searchRoute from "./searchRoute.js";
import subcategoryServicesRoute from "./subcategoryServicesRoute.js";
import authRoute from "./authRoute.js";
import serviceQuestionsRoute from "./serviceQuestionsRoute.js";
import leadRoute from "./leadRoute.js";
import ReviewsRoutes from "./ReviewsRoutes.js";
import promotionRoutes from "./promotionRoute.js";
// Organized by feature
const apiRoutes = [
  // Authentication & Users
  {
    path: "/auth",
    router: authRoute,
    developer: "esmatullah",
    domain: "authentication",
    description: "User authentication and authorization",
  },

  // Professionals
  {
    path: "/professionals",
    router: professionalRoutes,
    developer: "liaqat",
    domain: "professionals",
    description: "Professional management and profiles",
  },

  {
    path: "/reviews",
    router: ReviewsRoutes,
    developer: "liaqat",
    domain: "reviews",
    description: "Reviews management",
  },

  {
    path: "/findpros",
    router: findServiceProsRoute,
    developer: "durrani",
    domain: "professionals",
    description: "Find service professionals",
  },
  {
    path: "/lead",
    router: leadRoute,
    developer: "esmatullah",
    domain: "business",
    description: "Lead management",
  },

  // Services & Categories
  {
    path: "/services",
    router: serviceRoute,
    developer: "bashery",
    domain: "services",
    description: "Service management",
  },
  {
    path: "/categories",
    router: categoryRoute,
    developer: "bashery",
    domain: "categories",
    description: "Service categories",
  },
  {
    path: "/subcategories",
    router: subCategoriesRoute,
    developer: "bashery",
    domain: "categories",
    description: "Service subcategories",
  },
  {
    path: "/subcategories",
    router: subcategoryServicesRoute,
    developer: "esmatullah",
    domain: "categories",
    description: "Subcategory services",
  },

  // Questions & answers
  {
    path: "/questions",
    router: questionRoute,
    developer: "bashery",
    domain: "qna",
    description: "Service questions",
  },
  {
    path: "/answers",
    router: answerRoute,
    developer: "bashery",
    domain: "qna",
    description: "Question answers",
  },
  {
    path: "/service",
    router: serviceQuestionsRoute,
    developer: "esmatullah",
    domain: "qna",
    description: "Service-related questions",
  },

  // location
  {
    path: "/location",
    router: locationRoutes,
    developer: "liaqat",
    domain: "business",
    description: "Location management",
  },

  //customer
  {
    path: "/wishlists",
    router: wishlistsRoutes,
    developer: "durrani",
    domain: "business",
    description: "User wishlists",
  },

  // Search
  {
    path: "/search",
    router: searchRoute,
    developer: "bashery",
    domain: "search",
    description: "Global search functionality",
  },
  {
    path: "/promotions",
    router: promotionRoutes,
    developer: "durrani",
    domain: "promotions",
    description: "Promotion discount related",
  },
];

// Utility functions
export const getRoutesByDeveloper = (developer) => {
  return apiRoutes.filter((route) => route.developer === developer);
};

export const getRoutesByDomain = (domain) => {
  return apiRoutes.filter((route) => route.domain === domain);
};

export const getAllRoutePaths = () => {
  return apiRoutes.map((route) => `/api/v1${route.path}`);
};

export const getRouteSummary = () => {
  const summary = {};
  apiRoutes.forEach((route) => {
    if (!summary[route.developer]) {
      summary[route.developer] = [];
    }
    summary[route.developer].push({
      path: route.path,
      domain: route.domain,
      description: route.description,
    });
  });
  return summary;
};

if (process.env.NODE_ENV === "development") {
  console.table(
    apiRoutes.map((route) => ({
      Path: route.path,
      Developer: route.developer,
      Domain: route.domain,
      Description: route.description,
    }))
  );
}

export default apiRoutes;
