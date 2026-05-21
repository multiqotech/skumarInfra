const ContactInfo = require('../models/ContactInfo');

// Get Contact Info
const getContactInfo = async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) {
      info = new ContactInfo();
      await info.save();
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching contact info', error: error.message });
  }
};

// Update Contact Info
const updateContactInfo = async (req, res) => {
  try {
    const { companyAddress, tollFreeNumber, availability, internationalNumber, internationalAvailability, email, tagline } = req.body;
    let info = await ContactInfo.findOne();
    
    if (info) {
      info.companyAddress = companyAddress !== undefined ? companyAddress : info.companyAddress;
      info.tollFreeNumber = tollFreeNumber !== undefined ? tollFreeNumber : info.tollFreeNumber;
      info.availability = availability !== undefined ? availability : info.availability;
      info.internationalNumber = internationalNumber !== undefined ? internationalNumber : info.internationalNumber;
      info.internationalAvailability = internationalAvailability !== undefined ? internationalAvailability : info.internationalAvailability;
      info.email = email !== undefined ? email : info.email;
      info.tagline = tagline !== undefined ? tagline : info.tagline;
      
      const updatedInfo = await info.save();
      res.json(updatedInfo);
    } else {
      info = new ContactInfo(req.body);
      const createdInfo = await info.save();
      res.status(201).json(createdInfo);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating contact info', error: error.message });
  }
};

module.exports = {
  getContactInfo,
  updateContactInfo
};
