import CategoryModel from '../models/categoryModel.js';

class CategoryService {
  async getAllCategories() {
    try {
      return await CategoryModel.find({});
    } catch (error) {
      throw error;
    }
  }

  async addCategory(categoryData) {
    try {
      const newCategory = new CategoryModel(categoryData);
      return await newCategory.save();
    } catch (error) {
      throw error;
    }
  }

    async getCategoryById(categoryId) {
    try {
      return await CategoryModel.findById(categoryId);
    } catch (error) {
      throw error;
    }
  }
  
  async updateCategory(categoryId, updateData) {
    try {
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        updateData,
        { new: true, runValidators: true }
      );
      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    try {
      const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);
      return deletedCategory;
    } catch (error) {
      throw error;
    }
  }
}

export default new CategoryService();
