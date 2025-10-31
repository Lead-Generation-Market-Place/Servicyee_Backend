import Subcategories from '../models/subCategoryModel.js';
import Category from '../models/categoryModel.js';  // Import Category model

class SubCategoryService {
  async getAllSubcategories(filter = {}) {
    try {
      return await Subcategories.find(filter);
    } catch (error) {
      throw error;
    }
  }

    async getSubCategoryById(subCategoryId) {
      try {
        return await Subcategories.findById(subCategoryId);
      } catch (error) {
        throw error;
      }
    }

    // get subcategory by slug
   async getSubcategoryBySlug(subcategorySlug) {
    try {
      const result = await Subcategories.aggregate([
        {
          $match: { slug: subcategorySlug, is_active: true }
        },
        {
          $lookup: {
            from: "services", // Services collection
            localField: "_id", // subcategory _id
            foreignField: "subcategory_id", // service's subcategory_id field
            as: "services" // This will contain all services for this subcategory
          }
        },
        // Optional: Filter only active services
        {
          $addFields: {
            services: {
              $filter: {
                input: "$services",
                as: "service",
                cond: { $eq: ["$$service.is_active", true] } // if you have is_active field
              }
            }
          }
        }
      ]).exec();

      return result.length > 0 ? result[0] : null;
    } catch(error) {
      console.error("Error fetching subcategory with services:", error);
      throw error;
    }
  }

  async addSubCategory(subCategoryData) {
    try {
      // Check if category exists
      const categoryExists = await Category.findById(subCategoryData.category_id);
      if (!categoryExists) {
        throw new Error('Category not found');
      }

      const newSubCategory = new Subcategories(subCategoryData);
      return await newSubCategory.save();
    } catch (error) {
      throw error;
    }
  }

  async updateSubCategory(subCategoryId, updateData) {
    try {
      // If updating category, verify it exists
      if (updateData.category) {
        const categoryExists = await Category.findById(updateData.category_id);
        if (!categoryExists) {
          throw new Error('Category not found');
        }
      }

      const updatedSubCategory = await Subcategories.findByIdAndUpdate(
        subCategoryId,
        updateData,
        { new: true, runValidators: true }
      ).populate('category_id');
      return updatedSubCategory;
    } catch (error) {
      throw error;
    }
  }

  async deleteSubCategory(subCategoryId) {
    try {
      const deletedSubCategory = await Subcategories.findByIdAndDelete(subCategoryId);
      return deletedSubCategory;
    } catch (error) {
      throw error;
    }
  }



 async getAllSubcategoriesWithServicesCount() {
  try {
    const result = await Subcategories.aggregate([
      {
        $lookup: {
          from: 'services',
          let: { subCatId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$subcategory_id', '$$subCatId'] },
                    { $eq: ['$is_active', true] } // Only count active services
                  ]
                }
              }
            }
          ],
          as: 'services'
        }
      },
      {
        $project: {
          name: 1,
          is_active: 1,
          category_id: 1,
          servicesCount: { $size: '$services' }
        }
      },
      {
        $sort: { servicesCount: -1 }
      }
    ]);

    return result;
  } catch (error) {
    console.error('Error in getAllSubcategoriesWithServicesCount:', error);
    throw error;
  }
}

}
export default new SubCategoryService();
