import { createProfessional, getProfessionalById, getAllProfessionals, updateProfessional, deleteProfessional } from '../services/ProfessionalServices.js';

export async function createProfessionalHandler(req, res) {
  try {
    const professional = await createProfessional(req.body);
    res.status(201).json(professional);
  } catch (error) {
    res.status(500).json({ message: 'Error creating professional', error });
  }
}

export async function getProfessionalByIdHandler(req, res) {
  try {
    const professional = await getProfessionalById(req.params.id);
    if (!professional) return res.status(404).json({ message: 'Professional not found' });
    res.json(professional);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching professional', error });
  }
}

export async function getAllProfessionalsHandler(req, res) {
  try {
    const professionals = await getAllProfessionals();
    res.json(professionals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching professionals', error });
  }
}

export async function updateProfessionalHandler(req, res) {
  try {
    const professional = await updateProfessional(req.params.id, req.body);
    res.json(professional);
  } catch (error) {
    res.status(500).json({ message: 'Error updating professional', error });
  }
}

export async function deleteProfessionalHandler(req, res) {
  try {
    await deleteProfessional(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting professional', error });
  }
}

// ...existing code...
