# FAQ System API Testing Guide

## Base URL Configuration
```
{{base_url}} = http://localhost:3000/api
{{auth_token}} = your_jwt_token_here
{{professional_id}} = 507f1f77bcf86cd799439011 (Replace with actual professional ID)
```

## Required Headers
```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

---

## 1. FAQ CRUD Operations

### Create FAQ
**Method:** POST  
**URL:** `{{base_url}}/professionals/{{professional_id}}/faqs`

**Body:**
```json
{
  "question": "What services do you offer?",
  "answer": "We offer comprehensive home repair services including plumbing, electrical work, HVAC maintenance, painting, and general handyman services.",
  "category": "Services",
  "priority": 1
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "FAQ created successfully",
  "faq": {
    "_id": "faq_id_here",
    "question": "What services do you offer?",
    "answer": "We offer comprehensive home repair services...",
    "professional_id": "507f1f77bcf86cd799439011",
    "category": "Services",
    "priority": 1,
    "view_count": 0,
    "helpful_count": 0,
    "not_helpful_count": 0,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Get FAQs by Professional
**Method:** GET  
**URL:** `{{base_url}}/professionals/{{professional_id}}/faqs?page=1&limit=10`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "faqs": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

### Get FAQ by ID
**Method:** GET  
**URL:** `{{base_url}}/professionals/faqs/{{faq_id}}`

**Response:**
```json
{
  "success": true,
  "faq": {
    "_id": "faq_id_here",
    "question": "What services do you offer?",
    "answer": "We offer comprehensive home repair services...",
    "professional_id": "507f1f77bcf86cd799439011",
    "category": "Services",
    "priority": 1,
    "view_count": 0,
    "helpful_count": 0,
    "not_helpful_count": 0,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Update FAQ
**Method:** PUT  
**URL:** `{{base_url}}/professionals/faqs/{{faq_id}}`

**Body:**
```json
{
  "question": "What home repair services do you offer?",
  "answer": "We offer comprehensive home repair services including plumbing, electrical work, HVAC maintenance, painting, general handyman services, roofing, and landscaping.",
  "category": "Services",
  "priority": 2
}
```

### Delete FAQ
**Method:** DELETE  
**URL:** `{{base_url}}/professionals/faqs/{{faq_id}}`

**Response:**
```json
{
  "success": true,
  "message": "FAQ deleted successfully"
}
```

---

## 2. Search & Discovery

### Search FAQs
**Method:** GET  
**URL:** `{{base_url}}/professionals/{{professional_id}}/faqs/search?query=services&page=1&limit=5`

**Query Parameters:**
- `query` (required): Search term
- `page` (optional): Page number
- `limit` (optional): Results per page

### Get Popular FAQs
**Method:** GET  
**URL:** `{{base_url}}/professionals/{{professional_id}}/faqs/popular?limit=5`

### Get Recent FAQs
**Method:** GET  
**URL:** `{{base_url}}/professionals/{{professional_id}}/faqs/recent?limit=5`

### Get FAQ Categories
**Method:** GET  
**URL:** `{{base_url}}/professionals/{{professional_id}}/faqs/categories`

**Response:**
```json
{
  "success": true,
  "categories": ["Services", "Pricing", "Schedule", "Payment"]
}
```

### Get FAQ Statistics
**Method:** GET  
**URL:** `{{base_url}}/professionals/{{professional_id}}/faqs/stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_faqs": 15,
    "total_views": 245,
    "total_helpful": 18,
    "total_not_helpful": 2,
    "categories": ["Services", "Pricing", "Schedule", "Payment"]
  }
}
```

---

## 3. User Interaction

### Increment View Count
**Method:** POST  
**URL:** `{{base_url}}/professionals/faqs/{{faq_id}}/view`

**Body:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "message": "View count updated",
  "view_count": 1
}
```

### Mark FAQ as Helpful
**Method:** POST  
**URL:** `{{base_url}}/professionals/faqs/{{faq_id}}/helpful`

**Body (Helpful):**
```json
{
  "is_helpful": true
}
```

**Body (Not Helpful):**
```json
{
  "is_helpful": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback recorded",
  "helpful_count": 3,
  "not_helpful_count": 1
}
```

---

## 4. Bulk Operations

### Create Multiple FAQs
**Method:** POST  
**URL:** `{{base_url}}/professionals/faqs/bulk`

**Body:**
```json
{
  "faqs": [
    {
      "question": "What are your working hours?",
      "answer": "We work Monday to Friday from 8 AM to 6 PM, and Saturday from 9 AM to 4 PM. Emergency services are available 24/7.",
      "category": "Schedule",
      "priority": 1
    },
    {
      "question": "Do you provide free estimates?",
      "answer": "Yes, we provide free estimates for most services. Emergency calls may have a small diagnostic fee which is applied to the final service cost.",
      "category": "Pricing",
      "priority": 2
    },
    {
      "question": "What payment methods do you accept?",
      "answer": "We accept cash, all major credit cards, debit cards, and bank transfers. We can also arrange payment plans for larger projects.",
      "category": "Payment",
      "priority": 3
    },
    {
      "question": "Do you guarantee your work?",
      "answer": "Yes, we provide a 90-day warranty on all labor and a 1-year warranty on parts for most services.",
      "category": "Warranty",
      "priority": 4
    },
    {
      "question": "How do I schedule a service?",
      "answer": "You can schedule a service by calling us at (555) 123-4567, emailing service@servicyee.com, or using our online booking system.",
      "category": "Scheduling",
      "priority": 5
    }
  ]
}
```

### Delete Multiple FAQs
**Method:** DELETE  
**URL:** `{{base_url}}/professionals/faqs/bulk`

**Body:**
```json
{
  "faq_ids": [
    "faq_id_1_here",
    "faq_id_2_here", 
    "faq_id_3_here"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 FAQs deleted successfully",
  "deleted_count": 3
}
```

---

## 5. Complete Test Data Set

Here's a complete set of dummy FAQs you can use for testing:

### Sample FAQ Data Set
```json
[
  {
    "question": "What services do you offer?",
    "answer": "We offer comprehensive home repair services including plumbing, electrical work, HVAC maintenance, painting, and general handyman services.",
    "category": "Services",
    "priority": 1
  },
  {
    "question": "How much do your services cost?",
    "answer": "Our pricing varies depending on the service required. We offer free estimates for most services. Basic maintenance starts at $50/hour.",
    "category": "Pricing",
    "priority": 2
  },
  {
    "question": "Do you provide emergency services?",
    "answer": "Yes, we provide 24/7 emergency services for urgent repairs such as water leaks, electrical issues, and heating/cooling problems.",
    "category": "Services",
    "priority": 3
  },
  {
    "question": "What are your business hours?",
    "answer": "We are open Monday through Friday 8 AM to 6 PM, Saturday 9 AM to 4 PM. Emergency services are available 24/7.",
    "category": "Schedule",
    "priority": 4
  },
  {
    "question": "Do you guarantee your work?",
    "answer": "Yes, we provide a 90-day warranty on all labor and a 1-year warranty on parts for most services.",
    "category": "Warranty",
    "priority": 5
  },
  {
    "question": "How do I schedule a service?",
    "answer": "You can schedule a service by calling us at (555) 123-4567, emailing service@servicyee.com, or using our online booking system.",
    "category": "Scheduling",
    "priority": 6
  },
  {
    "question": "What payment methods do you accept?",
    "answer": "We accept cash, all major credit cards, debit cards, and bank transfers. We can also arrange payment plans for larger projects.",
    "category": "Payment",
    "priority": 7
  },
  {
    "question": "Do you offer free estimates?",
    "answer": "Yes, we provide free estimates for most services. Emergency calls may have a small diagnostic fee which is applied to the final service cost.",
    "category": "Pricing",
    "priority": 8
  },
  {
    "question": "Are your technicians licensed and insured?",
    "answer": "Yes, all our technicians are fully licensed, insured, and undergo regular training to stay updated with the latest industry standards.",
    "category": "Credentials",
    "priority": 9
  },
  {
    "question": "What areas do you serve?",
    "answer": "We serve the Greater Metropolitan Area within a 50-mile radius. Contact us to confirm if we cover your location.",
    "category": "Service Area",
    "priority": 10
  }
]
```

---

## 6. Testing Workflow

### Recommended Testing Sequence:

1. **Create Single FAQ** - Test basic creation
2. **Create Multiple FAQs** - Test bulk creation with sample data
3. **Get All FAQs** - Test listing and pagination
4. **Search FAQs** - Test search functionality with different terms
5. **Get Categories** - Test category retrieval
6. **Get Statistics** - Check if stats are updating correctly
7. **View Count Test** - Increment view counts multiple times
8. **Helpfulness Test** - Mark FAQs as helpful/unhelpful
9. **Update FAQ** - Test updating existing FAQs
10. **Popular/Random Queries** - Test different search terms
11. **Delete Single FAQ** - Test single deletion
12. **Delete Multiple FAQs** - Test bulk deletion

### Test Scenarios:

#### Scenario 1: Home Repair Company
Create FAQs for a plumbing/electrical services company with categories:
- Services, Pricing, Schedule, Emergency, Payment

#### Scenario 2: HVAC Specialist  
Create FAQs for an HVAC company with categories:
- Installation, Maintenance, Emergency, Warranty, Service Area

#### Scenario 3: General Handyman
Create FAQs for a handyman service with categories:
- Services, Pricing, Availability, Materials, Quality

---

## 7. Expected Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Question is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "FAQ not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error creating FAQ",
  "error": "Detailed error message"
}
```

---

## 8. Postman Variables Setup

Create these variables in your Postman collection:

- `{{base_url}}`: `http://localhost:3000/api`
- `{{auth_token}}`: `your_jwt_token_here`
- `{{professional_id}}`: `507f1f77bcf86cd799439011`
- `{{faq_id}}`: Leave empty (will be set automatically)

---

## 9. Import and Run

1. Import the `Postman_FAQ_Collection.json` file into Postman
2. Update the `auth_token` variable with your JWT token
3. Update the `professional_id` variable with a valid professional ID
4. Run the "Complete FAQ Test Workflow" folder for automated testing
5. Or run individual requests to test specific functionality

The system is now ready for comprehensive testing with Postman!