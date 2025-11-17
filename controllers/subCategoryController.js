import subCategoryService from '../services/subCategory.js';
import path from 'path';
import fs from 'fs';

export const getSubCategories = async (req, res, next) => {
  try {
    // Optional: filter by category query param, e.g., /subcategories?category=categoryId
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const subCategories = await subCategoryService.getAllSubcategories(filter);
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

// subcategory gy slug
export const getSubcategoryBySlugHandler = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const subcategoryData = await subCategoryService.getSubcategoryBySlug(slug);
    if (!subcategoryData) {
      return res.status(404).json({message: 'subcategory not found'});
    }

    res.status(200).json({
      success:true,
      message:`${slug} subcategory data`,
      data:subcategoryData
    });

  } catch (error) {
    next(error);
  }
}

// create subcategory
export const addSubCategory = async (req, res, next) => {
  try {
    const subCategoryData = { ...req.body };
    console.log("Request body:", req.body);
    const { name, slug, category_id } = subCategoryData;
    console.log("Received subcategory data:", subCategoryData);
    if (!name || !slug || !category_id) {
      return res.status(400).json({message: "Name, slug, and category_id are required fields" });
    }
    if ( req.file ) {
      subCategoryData.subcategory_image_url = req.file.filename;
    }

    const createdSubCategory = await subCategoryService.addSubCategory(subCategoryData);
    res.status(201).json({ data: createdSubCategory });
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// update subcategory
export const updateSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if subcategory exists first
    const existingSubCategory = await subCategoryService.getSubCategoryById(id);
    if (!existingSubCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Prepare update data from request body
    const updateData = { ...req.body };

    // Validate only if fields are being updated and should not be empty
    const { name, slug, category_id } = updateData;
    
   
    if (name !== undefined && !name) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    if (slug !== undefined && !slug) {
      return res.status(400).json({ message: "Slug cannot be empty" });
    }
    if (category_id !== undefined && !category_id) {
      return res.status(400).json({ message: "Category ID cannot be empty" });
    }

    // Handle image update if new file is uploaded
    if (req.file) {
      if (existingSubCategory.subcategory_image_url) {
        const oldImagePath = path.join('uploads/SubCategory', existingSubCategory.subcategory_image_url);
        try {
          if (fs.existsSync(oldImagePath)) {
            await fs.promises.unlink(oldImagePath);
          }
        } catch (err) {
          console.error('✗ Error deleting old image:', err.message);
        }
      }
      // Add new image to updated data
      updateData.subcategory_image_url = req.file.filename;
    }

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
    if (deletedSubCategory.subcategory_image_url) {
      const imagePath = path.join('uploads/SubCategory', deletedSubCategory.subcategory_image_url);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete subcategory image:', err);
        }
      });
    }

    res.status(200).json({ message: 'SubCategory deleted successfully' });
  } catch (error) {
    next(error);
  }
};


export const getAllSubCategoriesWithServicesCount = async (req, res, next) => {
  try {
    const subCategories = await subCategoryService.getAllSubcategoriesWithServicesCount();
    res.status(200).json({ data: subCategories });
  } catch (error) {
    next(error);
  }
}

// =============================================
//            Manage Subcategory
// =============================================

export const updateSubcategoryStatusHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'is_active must be a boolean value.'
      });
    }

    const updatedSubcategory = await subcategoryService.updateSubcategoryStatus(
      id,
      is_active
    );

    if (!updatedSubcategory) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Subcategory not found'
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: 'Subcategory status updated successfully',
      data: updatedSubcategory
    });
  } catch (error) {
    next(error);
  }
};
