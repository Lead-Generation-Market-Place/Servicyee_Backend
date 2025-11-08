import Lead from "../../models/leadModel.js";

import ProfessionalLead from "../../models/professionalLeadModel.js";
import servicesModel from "../../models/servicesModel.js";
import mongoose from 'mongoose';
import professionalServicesModel from "../../models/professionalServicesModel.js";

// ================================================
//            New Create lead service
// ================================================

export const createLeadService = async ({
  service_id,
  user_id,
  title,
  note,
  answers,
  files,
  user_location,
  send_option,
  selectedProfessionals = [],
  professionalId,
}) => {
  // 1️⃣ Get service name (for validation/logging, not for professional selection)
  const service = await servicesModel.findById(service_id).select("service_name");
  if (!service) throw new Error("Invalid service_id");

  // 2️⃣ Determine which professionals to assign
  let professionals = [];

  if (send_option === "top5") {
    // Use the professionalIds passed from controller (top 5 + selected professional)
    professionals = selectedProfessionals;
    // console.log(`🎯 Using pre-selected top 5 professionals: ${professionals.length} professionals`);
    
  } else if (send_option === "selected") {
    // If specific professional is selected
    if (professionalId) {
      professionals = [professionalId];
      // console.log(`🎯 Using selected professional: ${professionalId}`);
    } else if (selectedProfessionals.length > 0) {
      professionals = selectedProfessionals;
      // console.log(`🎯 Using selected professionals: ${professionals.length} professionals`);
    }
  } else {
    // Fallback to selected professionals
    professionals = selectedProfessionals;
    // console.log(`🎯 Using fallback professionals: ${professionals.length} professionals`);
  }

  // 3️⃣ Create Lead
  const lead = await Lead.create({
    service_id,
    user_id,
    title,
    note,
    answers,
    files,
    user_location,
    send_option,
    professionals,
  });

  // 4️⃣ Create ProfessionalLead assignments
  let assignedCount = 0;
  
  if (professionals.length > 0) {
    const assignments = professionals.map((proId) => ({
      lead_id: lead._id,
      professional_id: proId,
      status: "sent",
      read_by_pro: false,
      available: true,
      expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
    }));

    try {
      await ProfessionalLead.insertMany(assignments, { ordered: false });
      assignedCount = assignments.length;
      console.log(`✅ Lead sent to ${assignedCount} professionals`);
    } catch (err) {
      if (err.code === 11000) {
        console.warn("⚠️ Some duplicates skipped during ProfessionalLead creation");
        // Count successful insertions despite duplicates
        assignedCount = professionals.length;
      } else {
        console.error("❌ Error inserting ProfessionalLead entries:", err);
        throw err;
      }
    }
  } else {
    console.warn("⚠️ No professionals assigned for this lead");
  }

  return { lead, assigned: assignedCount };
};


// ================================================
//          New Create Lead service ends
// ================================================

// export const createLeadService = async ({ service_id, user_id, note, answers, files }) => {
//   // 1. Fetch the service name to use as title
//   const service = await servicesModel.findById(service_id).select("service_name");
//   if (!service) {
//     throw new Error("Invalid service_id");
//   }
//   console.log(service.service_name);
//   // 2. Create the lead
//   const lead = await Lead.create({
//     service_id,
//     user_id,
//     title: service.service_name, // auto-set title
//     note,
//     answers,
//     files,
//   });

//   // 3. Find top 5 professionals for this service
//   const professionals = await professionalServicesModel.find({
//     service_id: service_id,
//     service_availability: true, // uncomment when available
//   })
//     .sort({ rating_avg: -1 }) // highest rating first
//     .limit(5)
//     .select("_id");

 

//   if (!professionals.length) {
//     console.warn("No professionals found for this service");
//     return { lead, assigned: 0 };
//   }

//   // 4. Create ProfessionalLead records
//   const assignments = professionals.map((pro) => ({
//     lead_id: lead._id,
//     professional_id: pro._id,
//     status: "sent",
//     read_by_pro: false,
//     available: true,
//     expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expired in one week
//   }));

//   await ProfessionalLead.insertMany(assignments);

//   return { lead, assigned: professionals.length };
// };


export const acceptLeadService = async ({leadId, professionalId}) => {
  const accepted = await ProfessionalLead.findOneAndUpdate(
    {lead_id:leadId, professional_id:professionalId, available:true},
    {status: "accepted", available: true},
    {new: true}
  ); 

  if (!accepted) {
    throw new Error("Lead not available or already accepted");
  }
  await ProfessionalLead.updateMany(
    {lead_id: leadId, professional_id:{$ne:professionalId}},
    {available: false}
  );

  return accepted;
}


// services/LeadServices.ts
export const getProfessionalLeads = async (professionalId) => {
  try {
    const professionalLeads = await ProfessionalLead.aggregate([
      {
        $match: {
          professional_id: new mongoose.Types.ObjectId(professionalId)
        }
      },
      {
        $lookup: {
          from: 'leads',
          localField: 'lead_id',
          foreignField: '_id',
          as: 'lead'
        }
      },
      {
        $unwind: '$lead'
      },
      {
        $lookup: {
          from: 'services',
          localField: 'lead.service_id',
          foreignField: '_id',
          as: 'lead.service'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lead.user_id',
          foreignField: '_id',
          as: 'lead.user'
        }
      },
      {
        $unwind: '$lead.service'
      },
      {
        $unwind: '$lead.user'
      },
      {
        $project: {
          status: 1,
          read_by_pro: 1,
          available: 1,
          expire_at: 1,
          created_at: 1,
          'lead._id': 1,
          'lead.title': 1,
          'lead.answers': 1,
          'lead.note': 1,
          'lead.files': 1,
          'lead.user_location': 1,
          'lead.send_option': 1,
          'lead.created_at': 1,
          'lead.service.name': 1,
          'lead.service.category': 1,
          'lead.user.name': 1,
          'lead.user.email': 1,
          'lead.user.phone': 1
        }
      },
      {
        $sort: { created_at: -1 }
      }
    ]);

    return professionalLeads;
  } catch (error) {
    console.error('Error fetching professional leads:', error);
    throw error;
  }
}