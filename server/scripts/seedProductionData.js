require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Models
const Project = require('../models/Project');
const TeamMember = require('../models/TeamMember');
const ContactInfo = require('../models/ContactInfo');
const Setting = require('../models/Setting');
const WeArePage = require('../models/WeArePage');

const projectsData = [
  // Transportation Infrastructure - Completed
  { title: "Earthwork in Embankment on NH 69, Nagpur-Saoner-Betul", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image1.jpg", description: "Project Cost: Rs 16.39 Cr", timeToBuild: "2013-2016", engineers: "Backbone Enterprises Ltd", location: "Maharashtra" },
  { title: "Material Transport for Road Construction on NH 69A", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image2.jpg", description: "Project Cost: Rs 4.96 Cr", timeToBuild: "2013-2015", engineers: "Sadhbhav Engineering Ltd", location: "Multai-Chindwada-Seoni" },
  { title: "Embankment and Subgrade Work at Palsana", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image3.jpg", description: "Project Cost: Rs 2.87 Cr", timeToBuild: "2014-2015", engineers: "Indian Builders & Contractors Pvt Ltd", location: "Surat, Gujarat" },
  { title: "Embankment & Aggregate Transport for NH 8D Jetpur-Somnath", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image4.jpg", description: "Project Cost: Rs 14.02 Cr", timeToBuild: "2014-2016", engineers: "Backbone Enterprises Ltd", location: "Gujarat" },
  { title: "Road Work on SH Road Boriguma-Ranigunda", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image5.jpg", description: "Project Cost: Rs 4.58 Cr", timeToBuild: "2015-2016", engineers: "Backbone Enterprises Ltd", location: "Odisha" },
  { title: "NH 201, Nabrangpur-Kokasara", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image6.jpg", description: "Project Cost: Rs 14.38 Cr", timeToBuild: "2016-2018", engineers: "Iron Triangle Ltd", location: "Odisha" },
  { title: "Road and Structure Work - NH 5, Jharpokhariya-Baripada-Baleshwar", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image7.jpg", description: "Project Cost: Rs 26.80 Cr", timeToBuild: "2018-2021", engineers: "Iron Triangle Ltd", location: "Odisha" },
  { title: "Structures Contract - NH-148N, Delhi-Vadodara Expressway", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image8.jpg", description: "Project Cost: Rs 16.78 Cr", timeToBuild: "2021-2022", engineers: "MKC Infra Ltd", location: "Delhi-Vadodara Expressway" },
  { title: "Structure Work on Expressway - NH 751, Ahmedabad-Dholera", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image9.jpg", description: "Project Cost: Rs 34.89 Cr", timeToBuild: "2022-2024", engineers: "GHV (India) Pvt Ltd", location: "Ahmedabad-Dholera" },
  { title: "Road Project - Badnawar-Ratlam to Dhamana Kachi", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image10.jpg", description: "Project Cost: Rs 3.99 Cr", timeToBuild: "2023-2024", engineers: "MP PWD Dhar", location: "MP" },
  // Transportation Infrastructure - Ongoing
  { title: "Road Project - Beganda to Kacchibaroda", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image11.jpg", description: "Project Cost: Rs 14.56 Cr (Ongoing)", timeToBuild: "Awarded 2023", engineers: "MP PWD Dhar", location: "MP" },
  { title: "Rural Road Development - Neemakhedi, Budni", category: "transportation-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image12.jpg", description: "Project Cost: Rs 24.38 Cr (Ongoing)", timeToBuild: "Awarded 2023", engineers: "MP PWD Nasrullaganj", location: "MP" },
  { title: "Eight-lane access-controlled Expressway PKG-VIII Gujarat, KM 180 to 190", category: "transportation-infrastructure", projectType: "Iconic", image: "/assets/doc-images/image13.jpg", description: "Project Cost: Rs 308.00 Cr (Ongoing)", timeToBuild: "Awarded 2025", engineers: "Roadways Solution India Infra Ltd", location: "Vadodara Mumbai Expressway" },
  { title: "Eight-lane access-controlled Expressway PKG-VIII Gujarat, KM 175 to 180", category: "transportation-infrastructure", projectType: "Iconic", image: "/assets/doc-images/image14.jpg", description: "Project Cost: Rs 234.00 Cr (Ongoing)", timeToBuild: "Awarded 2025", engineers: "Roadways Solution India Infra Ltd", location: "Vadodara Mumbai Expressway" },

  // Bridges
  { title: "Box Culverts and Bridges on Bharuch-Dahej Road", category: "bridges", projectType: "Landmark", image: "/assets/doc-images/image15.jpg", description: "Project Cost: Rs 8.23 Cr", timeToBuild: "2012-2014", engineers: "Welspun Project Ltd", location: "Gujarat" },
  { title: "Submersible Bridge Work - Ratlam District", category: "bridges", projectType: "Landmark", image: "/assets/doc-images/image16.jpg", description: "Project Cost: Rs 10.88 Cr (Ongoing)", timeToBuild: "Awarded 2024", engineers: "MP PWD Ujjain", location: "Ratlam District, MP" },

  // Housing
  { title: "Group Housing Project - 42 Duplex Houses", category: "housing", projectType: "Landmark", image: "/assets/doc-images/image17.jpg", description: "Project Cost: Rs 10.08 Cr", timeToBuild: "2011-2013", engineers: "Own Project", location: "Diamond Park, Bhopal (MP)" },

  // Ports
  { title: "Embankment Construction at Kandla Port Jetty No. 13", category: "ports", projectType: "Landmark", image: "/assets/doc-images/image18.jpg", description: "Project Cost: Rs 7.32 Cr", timeToBuild: "2014-2016", engineers: "Kandla Port", location: "Gujarat" },

  // Water Infrastructure
  { title: "Excavation for Pipelines at Falna, Pali (RAJ) - Salaya-Mathura Pipeline", category: "water-infrastructure", projectType: "Landmark", image: "/assets/doc-images/image19.jpg", description: "Project Cost: Rs 2.60 Cr", timeToBuild: "2014-2015", engineers: "Raviraj Infra / L&T", location: "Falna, Pali (RAJ)" },
];

const teamData = [
  {
    name: "Mr. Sanjay Kumar Soni",
    role: "Managing Director",
    image: "/assets/doc-images/image10.png"
  },
  {
    name: "Mr. Sachin Kumar Soni",
    role: "Director",
    image: "/assets/doc-images/image12.png"
  }
];

const contactData = {
  companyAddress: "414-Shreeya Amalga, Opp. Avalon Hotel,\nThaltej, Ahmedabad, Gujarat- 380 059",
  tollFreeNumber: "+91 79 4938 9854",
  availability: "Mon - Sat: 9:00 AM - 6:00 PM",
  internationalNumber: "+91 99253 52460",
  internationalAvailability: "Regional Office: Bhopal, MP & Chikhli, Gujarat",
  email: "info@skumarinfracons.com",
  tagline: "S Kumar Infracons is committed to contributing to India's infrastructure development through quality construction, innovative solutions, and ethical business practices."
};

const settingStatsData = {
  key: "stats",
  value: JSON.stringify({
    projectValue: "₹650Cr+",
    completedProjects: "14",
    ongoingProjects: "5",
    indianStates: "7"
  })
};

const weArePagesData = [
  {
    slug: 'our-company',
    title: 'Our Company',
    pageData: {
      tagline: 'Building the Future with Unwavering Commitment and Excellence',
      heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&h=600&fit=crop',
      items: [
        {
          id: '1',
          title: 'S Kumar Infracons (India) Private Limited',
          content: 'S Kumar Infracons (India) Private Limited (SKIPL) is a dynamic and rapidly expanding infrastructure and construction company with a strong footprint in civil engineering projects across India. Founded in 2006 and incorporated in 2011, SKIPL has grown into a trusted name in the infrastructure sector under visionary leadership. The company has built a solid reputation for executing projects under EPC (Engineering, Procurement, and Construction) and PPP (Public-Private Partnership) frameworks, contributing to national initiatives like Bharatmala, Sagarmala, PM Gati Shakti, and the National Infrastructure Pipeline (NIP).',
          image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=500&fit=crop'
        },
        {
          id: '2',
          title: 'Vision & Mission',
          content: 'Our vision is to become a leading infrastructure company driving India\'s development through engineering excellence, ethical values, and sustainable innovation. We deliver sustainable, efficient infrastructure projects that balance technological innovation with environmental responsibility, creating lasting value for all stakeholders. We exceed client expectations through integrity, technical excellence, and unwavering commitment to quality.',
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop'
        }
      ]
    }
  },
  {
    slug: 'our-global-presence',
    title: 'Our Global Presence',
    pageData: {
      tagline: 'Making a Mark Across Key Indian States',
      heroImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&h=600&fit=crop',
      items: [
        { id: '1', country: 'Gujarat', details: 'Registered office in Ahmedabad, and regional project office in Chikhli. Major projects include Vadodara-Mumbai Expressway packages PKG-VIII worth over ₹540 Cr and Kandla Port Jetty Embankments.' },
        { id: '2', country: 'Madhya Pradesh', details: 'Regional office in Bhopal. Projects executed include Diamond Park Group Housing and various high-value Road & Submersible Bridge works for MP PWD across Dhar, Ujjain, and Ratlam.' },
        { id: '3', country: 'Odisha & Rajasthan', details: 'Highways and civil structures successfully delivered in Boriguma, Jharpokhariya, Nabrangpur, and pipeline excavations in Pali.' }
      ]
    }
  },
  {
    slug: 'our-unique-capabilities',
    title: 'Our Unique Capabilities',
    pageData: {
      tagline: 'Engineering the Impossible with Precision',
      heroImage: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=1600&h=600&fit=crop',
      items: [
        {
          id: '1',
          title: 'State-of-the-Art Plant & Machinery',
          content: 'Our extensive fleet of advanced equipment enables us to execute projects with high quality and speed. This includes Pozzolana and Metso (VSI) Stone Crushers (250TPH Three Stage), Speco Hot Batch Mix Bituminous Plant (120TPH), Concrete Batch Mix Plants (Schwing Stetter/Conmat), over 12 Excavators, Transit Mixers, and Vogele Paver Finishers.',
          image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=500&fit=crop'
        },
        {
          id: '2',
          title: 'Skilled Manpower Strength',
          content: 'Our robust engineering and administrative ecosystem features highly experienced Project In-Charges, Project Managers, Planning Managers, QA/QC Quality Control Managers, Surveyors, Supervisors, Store Assistants, and a dedicated Internal Audit Team. We maintain a head office strength of 18 alongside comprehensive on-site teams.',
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=500&fit=crop'
        }
      ]
    }
  },
  {
    slug: 'our-innovation-centres',
    title: 'Our Innovation Centres',
    pageData: {
      tagline: 'Pioneering Quality and Standards',
      heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&h=600&fit=crop',
      items: [
        {
          id: '1',
          title: 'Quality Assurance & Material Testing',
          description: 'We maintain a documented quality management system aligned with ISO 9001:2015 standards, featuring fully equipped on-site laboratories for rigorous testing of construction materials to ensure "right first time" execution.',
          image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop'
        },
        {
          id: '2',
          title: 'Robust Process Documentation',
          description: 'Our comprehensive documentation system encompasses quality plans, inspection test plans, and systematic audits that facilitate continuous learning and improvement across projects.',
          image: 'https://images.unsplash.com/photo-1503944583220-79d8926dd5e2?w=600&h=400&fit=crop'
        }
      ]
    }
  }
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected. Commencing Corporate Data Seeding...');

    // Clear existing relevant data
    console.log('Clearing existing mock data...');
    await Project.deleteMany({});
    await TeamMember.deleteMany({});
    await ContactInfo.deleteMany({});
    await Setting.deleteOne({ key: 'stats' });
    await WeArePage.deleteMany({});

    // Seed Projects
    console.log('Seeding 19 Production Projects...');
    await Project.insertMany(projectsData);

    // Seed Team
    console.log('Seeding Board of Directors...');
    await TeamMember.insertMany(teamData);

    // Seed Contact Info
    console.log('Seeding Corporate Contact Details...');
    await ContactInfo.create(contactData);

    // Seed Stats
    console.log('Seeding Project Stats...');
    await Setting.create(settingStatsData);

    // Seed We Are Pages
    console.log('Seeding We Are Pages...');
    await WeArePage.insertMany(weArePagesData);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();
