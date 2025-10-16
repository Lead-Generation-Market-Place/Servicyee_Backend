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
    const categoryData = { ...req.body };
    const { name, slug } = categoryData;
    if (!name || !slug) {
      return res.status(400).json({message: 'Name and slug are required fields.'});
    }
    if (req.file) {
      categoryData.category_image_url = req.file.filename;
    } else {
      return res.status(400).json({ message: 'Category image is required.' });
    }
    categoryData.category_image_url = req.file.filename;

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
    const updateData = { ...req.body };

    // Find existing category first
    const existingCategory = await categoryService.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Validate only the fields that are being updated and should not be empty
    const { name, slug } = updateData;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }                                                         
    if (slug !== undefined && !slug.trim()) {
      return res.status(400).json({ message: 'Slug cannot be empty' });
    }

    if (req.file) {
      const oldImage = existingCategory.category_image_url;
      
      // Delete old image if it exists
      if (oldImage) {
        try {
          // Use the correct folder path based on your multer configuration
          const oldImagePath = path.join('uploads/Category', oldImage);
          
          // Check if file exists before deleting
          if (fs.existsSync(oldImagePath)) {
            // Use async file deletion
            await fs.promises.unlink(oldImagePath);
          }
        } catch (err) {
          console.error('✗ Failed to delete old image:', err.message);
          // Don't fail the entire request if image deletion fails
        }
      }
      updateData.category_image_url = req.file.filename;
    }

    // Update category
    const updatedCategory = await categoryService.updateCategory(id, updateData);

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found during update' });
    }

    res.status(200).json({ 
      message: 'Category updated successfully',
      data: updatedCategory 
    });

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
      const imagePath = path.join('uploads/Category', category.category_image_url);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete category image:', err);
          // Not throwing error here to continue deletion process, but you can if you want
        }
      });
    }

    await categoryService.deleteCategory(id);

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
