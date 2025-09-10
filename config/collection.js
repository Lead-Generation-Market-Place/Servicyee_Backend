
import mongoose, { Schema, Types, model, models } from 'mongoose';


const { ObjectId } = Types;

type ObjectIdT = Types.ObjectId;


export const UserStatus = ['suspend', 'active'] as const;
export const AccountType = ['free', 'pro'] as const;
export const BusinessType = ['company', 'individual', 'sub-contractor'] as const;
export const MediaType = ['photo', 'video'] as const;
export const OpenClose = ['open', 'close'] as const;
export const PricingType = ['fixed', 'hourly', 'per_project'] as const;
export const CardType = ['visa', 'master_card', 'bank_account'] as const;
export const CreditTxnType = ['deduction', 'addition', 'purchase', 'refund'] as const;
export const RelatedFeature = ['search_visibility','credit_purchase','search_ranking','accept_leads'] as const;
export const TicketType = ['profile_visibility', 'refund'] as const;
export const TicketChannel = ['email', 'livechat'] as const;
export const TicketStatus = ['open', 'close'] as const;
export const ReviewType = ['pending','approved','decline'] as const;
export const VehicleType = ['car','bike'] as const;
export const TravelStatus = ['p-c','c-p','online','others'] as const; // provider->customer, etc.
export const OfferStatus = ['sent','opened','accepted','rejected'] as const;

/** Common sub-schemas */
const AddressSchema = new Schema({
  state: { type: String, index: true },
  zipcode: { type: String, index: true },
  city: { type: String, index: true },
  country: { type: String, index: true },
  street_address: { type: String }
}, { _id: false });

/** Users */
export interface IUser {
  _id: ObjectIdT;
  username: string;
  email: string;
  phone?: string;
  status: typeof UserStatus[number];
  isEmailVerified: boolean;
  account_type: typeof AccountType[number];
  verification_status: boolean;
  password: string;
  two_factor_authentication: boolean;
  last_login?: Date;
  login_ip_address?: string;
  profile_image_url?: string;
  login_attempts: number;
  timezone?: string;
  roles: ObjectIdT[]; // Role refs
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  status: { type: String, enum: UserStatus, default: 'active' },
  isEmailVerified: { type: Boolean, default: false },
  account_type: { type: String, enum: AccountType, default: 'free' },
  verification_status: { type: Boolean, default: false },
  password: { type: String, required: true },
  two_factor_authentication: { type: Boolean, default: false },
  last_login: { type: Date },
  login_ip_address: { type: String },
  profile_image_url: { type: String },
  login_attempts: { type: Number, default: 0 },
  timezone: { type: String },
  roles: [{ type: ObjectId, ref: 'Role', index: true }]
}, { timestamps: true, versionKey: false, collection: 'users' });

UserSchema.index({ username: 1, email: 1 });

/** Roles */
export interface IRole {
  _id: ObjectIdT;
  name: string;
  status: boolean;
  permissions: ObjectIdT[];
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true, index: true },
  status: { type: Boolean, default: true },
  permissions: [{ type: ObjectId, ref: 'Permission' }]
}, { timestamps: true, versionKey: false, collection: 'roles' });

/** Permissions */
export interface IPermission { _id: ObjectIdT; name: string; status: boolean; }
const PermissionSchema = new Schema<IPermission>({
  name: { type: String, required: true, unique: true, index: true },
  status: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false, collection: 'permissions' });

/** Categories & Subcategories (for Services & Insurance) */
export interface ICategory { _id: ObjectIdT; name: string; parentId?: ObjectIdT | null; kind?: 'service' | 'insurance'; }
const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, index: true },
  parentId: { type: ObjectId, ref: 'Category', default: null }, // null = top-level category
  kind: { type: String, enum: ['service','insurance'], default: 'service', index: true }
}, { timestamps: true, versionKey: false, collection: 'categories' });

CategorySchema.index({ name: 1, kind: 1 }, { unique: true });

/** Locations */
export interface ILocation { _id: ObjectIdT; state?: string; zipcode?: string; city?: string; country?: string; street_address?: string; }
const LocationSchema = new Schema<ILocation>({
  state: String,
  zipcode: String,
  city: String,
  country: String,
  street_address: String
}, { timestamps: true, versionKey: false, collection: 'locations' });

LocationSchema.index({ country: 1, state: 1, city: 1, zipcode: 1 });

/** Professionals */
export interface IProfessional {
  _id: ObjectIdT;
  user_id: ObjectIdT; // user ref
  business_name?: string;
  introduction?: string;
  ssn?: string;
  business_type?: typeof BusinessType[number];
  number_of_employee?: number;
  business_profile_url?: string;
  background_check_status: boolean;
  guarantee: boolean;
  total_hire: number;
  total_review: number;
  credit_balance: number;
  rating_avg: number;
  last_seen_at?: Date;
  last_activity?: Date;
  last_hire_date?: Date;
  portfolio: Array<{ service_id?: ObjectIdT; media_type: typeof MediaType[number]; media_url: string }>;
  licenses: Array<{ state?: string; license_number?: string; issue_date?: Date; expiry_date?: Date; document_url?: string }>;
  business_hours: Array<{ service_id?: ObjectIdT; status: typeof OpenClose[number]; start_time: Date; end_time: Date; day: number; timezone?: string }>;
  specializations: Array<{ service_id: ObjectIdT; specialization_tag: string }>;
}

const ProfessionalSchema = new Schema<IProfessional>({
  user_id: { type: ObjectId, ref: 'User', required: true, index: true },
  business_name: String,
  introduction: String,
  ssn: String,
  business_type: { type: String, enum: BusinessType },
  number_of_employee: Number,
  business_profile_url: String,
  background_check_status: { type: Boolean, default: false },
  guarantee: { type: Boolean, default: false },
  total_hire: { type: Number, default: 0 },
  total_review: { type: Number, default: 0 },
  credit_balance: { type: Number, default: 0 },
  rating_avg: { type: Number, default: 0 },
  last_seen_at: Date,
  last_activity: Date,
  last_hire_date: Date,

  portfolio: [{
    service_id: { type: ObjectId, ref: 'Service' },
    media_type: { type: String, enum: MediaType },
    media_url: String
  }],

  licenses: [{
    state: String,
    license_number: String,
    issue_date: Date,
    expiry_date: Date,
    document_url: String
  }],

  business_hours: [{
    service_id: { type: ObjectId, ref: 'Service' },
    status: { type: String, enum: OpenClose },
    start_time: { type: Date },
    end_time: { type: Date },
    day: { type: Number, min: 0, max: 6 },
    timezone: String
  }],

  specializations: [{
    service_id: { type: ObjectId, ref: 'Service', required: true },
    specialization_tag: { type: String, required: true, index: true }
  }]
}, { timestamps: true, versionKey: false, collection: 'professionals' });

ProfessionalSchema.index({ user_id: 1 });
ProfessionalSchema.index({ 'specializations.service_id': 1, 'specializations.specialization_tag': 1 });

/** Services */
export interface IService {
  _id: ObjectIdT;
  professional_id: ObjectIdT;
  category_id: ObjectIdT; // category/subcategory id
  location_id?: ObjectIdT;
  maximum_price?: number;
  minimum_price?: number;
  service_status: boolean;
  description?: string;
  portfolio_ids?: ObjectIdT[]; // optional external file links
  completed_tasks?: number;
  featured_projects?: ObjectIdT[]; // refs to FeaturedProject
  business_availability?: boolean; // availability switch
  pricing_type: typeof PricingType[number];
}

const ServiceSchema = new Schema<IService>({
  professional_id: { type: ObjectId, ref: 'Professional', required: true, index: true },
  category_id: { type: ObjectId, ref: 'Category', required: true, index: true },
  location_id: { type: ObjectId, ref: 'Location' },
  maximum_price: Number,
  minimum_price: Number,
  service_status: { type: Boolean, default: true },
  description: String,
  portfolio_ids: [{ type: ObjectId, ref: 'FilePath' }],
  completed_tasks: { type: Number, default: 0 },
  featured_projects: [{ type: ObjectId, ref: 'FeaturedProject' }],
  business_availability: { type: Boolean, default: true },
  pricing_type: { type: String, enum: PricingType, default: 'fixed' }
}, { timestamps: true, versionKey: false, collection: 'services' });

ServiceSchema.index({ professional_id: 1, category_id: 1 });

/** Service Questions (dynamic onboarding / lead forms) */
export interface IQuestion {
  _id: ObjectIdT;
  service_id: ObjectIdT; // which service this question belongs to (subcategory-level is also fine)
  question_name: string;
  form_type: 'checkbox' | 'radio' | 'text' | 'select' | 'number' | 'date';
  options?: string[]; // for checkbox/radio/select
  required?: boolean;
  order?: number;
  active?: boolean;
}

const QuestionSchema = new Schema<IQuestion>({
  service_id: { type: ObjectId, ref: 'Category', required: true, index: true },
  question_name: { type: String, required: true },
  form_type: { type: String, enum: ['checkbox','radio','text','select','number','date'], required: true },
  options: [{ type: String }],
  required: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false, collection: 'questions' });

/** Answers */
export interface IAnswer {
  _id: ObjectIdT;
  question_id: ObjectIdT;
  lead_id?: ObjectIdT; // tie to a lead if part of intake
  professional_id?: ObjectIdT; // or to a professional if profile config
  user_id?: ObjectIdT; // answering user
  answers: any; // jsonb-like, can be array/string/number
}

const AnswerSchema = new Schema<IAnswer>({
  question_id: { type: ObjectId, ref: 'Question', required: true, index: true },
  lead_id: { type: ObjectId, ref: 'Lead' },
  professional_id: { type: ObjectId, ref: 'Professional' },
  user_id: { type: ObjectId, ref: 'User' },
  answers: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true, versionKey: false, collection: 'answers' });

/** Reviews */
export interface IReview {
  _id: ObjectIdT;
  user_id: ObjectIdT;
  professional_id: ObjectIdT;
  rating: number; // 1-5
  message?: string;
  reply_time?: Date;
  reply_message?: string;
  review_type: typeof ReviewType[number];
  tags?: string[];
  isHelpful?: number;
  photos?: Array<{ media_url: string }>; // embedded review photos
}

const ReviewSchema = new Schema<IReview>({
  user_id: { type: ObjectId, ref: 'User', required: true, index: true },
  professional_id: { type: ObjectId, ref: 'Professional', required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  message: String,
  reply_time: Date,
  reply_message: String,
  review_type: { type: String, enum: ReviewType, default: 'pending', index: true },
  tags: [{ type: String }],
  isHelpful: { type: Number, default: 0 },
  photos: [{ media_url: String }]
}, { timestamps: true, versionKey: false, collection: 'reviews' });

ReviewSchema.index({ professional_id: 1, createdAt: -1 });

/** Credit Packages */
export interface ICreditPackage {
  _id: ObjectIdT;
  name: string;
  amount: number;
  price: number;
  type: 'weekly' | 'monthly' | 'annual';
}

const CreditPackageSchema = new Schema<ICreditPackage>({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['weekly','monthly','annual'], required: true }
}, { timestamps: true, versionKey: false, collection: 'credit_packages' });

/** Card Details */
export interface ICardDetail {
  _id: ObjectIdT;
  user_id: ObjectIdT;
  card_number: string; // store tokenized/last4, not raw PAN!
  card_type: typeof CardType[number];
  expire_year: number;
  expire_month: number;
  card_holder_name?: string;
  billing_address?: string;
}

const CardDetailSchema = new Schema<ICardDetail>({
  user_id: { type: ObjectId, ref: 'User', required: true, index: true },
  card_number: { type: String, required: true }, // store token/last4
  card_type: { type: String, enum: CardType, required: true },
  expire_year: { type: Number, required: true },
  expire_month: { type: Number, required: true },
  card_holder_name: String,
  billing_address: String
}, { timestamps: true, versionKey: false, collection: 'card_details' });

/** Credit Transactions */
export interface ICreditTransaction {
  _id: ObjectIdT;
  user_id: ObjectIdT;
  transaction_amount: number;
  type: typeof CreditTxnType[number];
  transaction_reason?: string;
  related_feature?: typeof RelatedFeature[number];
}

const CreditTransactionSchema = new Schema<ICreditTransaction>({
  user_id: { type: ObjectId, ref: 'User', required: true, index: true },
  transaction_amount: { type: Number, required: true },
  type: { type: String, enum: CreditTxnType, required: true, index: true },
  transaction_reason: String,
  related_feature: { type: String, enum: RelatedFeature }
}, { timestamps: true, versionKey: false, collection: 'credit_transactions' });

/** Support Tickets */
export interface ISupportTicket {
  _id: ObjectIdT;
  subject: string;
  type: typeof TicketType[number];
  channel: typeof TicketChannel[number];
  status: typeof TicketStatus[number];
  professional_id?: ObjectIdT;
}

const SupportTicketSchema = new Schema<ISupportTicket>({
  subject: { type: String, required: true },
  type: { type: String, enum: TicketType, required: true },
  channel: { type: String, enum: TicketChannel, required: true },
  status: { type: String, enum: TicketStatus, default: 'open', index: true },
  professional_id: { type: ObjectId, ref: 'Professional', index: true }
}, { timestamps: true, versionKey: false, collection: 'support_tickets' });

/** FAQ */
export interface IFAQ {
  _id: ObjectIdT;
  question: string;
  answer: string;
  service_id?: ObjectIdT; // can target a subservice/category
  professional_id?: ObjectIdT;
}

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  service_id: { type: ObjectId, ref: 'Category' },
  professional_id: { type: ObjectId, ref: 'Professional' }
}, { timestamps: true, versionKey: false, collection: 'faqs' });

/** Travel Time */
export interface ITravelTime {
  _id: ObjectIdT;
  service_id: ObjectIdT; // which service (category/subservice)
  location_id: ObjectIdT;
  travel_time: string; // store as ISO duration or minutes text
  vehicle_type: typeof VehicleType[number];
  travel_status: typeof TravelStatus[number];
}

const TravelTimeSchema = new Schema<ITravelTime>({
  service_id: { type: ObjectId, ref: 'Category', required: true, index: true },
  location_id: { type: ObjectId, ref: 'Location', required: true, index: true },
  travel_time: { type: String, required: true },
  vehicle_type: { type: String, enum: VehicleType, required: true },
  travel_status: { type: String, enum: TravelStatus, required: true }
}, { timestamps: true, versionKey: false, collection: 'travel_times' });

/** File Paths */
export interface IFilePath {
  _id: ObjectIdT;
  file_type: typeof MediaType[number];
  file_url: string;
  file_fav?: boolean;
  owner_user_id?: ObjectIdT;
  owner_professional_id?: ObjectIdT;
}

const FilePathSchema = new Schema<IFilePath>({
  file_type: { type: String, enum: MediaType, required: true },
  file_url: { type: String, required: true },
  file_fav: { type: Boolean, default: false },
  owner_user_id: { type: ObjectId, ref: 'User' },
  owner_professional_id: { type: ObjectId, ref: 'Professional' }
}, { timestamps: true, versionKey: false, collection: 'file_paths' });

/** Featured Projects */
export interface IFeaturedProject {
  _id: ObjectIdT;
  service_id: ObjectIdT; // a specific Service doc
  location_id?: ObjectIdT;
  file_path_ids?: ObjectIdT[]; // gallery
  title?: string;
  description?: string;
}

const FeaturedProjectSchema = new Schema<IFeaturedProject>({
  service_id: { type: ObjectId, ref: 'Service', required: true, index: true },
  location_id: { type: ObjectId, ref: 'Location' },
  file_path_ids: [{ type: ObjectId, ref: 'FilePath' }],
  title: String,
  description: String
}, { timestamps: true, versionKey: false, collection: 'featured_projects' });

/** Leads */
export interface ILead {
  _id: ObjectIdT;
  location_id: ObjectIdT;
  service_id: ObjectIdT; // category/subservice or Service?
  professional_id?: ObjectIdT; // optional if lead is broadcast to many
  question_ids?: ObjectIdT[]; // which questions were asked
  user_id: ObjectIdT; // customer
  isUrgent: boolean;
  leadDuration?: { start?: Date; end?: Date };
  quickResponse?: boolean;
  answers?: ObjectIdT[]; // Answer docs captured for this lead
}

const LeadSchema = new Schema<ILead>({
  location_id: { type: ObjectId, ref: 'Location', required: true, index: true },
  service_id: { type: ObjectId, ref: 'Category', required: true, index: true },
  professional_id: { type: ObjectId, ref: 'Professional' },
  question_ids: [{ type: ObjectId, ref: 'Question' }],
  user_id: { type: ObjectId, ref: 'User', required: true, index: true },
  isUrgent: { type: Boolean, default: false },
  leadDuration: { start: Date, end: Date },
  quickResponse: { type: Boolean, default: false },
  answers: [{ type: ObjectId, ref: 'Answer' }]
}, { timestamps: true, versionKey: false, collection: 'leads' });

LeadSchema.index({ service_id: 1, location_id: 1, createdAt: -1 });

/** Notifications */
export interface INotification {
  _id: ObjectIdT;
  user_id?: ObjectIdT;
  professional_id?: ObjectIdT;
  type: string;
  title: string;
  message?: string;
  read: boolean;
  meta?: any;
}

const NotificationSchema = new Schema<INotification>({
  user_id: { type: ObjectId, ref: 'User' },
  professional_id: { type: ObjectId, ref: 'Professional' },
  type: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: String,
  read: { type: Boolean, default: false, index: true },
  meta: Schema.Types.Mixed
}, { timestamps: true, versionKey: false, collection: 'notifications' });

NotificationSchema.index({ user_id: 1, professional_id: 1, read: 1, createdAt: -1 });

/** Conversations & Messages */
export interface IConversation {
  _id: ObjectIdT;
  participant_user_ids: ObjectIdT[]; // users (customers)
  participant_professional_ids: ObjectIdT[]; // professionals
  last_message_at?: Date;
}

const ConversationSchema = new Schema<IConversation>({
  participant_user_ids: [{ type: ObjectId, ref: 'User', index: true }],
  participant_professional_ids: [{ type: ObjectId, ref: 'Professional', index: true }],
  last_message_at: { type: Date, index: true }
}, { timestamps: true, versionKey: false, collection: 'conversations' });

ConversationSchema.index({ updatedAt: -1 });

export interface IMessage {
  _id: ObjectIdT;
  conversation_id: ObjectIdT;
  sender_user_id?: ObjectIdT;
  sender_professional_id?: ObjectIdT;
  text?: string;
  attachments?: ObjectIdT[]; // FilePath refs
  read_by?: ObjectIdT[]; // user/professional ids that read
}

const MessageSchema = new Schema<IMessage>({
  conversation_id: { type: ObjectId, ref: 'Conversation', required: true, index: true },
  sender_user_id: { type: ObjectId, ref: 'User' },
  sender_professional_id: { type: ObjectId, ref: 'Professional' },
  text: String,
  attachments: [{ type: ObjectId, ref: 'FilePath' }],
  read_by: [{ type: ObjectId }]
}, { timestamps: true, versionKey: false, collection: 'messages' });

MessageSchema.index({ conversation_id: 1, createdAt: 1 });

/** Professional Search Log */
export interface IProfessionalSearchLog {
  _id: ObjectIdT;
  user_id: ObjectIdT; // customer who searched
  subservice_id: ObjectIdT; // Category (subservice) id
  search_keywords?: string;
  search_time?: Date;
  top_provider_ids?: ObjectIdT[]; // Professional ids
}

const ProfessionalSearchLogSchema = new Schema<IProfessionalSearchLog>({
  user_id: { type: ObjectId, ref: 'User', required: true, index: true },
  subservice_id: { type: ObjectId, ref: 'Category', required: true, index: true },
  search_keywords: String,
  search_time: { type: Date, default: Date.now },
  top_provider_ids: [{ type: ObjectId, ref: 'Professional' }]
}, { timestamps: true, versionKey: false, collection: 'professional_search_logs' });

ProfessionalSearchLogSchema.index({ subservice_id: 1, search_time: -1 });

/** Professional Offers */
export interface IProfessionalOffer {
  _id: ObjectIdT;
  search_log_id: ObjectIdT; // links to search log
  provider_id: ObjectIdT; // professional id
  request_id?: ObjectIdT; // could map to Lead id
  status: typeof OfferStatus[number];
  opened_at?: Date;
  accepted_at?: Date;
  rejected_at?: Date;
  credits_deducted: boolean;
}

const ProfessionalOfferSchema = new Schema<IProfessionalOffer>({
  search_log_id: { type: ObjectId, ref: 'ProfessionalSearchLog', required: true, index: true },
  provider_id: { type: ObjectId, ref: 'Professional', required: true, index: true },
  request_id: { type: ObjectId, ref: 'Lead' },
  status: { type: String, enum: OfferStatus, default: 'sent', index: true },
  opened_at: Date,
  accepted_at: Date,
  rejected_at: Date,
  credits_deducted: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false, collection: 'professional_offers' });

ProfessionalOfferSchema.index({ search_log_id: 1, provider_id: 1 }, { unique: true });

/** Insurance taxonomy (if distinct from general categories) */
export interface IInsuranceCategory { _id: ObjectIdT; name: string; }
export interface IInsuranceSubcategory { _id: ObjectIdT; category_id: ObjectIdT; name: string; }

const InsuranceCategorySchema = new Schema<IInsuranceCategory>({
  name: { type: String, required: true, unique: true, index: true }
}, { timestamps: true, versionKey: false, collection: 'insurance_categories' });

const InsuranceSubcategorySchema = new Schema<IInsuranceSubcategory>({
  category_id: { type: ObjectId, ref: 'InsuranceCategory', required: true, index: true },
  name: { type: String, required: true }
}, { timestamps: true, versionKey: false, collection: 'insurance_subcategories' });

InsuranceSubcategorySchema.index({ category_id: 1, name: 1 }, { unique: true });

/** Models (prevent OverwriteModelError in Next.js dev) */
export const User = models.User || model<IUser>('User', UserSchema);
export const Role = models.Role || model<IRole>('Role', RoleSchema);
export const Permission = models.Permission || model<IPermission>('Permission', PermissionSchema);
export const Category = models.Category || model<ICategory>('Category', CategorySchema);
export const Location = models.Location || model<ILocation>('Location', LocationSchema);
export const Professional = models.Professional || model<IProfessional>('Professional', ProfessionalSchema);
export const Service = models.Service || model<IService>('Service', ServiceSchema);
export const Question = models.Question || model<IQuestion>('Question', QuestionSchema);
export const Answer = models.Answer || model<IAnswer>('Answer', AnswerSchema);
export const Review = models.Review || model<IReview>('Review', ReviewSchema);
export const CreditPackage = models.CreditPackage || model<ICreditPackage>('CreditPackage', CreditPackageSchema);
export const CardDetail = models.CardDetail || model<ICardDetail>('CardDetail', CardDetailSchema);
export const CreditTransaction = models.CreditTransaction || model<ICreditTransaction>('CreditTransaction', CreditTransactionSchema);
export const SupportTicket = models.SupportTicket || model<ISupportTicket>('SupportTicket', SupportTicketSchema);
export const FAQ = models.FAQ || model<IFAQ>('FAQ', FAQSchema);
export const TravelTime = models.TravelTime || model<ITravelTime>('TravelTime', TravelTimeSchema);
export const FilePath = models.FilePath || model<IFilePath>('FilePath', FilePathSchema);
export const FeaturedProject = models.FeaturedProject || model<IFeaturedProject>('FeaturedProject', FeaturedProjectSchema);
export const Lead = models.Lead || model<ILead>('Lead', LeadSchema);
export const Notification = models.Notification || model<INotification>('Notification', NotificationSchema);
export const Conversation = models.Conversation || model<IConversation>('Conversation', ConversationSchema);
export const Message = models.Message || model<IMessage>('Message', MessageSchema);
export const ProfessionalSearchLog = models.ProfessionalSearchLog || model<IProfessionalSearchLog>('ProfessionalSearchLog', ProfessionalSearchLogSchema);
export const ProfessionalOffer = models.ProfessionalOffer || model<IProfessionalOffer>('ProfessionalOffer', ProfessionalOfferSchema);
export const InsuranceCategory = models.InsuranceCategory || model<IInsuranceCategory>('InsuranceCategory', InsuranceCategorySchema);
export const InsuranceSubcategory = models.InsuranceSubcategory || model<IInsuranceSubcategory>('InsuranceSubcategory', InsuranceSubcategorySchema);

/** Suggested compound indexes for search & ranking */
// Text search on professionals/services
ProfessionalSchema.index({ business_name: 'text', introduction: 'text' });
ServiceSchema.index({ description: 'text' });

/** Example usage (pseudo):
import { Professional, Service, Question, Answer } from './models';
// create professional, add services, create questions per subservice,
// record answers in a lead flow, then create offers to top providers.
*/

// End of file
