# Simplified FAQ System - API Testing Guide

## Base URL & Authentication
```
Base URL: http://localhost:3000/api
Authorization: Bearer {{auth_token}}
```

## Core FAQ Operations

### 1. Show FAQs for a Professional
**GET** `/api/professionals/{{professional_id}}/faqs`

**Response:**
```json
{
  "success": true,
  "faqs": [
    {
      "_id": "faq_id_here",
      "question": "What services do you offer?",
      "answer": "We offer comprehensive home repair services...",
      "professional_id": "507f1f77bcf86cd799439011",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

### 2. Create FAQ (with Answer)
**POST** `/api/professionals/{{professional_id}}/faqs`

**Body:**
```json
{
  "question": "What services do you offer?",
  "answer": "We offer comprehensive home repair services including plumbing, electrical work, HVAC maintenance, painting, and general handyman services."
}
```

### 3. Create FAQ (without Answer - Question Only)
**POST** `/api/professionals/{{professional_id}}/faqs`

**Body:**
```json
{
  "question": "Do you provide emergency services?"
}
```

### 4. Get Single FAQ
**GET** `/api/professionals/faqs/{{faq_id}}`

### 5. Update FAQ (Submit/Update Answer)
**PUT** `/api/professionals/faqs/{{faq_id}}`

**Body:**
```json
{
  "question": "Do you provide emergency services?",
  "answer": "Yes, we provide 24/7 emergency services for urgent repairs such as water leaks, electrical issues, and heating/cooling problems."
}
```

### 6. Delete FAQ
**DELETE** `/api/professionals/faqs/{{faq_id}}`

---

## Sample Test Data

### Create Sample FAQs
```bash
# FAQ 1 - With Answer
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "question": "What services do you offer?",
    "answer": "We offer comprehensive home repair services including plumbing, electrical work, HVAC maintenance, painting, and general handyman services."
  }' \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs"

# FAQ 2 - Question Only (No Answer Yet)
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "question": "Do you provide emergency services?"
  }' \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs"

# FAQ 3 - With Answer
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "question": "What are your working hours?",
    "answer": "We work Monday to Friday from 8 AM to 6 PM, and Saturday from 9 AM to 4 PM. Emergency services are available 24/7."
  }' \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs"
```

### Get All FAQs for Professional
```bash
curl -X GET \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  "http://localhost:3000/api/professionals/$PROFESSIONAL_ID/faqs"
```

### Update FAQ (Submit Answer to Question-Only FAQ)
```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "question": "Do you provide emergency services?",
    "answer": "Yes, we provide 24/7 emergency services for urgent repairs such as water leaks, electrical issues, and heating/cooling problems."
  }' \
  "http://localhost:3000/api/professionals/faqs/$FAQ_ID"
```

---

## Postman Collection (Simplified)

Import this simplified collection:

```json
{
  "info": {
    "_postman_id": "simplified-faq-collection",
    "name": "Simplified FAQ System",
    "description": "Essential FAQ CRUD operations"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{auth_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "professional_id",
      "value": "your_professional_id_here"
    }
  ],
  "item": [
    {
      "name": "Get FAQs for Professional",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/professionals/{{professional_id}}/faqs",
          "host": ["{{base_url}}"],
          "path": ["professionals", "{{professional_id}}", "faqs"]
        }
      }
    },
    {
      "name": "Create FAQ with Answer",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"question\": \"What services do you offer?\",\n  \"answer\": \"We offer comprehensive home repair services including plumbing, electrical work, HVAC maintenance, painting, and general handyman services.\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/professionals/{{professional_id}}/faqs",
          "host": ["{{base_url}}"],
          "path": ["professionals", "{{professional_id}}", "faqs"]
        }
      }
    },
    {
      "name": "Create FAQ without Answer",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"question\": \"Do you provide emergency services?\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/professionals/{{professional_id}}/faqs",
          "host": ["{{base_url}}"],
          "path": ["professionals", "{{professional_id}}", "faqs"]
        }
      }
    },
    {
      "name": "Get Single FAQ",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/professionals/faqs/{{faq_id}}",
          "host": ["{{base_url}}"],
          "path": ["professionals", "faqs", "{{faq_id}}"]
        }
      }
    },
    {
      "name": "Update FAQ (Submit Answer)",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"question\": \"Do you provide emergency services?\",\n  \"answer\": \"Yes, we provide 24/7 emergency services for urgent repairs such as water leaks, electrical issues, and heating/cooling problems.\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/professionals/faqs/{{faq_id}}",
          "host": ["{{base_url}}"],
          "path": ["professionals", "faqs", "{{faq_id}}"]
        }
      }
    },
    {
      "name": "Delete FAQ",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{base_url}}/professionals/faqs/{{faq_id}}",
          "host": ["{{base_url}}"],
          "path": ["professionals", "faqs", "{{faq_id}}"]
        }
      }
    }
  ]
}
```

---

## Testing Workflow

1. **Get existing FAQs** for a professional
2. **Create FAQ with answer** (complete FAQ)
3. **Create FAQ without answer** (question only)
4. **Update question-only FAQ** by adding the answer
5. **Verify updates** by getting the updated FAQ
6. **Delete test FAQs** to clean up

## Key Features
- ✅ **Show FAQs for Professional** - List all FAQs associated with a professional
- ✅ **Create FAQ with Answer** - Complete FAQ creation
- ✅ **Create FAQ without Answer** - Question-only FAQ (for later completion)
- ✅ **Submit/Update Answers** - Update existing FAQs with answers
- ✅ **Optional Answer Field** - Answers are not required when creating questions

The system now provides exactly what you requested: show FAQs for a professional and submit answers that get saved back to the database!