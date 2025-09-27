import categoryService from '../services/category.js';

import fs from 'fs';
import path from 'path';



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

    if (req.file) {
      categoryData.category_image_url = req.file.filename;
    } else {
      return res.status(400).json({ message: 'Category image is required.' });
    }

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

    // Find existing category to get old image filename
    const existingCategory = await categoryService.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // If new image uploaded, delete old image and update field
    if (req.file) {
      const oldImage = existingCategory.category_image_url;
      if (oldImage) {
        const oldImagePath = path.join('uploads', 'category', oldImage);  // adjust folder name if needed
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Failed to delete old image:', err);
            // You might decide to continue or return error here
          }
        });
      }
      updateData.category_image_url = req.file.filename;
    }

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

    // Find the category to get the image filename
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete the image file if it exists
    if (category.category_image_url) {
      const imagePath = path.join('uploads', 'category', category.category_image_url);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete category image:', err);
          // Not throwing error here to continue deletion process, but you can if you want
        }
      });
    }

    // Delete the category document
    const deletedCategory = await categoryService.deleteCategory(id);

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
