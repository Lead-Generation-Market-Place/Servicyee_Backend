import SubCategories from '../models/subCategoryModel.js';
import Category from '../models/categoryModel.js';  // Import Category model

class SubCategoryService {
  async getAllSubCategories(filter = {}) {
    try {
      return await SubCategories.find(filter).populate('category');
    } catch (error) {
      throw error;
    }
  }

    async getSubCategoryById(subCategoryId) {
      try {
        return await SubCategories.findById(subCategoryId);
      } catch (error) {
        throw error;
      }
    }

  async addSubCategory(subCategoryData) {
    try {
      // Check if category exists
      const categoryExists = await Category.findById(subCategoryData.category);
      if (!categoryExists) {
        throw new Error('Category not found');
      }

      const newSubCategory = new SubCategories(subCategoryData);
      return await newSubCategory.save();
    } catch (error) {
      throw error;
    }
  }

  async updateSubCategory(subCategoryId, updateData) {
    try {
      // If updating category, verify it exists
      if (updateData.category) {
        const categoryExists = await Category.findById(updateData.category);
        if (!categoryExists) {
          throw new Error('Category not found');
        }
      }

      const updatedSubCategory = await SubCategories.findByIdAndUpdate(
        subCategoryId,
        updateData,
        { new: true, runValidators: true }
      ).populate('category');
      return updatedSubCategory;
    } catch (error) {
      throw error;
    }
  }

  async deleteSubCategory(subCategoryId) {
    try {
      const deletedSubCategory = await SubCategories.findByIdAndDelete(subCategoryId);
      return deletedSubCategory;
    } catch (error) {
      throw error;
    }
  }
}

export default new SubCategoryService();
