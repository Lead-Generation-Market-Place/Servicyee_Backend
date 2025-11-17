# FAQ System Documentation

## Overview

The FAQ (Frequently Asked Questions) system allows professionals to create, manage, and publish FAQs for their services. Each FAQ consists of a question, an optional answer, and is associated with a professional profile.

## Model Structure

### Faq Model (`models/faqModel.js`)

```javascript
{
  question: String (required, max 1000 chars) - The FAQ question
  answer: String (optional, max 5000 chars) - The answer to the question
  professional_id: ObjectId (required) - Reference to the professional
  category: String (optional, max 100 chars) - FAQ category
  tags: [String] (optional) - Array of tags for searching
  is_published: Boolean (default: false) - Publication status
  is_featured: Boolean (default: false) - Featured status
  view_count: Number (default: 0) - Number of views
  helpful_count: Number (default: 0) - Helpful votes
  not_helpful_count: Number (default: 0) - Not helpful votes
  priority: Number (default: 0) - Display priority
  createdAt: Date - Creation timestamp
  updatedAt: Date - Last update timestamp
}
```

## API Endpoints

### CRUD Operations

#### Create FAQ
```http
POST /api/professionals/:professionalId/faqs
Content-Type: application/json
Authorization: Bearer <token>

{
  "question": "What services do you offer?",
  "answer": "We offer various home repair services including plumbing, electrical work, and general maintenance.",
  "category": "Services",
  "tags": ["services", "repair", "maintenance"],
  "is_published": true
}
```

#### Get FAQs by Professional
```http
GET /api/professionals/:professionalId/faqs?page=1&limit=10&published=true&category=Services&featured=false
Authorization: Bearer <token>
```

#### Get Single FAQ
```http
GET /api/professionals/faqs/:id
Authorization: Bearer <token>
```

#### Update FAQ
```http
PUT /api/professionals/faqs/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "question": "Updated question?",
  "answer": "Updated answer",
  "category": "Updated Category",
  "tags": ["updated", "tags"]
}
```

#### Delete FAQ
```http
DELETE /api/professionals/faqs/:id
Authorization: Bearer <token>
```

### Search and Discovery

#### Search FAQs
```http
GET /api/professionals/:professionalId/faqs/search?query=service&page=1&limit=10&published=true
Authorization: Bearer <token>
```

#### Get Featured FAQs
```http
GET /api/professionals/:professionalId/faqs/featured?limit=5
Authorization: Bearer <token>
```

#### Get Popular FAQs
```http
GET /api/professionals/:professionalId/faqs/popular?limit=10
Authorization: Bearer <token>
```

#### Get Recent FAQs
```http
GET /api/professionals/:professionalId/faqs/recent?limit=5
Authorization: Bearer <token>
```

#### Get FAQ Categories
```http
GET /api/professionals/:professionalId/faqs/categories
Authorization: Bearer <token>
```

#### Get FAQ Statistics
```http
GET /api/professionals/:professionalId/faqs/stats
Authorization: Bearer <token>
```

### Interaction Features

#### Increment View Count
```http
POST /api/professionals/faqs/:id/view
Authorization: Bearer <token>
```

#### Mark as Helpful/Unhelpful
```http
POST /api/professionals/faqs/:id/helpful
Content-Type: application/json
Authorization: Bearer <token>

{
  "is_helpful": true
}
```

#### Publish/Unpublish FAQ
```http
PUT /api/professionals/faqs/:id/publish
Content-Type: application/json
Authorization: Bearer <token>

{
  "is_published": true
}
```

#### Toggle Featured Status
```http
PUT /api/professionals/faqs/:id/featured
Content-Type: application/json
Authorization: Bearer <token>

{
  "is_featured": true
}
```

### Bulk Operations

#### Create Multiple FAQs
```http
POST /api/professionals/faqs/bulk
Content-Type: application/json
Authorization: Bearer <token>

{
  "faqs": [
    {
      "question": "FAQ 1 question?",
      "answer": "FAQ 1 answer",
      "category": "Category 1",
      "tags": ["tag1", "tag2"]
    },
    {
      "question": "FAQ 2 question?",
      "answer": "FAQ 2 answer",
      "category": "Category 2",
      "tags": ["tag3", "tag4"]
    }
  ]
}
```

#### Delete Multiple FAQs
```http
DELETE /api/professionals/faqs/bulk
Content-Type: application/json
Authorization: Bearer <token>

{
  "faq_ids": ["faq_id_1", "faq_id_2", "faq_id_3"]
}
```

## Service Methods

### Available Methods in ProfessionalServices

#### Create and Manage
- `createFaq(data)` - Create a new FAQ
- `getFaqById(id)` - Get FAQ by ID
- `getFaqsByProfessional(professionalId, options)` - Get FAQs by professional
- `updateFaq(id, data)` - Update FAQ
- `deleteFaq(id)` - Delete FAQ

#### Search and Discovery
- `searchFaqs(searchTerm, professionalId, options)` - Search FAQs
- `getFaqsByCategory(professionalId, category, options)` - Get FAQs by category
- `getFeaturedFaqs(professionalId, limit)` - Get featured FAQs
- `getPopularFaqs(professionalId, limit)` - Get popular FAQs
- `getRecentFaqs(professionalId, limit)` - Get recent FAQs

#### Analytics and Stats
- `getFaqStats(professionalId)` - Get FAQ statistics
- `getFaqCategories(professionalId)` - Get available categories

#### Interaction
- `incrementFaqViewCount(faqId)` - Increment view count
- `markFaqHelpful(faqId, isHelpful)` - Record helpful feedback
- `publishUnpublishFaq(id, isPublished)` - Toggle publish status
- `toggleFeaturedFaq(id, isFeatured)` - Toggle featured status

#### Bulk Operations
- `bulkCreateFaqs(faqsData)` - Create multiple FAQs
- `deleteMultipleFaqs(faqIds)` - Delete multiple FAQs

## Response Formats

### Success Response
```json
{
  "success": true,
  "message": "FAQ created successfully",
  "faq": {
    "_id": "faq_id",
    "question": "What services do you offer?",
    "answer": "We offer various home repair services...",
    "professional_id": "professional_id",
    "category": "Services",
    "tags": ["services", "repair"],
    "is_published": true,
    "is_featured": false,
    "view_count": 0,
    "helpful_count": 0,
    "not_helpful_count": 0,
    "priority": 0,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error creating FAQ",
  "error": "Question is required"
}
```

### FAQ Statistics Response
```json
{
  "success": true,
  "stats": {
    "total_faqs": 25,
    "published_faqs": 20,
    "featured_faqs": 5,
    "total_views": 150,
    "total_helpful": 30,
    "total_not_helpful": 5,
    "categories": ["Services", "Pricing", "Scheduling", "General"]
  }
}
```

## Database Indexes

The FAQ model includes the following indexes for optimal performance:

- `{ professional_id: 1, is_published: 1 }` - For filtering by professional and publication status
- `{ category: 1, is_published: 1 }` - For category-based filtering
- `{ is_featured: 1, priority: -1 }` - For featured FAQs with priority sorting
- `{ createdAt: -1 }` - For recent FAQs

## Usage Examples

### JavaScript/Node.js Example

```javascript
// Create a FAQ
const faqData = {
  question: "What payment methods do you accept?",
  answer: "We accept cash, credit cards, and bank transfers.",
  professional_id: "professional_id_here",
  category: "Payment",
  tags: ["payment", "methods", "cash", "credit"],
  is_published: true
};

const faq = await createFaq(faqData);
console.log("Created FAQ:", faq);

// Get all FAQs for a professional
const faqs = await getFaqsByProfessional("professional_id_here", {
  published: true,
  page: 1,
  limit: 10,
  category: "Payment"
});

console.log("FAQs:", faqs);

// Search FAQs
const searchResults = await searchFaqs("payment", "professional_id_here", {
  page: 1,
  limit: 10
});

console.log("Search results:", searchResults);

// Record helpful feedback
await markFaqHelpful("faq_id_here", true);
await incrementFaqViewCount("faq_id_here");
```

### Frontend Integration Example (React)

```jsx
import React, { useState, useEffect } from 'react';

const FAQManager = ({ professionalId, token }) => {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch FAQs
  const fetchFaqs = async () => {
    try {
      const response = await fetch(`/api/professionals/${professionalId}/faqs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setFaqs(data.faqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  // Search FAQs
  const searchFaqs = async (query) => {
    try {
      const response = await fetch(
        `/api/professionals/${professionalId}/faqs/search?query=${query}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setFaqs(data.faqs);
    } catch (error) {
      console.error('Error searching FAQs:', error);
    }
  };

  // Mark FAQ as helpful
  const markHelpful = async (faqId) => {
    try {
      await fetch(`/api/professionals/faqs/${faqId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_helpful: true })
      });
      fetchFaqs(); // Refresh FAQs
    } catch (error) {
      console.error('Error marking FAQ as helpful:', error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [professionalId]);

  return (
    <div className="faq-manager">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchFaqs(searchQuery)}
        />
        <button onClick={() => searchFaqs(searchQuery)}>Search</button>
      </div>

      <div className="faqs-list">
        {faqs.map(faq => (
          <div key={faq._id} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
            <div className="faq-meta">
              <span>Category: {faq.category}</span>
              <span>Views: {faq.view_count}</span>
              <span>Helpful: {faq.helpful_count}</span>
              <button onClick={() => markHelpful(faq._id)}>
                Helpful
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQManager;
```

## Best Practices

1. **Use Categories**: Organize FAQs using meaningful categories for better organization
2. **Add Tags**: Use relevant tags to improve searchability
3. **Regular Updates**: Keep answers current and relevant
4. **Monitor Analytics**: Check FAQ statistics to understand user needs
5. **Featured FAQs**: Highlight the most important or frequently asked questions
6. **User Feedback**: Encourage users to mark FAQs as helpful or not helpful
7. **Search Optimization**: Include common search terms in questions and answers

## Error Handling

All endpoints return consistent error responses with appropriate HTTP status codes:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: FAQ or professional not found
- `500 Internal Server Error`: Server-side errors

## Rate Limiting

Consider implementing rate limiting for FAQ creation and search endpoints to prevent abuse.

## Future Enhancements

- FAQ templates for common questions
- Multi-language support
- FAQ versioning
- Advanced analytics dashboard
- FAQ import/export functionality
- Rich text formatting for answers
- FAQ attachments and media support