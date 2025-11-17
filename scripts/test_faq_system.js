#!/usr/bin/env node

/**
 * Test script for FAQ System
 * This script demonstrates how to use the FAQ system with sample data
 */

import mongoose from 'mongoose';
import Faq from '../models/faqModel.js';
import Professional from '../models/ProfessionalModel.js';
import {
  createFaq,
  getFaqsByProfessional,
  updateFaq,
  deleteFaq,
  searchFaqs,
  getFaqStats,
  incrementFaqViewCount,
  markFaqHelpful
} from '../services/ProfessionalServices.js';

// Sample test data
const sampleFAQs = [
  {
    question: "What services do you offer?",
    answer: "We offer comprehensive home repair services including plumbing, electrical work, HVAC maintenance, painting, and general handyman services.",
    category: "Services",
    priority: 1
  },
  {
    question: "How much do your services cost?",
    answer: "Our pricing varies depending on the service required. We offer free estimates for most services. Basic maintenance starts at $50/hour.",
    category: "Pricing",
    priority: 2
  },
  {
    question: "Do you provide emergency services?",
    answer: "Yes, we provide 24/7 emergency services for urgent repairs such as water leaks, electrical issues, and heating/cooling problems.",
    category: "Services",
    priority: 3
  },
  {
    question: "What are your business hours?",
    answer: "We are open Monday through Friday 8 AM to 6 PM, Saturday 9 AM to 4 PM. Emergency services are available 24/7.",
    category: "Schedule",
    priority: 4
  },
  {
    question: "Do you guarantee your work?",
    answer: "Yes, we provide a 90-day warranty on all labor and a 1-year warranty on parts for most services.",
    category: "Warranty",
    priority: 5
  }
];

async function testFAQSystem() {
  try {
    // Connect to database (adjust connection string as needed)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/servicyee', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to database');
    
    // Get a professional ID (you'll need to replace this with a valid ID)
    const professional = await Professional.findOne();
    if (!professional) {
      console.log('❌ No professional found in database. Please create a professional first.');
      return;
    }
    
    const professionalId = professional._id;
    console.log(`✅ Using professional ID: ${professionalId}`);
    
    // Test 1: Create FAQs
    console.log('\n📝 Test 1: Creating FAQs...');
    const createdFaqs = [];
    
    for (const faqData of sampleFAQs) {
      const faq = await createFaq({
        ...faqData,
        professional_id: professionalId
      });
      createdFaqs.push(faq);
      console.log(`✅ Created FAQ: ${faq.question}`);
    }
    
    // Test 2: Get FAQs by professional
    console.log('\n📖 Test 2: Getting FAQs by professional...');
    const faqs = await getFaqsByProfessional(professionalId, {
      page: 1,
      limit: 10
    });
    console.log(`✅ Found ${faqs.length} FAQs`);
    
    // Test 3: Search FAQs
    console.log('\n🔍 Test 3: Searching FAQs...');
    const searchResults = await searchFaqs('services', professionalId, {
      page: 1,
      limit: 10
    });
    console.log(`✅ Found ${searchResults.length} FAQs matching 'services'`);
    
    // Test 4: Get FAQ statistics
    console.log('\n📊 Test 4: Getting FAQ statistics...');
    const stats = await getFaqStats(professionalId);
    console.log('✅ FAQ Statistics:', {
      total_faqs: stats.total_faqs,
      total_views: stats.total_views,
      total_helpful: stats.total_helpful
    });
    
    // Test 5: Test interaction features
    if (createdFaqs.length > 0) {
      const testFaq = createdFaqs[0];
      
      console.log('\n👁️ Test 5: Testing view count...');
      await incrementFaqViewCount(testFaq._id);
      const updatedFaq = await Faq.findById(testFaq._id);
      console.log(`✅ View count updated: ${updatedFaq.view_count}`);
      
      console.log('\n👍 Test 6: Testing helpful feedback...');
      await markFaqHelpful(testFaq._id, true);
      await markFaqHelpful(testFaq._id, false);
      const feedbackFaq = await Faq.findById(testFaq._id);
      console.log(`✅ Helpful: ${feedbackFaq.helpful_count}, Not helpful: ${feedbackFaq.not_helpful_count}`);
    }
    
    // Test 7: Update a FAQ
    if (createdFaqs.length > 1) {
      console.log('\n✏️ Test 7: Updating FAQ...');
      const faqToUpdate = createdFaqs[1];
      const updatedFaq = await updateFaq(faqToUpdate._id, {
        answer: "Updated answer: Our pricing is competitive and transparent. Contact us for a detailed quote.",
        category: "Pricing"
      });
      console.log(`✅ Updated FAQ: ${updatedFaq.answer.substring(0, 50)}...`);
    }
    
    // Test 8: Get popular FAQs
    console.log('\n🔥 Test 8: Getting popular FAQs...');
    const popularFaqs = await Faq.find({
      professional_id: professionalId
    })
    .sort({ view_count: -1, helpful_count: -1 })
    .limit(5);
    console.log(`✅ Found ${popularFaqs.length} popular FAQs`);
    
    // Test 9: Clean up - Delete test FAQs
    console.log('\n🗑️ Test 9: Cleaning up...');
    for (const faq of createdFaqs) {
      await deleteFaq(faq._id);
      console.log(`✅ Deleted FAQ: ${faq.question.substring(0, 30)}...`);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Export for use in other scripts
export { testFAQSystem, sampleFAQs };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testFAQSystem();
}

// Usage instructions
console.log(`
FAQ System Test Script
======================

This script tests the FAQ functionality with sample data.

Prerequisites:
1. MongoDB connection (set MONGODB_URI environment variable)
2. At least one professional in the database
3. Node.js with ES6 modules support

Usage:
- As a script: node scripts/test_faq_system.js
- As a module: import { testFAQSystem } from './scripts/test_faq_system.js'

Available Tests:
✅ Create FAQs
✅ Get FAQs by professional
✅ Search FAQs
✅ Get FAQ statistics
✅ Increment view count
✅ Mark as helpful/unhelpful
✅ Update FAQs
✅ Get featured FAQs
✅ Get popular FAQs
✅ Delete FAQs (cleanup)

Sample Data:
The script uses 5 sample FAQs covering different categories:
- Services (2 FAQs)
- Pricing (1 FAQ)
- Schedule (1 FAQ)
- Warranty (1 FAQ)

API Endpoints:
All functionality is accessible via these routes:
- POST /api/professionals/:professionalId/faqs
- GET /api/professionals/:professionalId/faqs
- GET /api/professionals/faqs/:id
- PUT /api/professionals/faqs/:id
- DELETE /api/professionals/faqs/:id
- GET /api/professionals/:professionalId/faqs/search
- GET /api/professionals/:professionalId/faqs/featured
- POST /api/professionals/faqs/:id/view
- POST /api/professionals/faqs/:id/helpful
- GET /api/professionals/:professionalId/faqs/stats
`);