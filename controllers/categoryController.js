import categoryService from '../services/category.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ data: categories });
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (req, res, next) => {
  try {
    const categoryData = req.body;
    const createdCategory = await categoryService.addCategory(categoryData);
    res.status(201).json({ data: createdCategory });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ data: category });
  } catch (error) {
    next(error);
  }
};
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCategory = await categoryService.updateCategory(id, updateData);

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ data: updatedCategory });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCategory = await categoryService.deleteCategory(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};


export const getAllWithServiceCount = async (req, res, next) => {
  try {
    const categoriesWithServiceCount = await categoryService.getAllCategoriesWithServiceCount();
    res.status(200).json({ data: categoriesWithServiceCount });
  } catch (error) {
    next(error);
  }
}
