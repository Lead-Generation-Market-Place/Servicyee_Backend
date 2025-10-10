  import CategoryModel from '../models/categoryModel.js';

  class CategoryService {
    async getAllCategories() {
      try {
        return await CategoryModel.find();
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


  async getAllCategoriesWithServiceCount() {
    const categories = await CategoryModel.aggregate([
      {
        // Step 1: Lookup SubCategories for each Category
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: 'category_id', // ✅ Corrected field
          as: 'subcategories'
        }
      },
      {
        $unwind: {
          path: '$subcategories',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        // Step 2: Lookup Services for each SubCategory
        $lookup: {
          from: 'services',
          localField: 'subcategories._id',
          foreignField: 'subcategory_id',
          as: 'services'
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          status: { $first: '$status' },
          serviceCount: { $sum: { $size: '$services' } }
        }
      }
    ]);

    return categories;
  }

  }

  export default new CategoryService();
