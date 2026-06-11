require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const FAQ = require('../models/FAQ');

const faqs = [
  {
    question: 'How do I get started with a new project?',
    answer: 'Simply reach out to us via phone or our contact form. Our team will schedule a consultation to understand your requirements, assess the project scope, and provide a detailed proposal tailored to your needs.',
  },
  {
    question: 'What is the typical timeline for a project?',
    answer: 'Timelines vary depending on the project scope and complexity. Residential projects typically range from 12-18 months, while large infrastructure projects can span 2-5 years. We provide detailed timelines during the planning phase.',
  },
  {
    question: 'How do you determine project cost?',
    answer: 'Our cost estimation involves thorough site analysis, material assessment, labor requirements, and compliance considerations. We provide transparent, itemized quotations with no hidden charges.',
  },
  {
    question: 'Can you help with permits and approvals?',
    answer: 'Absolutely. Our dedicated compliance team handles all necessary permits, approvals, and regulatory clearances, ensuring your project proceeds smoothly without bureaucratic delays.',
  },
  {
    question: 'What types of infrastructure projects do you specialize in?',
    answer: 'We specialize in a wide range of infrastructure projects including national highways, expressways, bridges & flyovers, water pipelines, sewerage systems, irrigation projects, real estate developments, industrial facilities, solar EPC projects, and government buildings.',
  },
  {
    question: 'Do you provide post-completion maintenance and support?',
    answer: 'Yes, we offer comprehensive post-completion support including structural health monitoring, scheduled maintenance programs, and warranty-backed repairs. Our commitment to quality extends well beyond project handover.',
  },
  {
    question: 'What safety standards do you follow on-site?',
    answer: 'We strictly adhere to OSHA guidelines and Indian safety regulations. Our sites maintain ISO 45001 occupational health and safety standards, conduct regular safety audits, mandatory PPE usage, and comprehensive safety training for all personnel.',
  },
  {
    question: 'How do you ensure quality control during construction?',
    answer: 'We implement a multi-tier quality assurance framework that includes regular material testing at NABL-accredited labs, third-party inspections, digital progress monitoring, and compliance checks at every milestone. Our QA/QC team ensures every deliverable meets or exceeds IS and IRC standards.',
  },
  {
    question: 'What geographical areas do you operate in?',
    answer: 'S Kumar Infracons operates across 7+ Indian states with a strong presence in Gujarat, Rajasthan, Maharashtra, Madhya Pradesh, and other regions. We have successfully completed projects spanning diverse terrains and climatic conditions.',
  },
  {
    question: 'Do you handle both government and private sector projects?',
    answer: 'Yes, we have extensive experience working with government agencies like NHAI, state PWDs, municipal corporations, as well as private developers, industrial groups such as NTPC and BHEL, and real estate firms. Our versatility allows us to adapt to different project requirements and compliance frameworks.',
  },
];

async function seedFAQs() {
  try {
    await connectDB();
    
    // Clear existing FAQs
    await FAQ.deleteMany({});
    console.log('Cleared existing FAQs');
    
    // Insert new FAQs
    const result = await FAQ.insertMany(faqs);
    console.log(`Seeded ${result.length} FAQs successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    process.exit(1);
  }
}

seedFAQs();
