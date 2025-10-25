import Lead from "../models/leadModel.js";
import Professional from "../models/ProfessionalModel.js";
import ProfessionalLead from "../models/professionalLeadModel.js";
import servicesModel from "../models/servicesModel.js";
import professionalServicesModel from "../models/professionalServicesModel.js";

// ================================================
//            New Create lead service
// ================================================
export const createLeadService = async ({
  service_id,
  user_id,
  note,
  answers,
  files,
  user_location,
  send_option,
  selectedProfessionals = [],
}) => {
  // 1️⃣ Get service name
  const service = await servicesModel.findById(service_id).select("service_name");
  if (!service) throw new Error("Invalid service_id");

  // 2️⃣ Create Lead
  const lead = await Lead.create({
    service_id,
    user_id,
    title: service.service_name,
    note,
    answers,
    files,
    user_location,
    send_option,
  });

  // 3️⃣ Determine which professionals to assign
  let professionals = [];

  if (send_option === "top5") {
    professionals = await professionalServicesModel
      .find({ service_id, service_availability: true })
      .sort({ rating_avg: -1 })
      .limit(5)
      .select("_id");
  } else {
    professionals = selectedProfessionals.map((id) => ({ _id: id }));
  }

  if (!professionals.length) {
    console.warn("⚠️ No professionals found for this service.");
    return { lead, assigned: 0 };
  }

  // 4️⃣ Assign to professionals
  const assignments = professionals.map((pro) => ({
    lead_id: lead._id,
    professional_id: pro._id,
    status: "sent",
    read_by_pro: false,
    available: true,
    expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }));

  await ProfessionalLead.insertMany(assignments);

  return { lead, assigned: professionals.length };
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