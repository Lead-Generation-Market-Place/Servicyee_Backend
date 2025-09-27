import subCategoryService from '../services/subCategory.js';

export const getSubCategories = async (req, res, next) => {
  try {
    // Optional: filter by category query param, e.g., /subcategories?category=categoryId
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const subCategories = await subCategoryService.getAllSubCategories(filter);
    res.status(200).json({ data: subCategories });
  } catch (error) {
    next(error);
  }
};
export const getSubCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subcategory = await subCategoryService.getSubCategoryById(id);

    if (!subcategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    res.status(200).json({ data: subcategory });
  } catch (error) {
    next(error);
  }
};
export const addSubCategory = async (req, res, next) => {
  try {
    const subCategoryData = req.body;
    const createdSubCategory = await subCategoryService.addSubCategory(subCategoryData);
    res.status(201).json({ data: createdSubCategory });
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const updateSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedSubCategory = await subCategoryService.updateSubCategory(id, updateData);

    if (!updatedSubCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    res.status(200).json({ data: updatedSubCategory });
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedSubCategory = await subCategoryService.deleteSubCategory(id);

    if (!deletedSubCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    res.status(200).json({ message: 'SubCategory deleted successfully' });
  } catch (error) {
    next(error);
  }
};


export const getAllSubCategoriesWithServicesCount = async (req, res, next) => {
  try {
    const subCategories = await subCategoryService.getAllSubCategoriesWithServicesCount();
    res.status(200).json({ data: subCategories });
  } catch (error) {
    next(error);
  }
}
