# FAQ System - Final Testing Guide

## Overview
This FAQ system now supports:
- ✅ **No Pagination** - All FAQs are returned at once
- ✅ **Common Questions** - Same questions for all professionals 
- ✅ **Professional-Specific Questions** - Questions unique to each professional
- ✅ **Show FAQs for Professional** - Get all FAQs (common + professional-specific)
- ✅ **Submit Answers** - Update/save answers back to database

## Updated Model Schema

### FAQ Fields:
- `question` (required) - The FAQ question
- `answer` (optional) - The professional's answer (can be added later)
- `professional_id` (optional) - Reference to professional (null for common questions)
- `is_common` (boolean) - True for questions common to all professionals
- `createdAt` / `updatedAt` - Timestamps

## API Endpoints

### 1. Show All FAQs for a Professional (Common + Professional-Specific)
**GET** `/api/professionals/{{professional_id}}/faqs`

**Response:**
```json
{
  "success": true,
  "faqs": [
    {
      "_id": "common_faq_1",
      "question": "What services do you offer?",
      "answer": "We offer plumbing, electrical, HVAC services...",
      "is_common": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "_id": "professional_faq_1", 
      "question": "Do you provide emergency services?",
      "answer": null,
      "professional_id": "507f1f77bcf86cd799439011",
      "is_common": false,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 2
}
```

### 2. Get Only Common FAQs (Same for All Professionals)
**GET** `/api/professionals/faqs/common`

### 3. Get Only Professional-Specific FAQs
**GET** `/api/professionals/{{professional_id}}/faqs/professional-only`

### 4. Get FAQ Statistics
**GET** `/api/professionals/{{professional_id}}/faqs/stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_faqs": 10,
    "common_faqs": 5,
    "professional_faqs": 5,
    "faqs_with_answers": 8,
    "faqs_without_answers": 2
  }
}
```

### 5. Create FAQ

#### Create Common FAQ (same for all professionals)
**POST** `/api/professionals/{{professional_id}}/faqs`
```json
{
  "question": "What is your return policy?",
  "is_common": true
}
```

#### Create Professional-Specific FAQ
**POST** `/api/professionals/{{professional_id}}/faqs`
```json
{
  "question": "Do you provide emergency services?",
  "is_common": false,
  "answer": null
}
```

#### Create FAQ with Answer
**POST** `/api/professionals/{{professional_id}}/faqs`
```json
{
  "question": "What are your working hours?",
  "is_common": true,
  "answer": "Monday to Friday 9 AM to 6 PM"
}
```

### 6. Update FAQ (Submit/Update Answer)
**PUT** `/api/professionals/faqs/{{faq_id}}`

```json
{
  "answer": "Yes, we provide 24/7 emergency services for urgent repairs!"
}
```

### 7. Get Single FAQ
**GET** `/api/professionals/faqs/{{faq_id}}`

### 8. Delete FAQ
**DELETE** `/api/professionals/faqs/{{faq_id}}`

---

## Sample Test Data

### Create Common FAQs
```bash
# Common FAQ 1 - Service Categories
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "question": "What categories of services do you offer?",
    "answer": "We offer home repair services including plumbing, electrical, HVAC, painting, and general handyman work.",
    "is_common": true
  }' \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs"

# Common FAQ 2 - Emergency Policy
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "question": "Do you provide emergency services?",
    "answer": "Emergency services are available 24/7 for urgent repairs such as water leaks, electrical issues, and heating/cooling problems.",
    "is_common": true
  }' \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs"

# Common FAQ 3 - Working Hours
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "question": "What are your standard working hours?",
    "answer": "We work Monday through Friday 8 AM to 6 PM, and Saturday 9 AM to 4 PM.",
    "is_common": true
  }' \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs"
```

### Create Professional-Specific FAQs
```bash
# Professional FAQ 1 - Question only (no answer)
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "question": "Do you specialize in commercial projects?",
    "is_common": false
  }' \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs"

# Professional FAQ 2 - With answer
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "question": "What areas do you serve?",
    "answer": "We serve the Greater Metropolitan Area within a 50-mile radius.",
    "is_common": false
  }' \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs"
```

### Test Different Scenarios

#### Get All FAQs for Professional (Common + Professional)
```bash
curl -X GET \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs"
```

#### Get Only Common FAQs
```bash
curl -X GET \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  "http://localhost:3000/api/professionals/faqs/common"
```

#### Get Only Professional-Specific FAQs
```bash
curl -X GET \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs/professional-only"
```

#### Submit Answer to Question-Only FAQ
```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "answer": "Yes, we specialize in both residential and commercial projects with over 15 years of experience."
  }' \
  "http://localhost:3000/api/professionals/faqs/$FAQ_ID"
```

#### Get FAQ Statistics
```bash
curl -X GET \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs/stats"
```

---

## Query Parameters for Get FAQs

### `GET /api/professionals/{{professional_id}}/faqs`

- `includeCommon=true` (default) - Include common FAQs
- `includeCommon=false` - Only professional-specific FAQs  
- `professionalOnly=true` - Only professional-specific FAQs
- `professionalOnly=false` (default) - Include common FAQs

**Examples:**
- `?includeCommon=false` - Get only professional-specific FAQs
- `?professionalOnly=true` - Get only professional-specific FAQs

---

## Testing Workflow

1. **Create common FAQs** (same for all professionals)
2. **Create professional-specific FAQs** (unique to each professional)
3. **Get all FAQs for professional** (should include both types)
4. **Test answer submission** (update questions without answers)
5. **Verify statistics** (check counts and status)
6. **Clean up** (delete test FAQs)

## Expected Results

When you get FAQs for a professional, you should see:
- ✅ **Common FAQs** - Questions marked with `"is_common": true`
- ✅ **Professional FAQs** - Questions with specific `professional_id`
- ✅ **Questions with/without answers** - Some may have null answers
- ✅ **No pagination** - All results returned at once

This system now perfectly handles common questions that are the same for all professionals, plus allows each professional to add their own specific questions and answers!