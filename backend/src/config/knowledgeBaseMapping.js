// Knowledge Base Mapping for Industries
// Maps industry values to their corresponding knowledge base files

const KNOWLEDGE_BASE_MAPPING = {
  'real-estate': {
    directory: 'RealEstate_PDFs',
    files: {
      'lead-qualification': 'Real_Estate_Client_Follow-up.pdf',
      'property-inquiries': 'Real_Estate_Property_Inquiries.pdf',
      'appointment-scheduling': 'Real_Estate_Viewing_Scheduling.pdf',
      'follow-up-calls': 'Real_Estate_Client_Follow-up.pdf',
      'market-updates': 'Real_Estate_Market_Updates.pdf'
    }
  },
  'healthcare': {
    directory: 'Healthcare_PDFs',
    files: {
      'appointment-booking': 'Healthcare_Appointment_Scheduling.pdf',
      'patient-reminders': 'Healthcare_Health_Reminders.pdf',
      'insurance-verification': 'Healthcare_Biometrics_Support.pdf',
      'prescription-refills': 'Healthcare_Health_Reminders.pdf',
      'wellness-checkups': 'Healthcare_Health_Reminders.pdf'
    }
  },
  'e-commerce': {
    directory: 'Retail_ECommerce_PDFs',
    files: {
      'abandoned-cart': 'Retail_and_E-Commerce_Customer_Support.pdf',
      'order-follow-up': 'Retail_and_E-Commerce_Order_Tracking.pdf',
      'customer-support': 'Retail_and_E-Commerce_Customer_Support.pdf',
      'product-recommendations': 'Retail_and_E-Commerce_Product_Recommendations.pdf',
      'loyalty-programs': 'Retail_and_E-Commerce_Customer_Support.pdf'
    }
  },
  'financial-services': {
    directory: 'Banking_Finance_PDFs',
    files: {
      'loan-applications': 'Banking_and_Finance_Loan_Applications_AI_Script.pdf',
      'investment-consultation': 'Banking_and_Finance_Customer_Advisory_AI_Script.pdf',
      'payment-reminders': 'Banking_and_Finance_Account_Management_AI_Script.pdf',
      'account-verification': 'Banking_and_Finance_Customer_Support_AI_Script.pdf',
      'financial-planning': 'Banking_and_Finance_Customer_Advisory_AI_Script.pdf'
    }
  },
  'automotive': {
    directory: 'Automotive_PDFs',
    files: {
      'service-reminders': 'Automotive_Service_Appointments.pdf',
      'sales-follow-up': 'Automotive_Vehicle_Inquiries.pdf',
      'parts-availability': 'Automotive_Parts_Availability.pdf',
      'warranty-calls': 'Automotive_Service_Appointments.pdf',
      'trade-in-evaluation': 'Automotive_Vehicle_Inquiries.pdf'
    }
  },
  'education': {
    directory: 'Education_PDFs',
    files: {
      'enrollment-follow-up': 'Education_Student_Enrollment.pdf',
      'course-recommendations': 'Education_Course_Registration.pdf',
      'parent-engagement': 'Education_Academic_Advising.pdf',
      'scholarship-outreach': 'Education_Academic_Advising.pdf',
      'event-invitations': 'Education_Course_Registration.pdf'
    }
  },
  'hospitality': {
    directory: 'Travel_Hospitality_PDFs',
    files: {
      'booking-confirmations': 'Travel_and_Hospitality_Booking_Assistance.pdf',
      'guest-experience': 'Travel_and_Hospitality_Travel_Information.pdf',
      'event-planning': 'Travel_and_Hospitality_Booking_Assistance.pdf',
      'loyalty-rewards': 'Travel_and_Hospitality_Lead_Generation.pdf',
      'reservation-management': 'Travel_and_Hospitality_Booking_Assistance.pdf'
    }
  },
  'legal': {
    directory: 'Technology_PDFs', // Using Technology as fallback for Legal
    files: {
      'consultation-booking': 'Technology_Product_Demos.pdf',
      'case-updates': 'Technology_Technical_Support.pdf',
      'document-collection': 'Technology_Onboarding.pdf',
      'client-intake': 'Technology_Onboarding.pdf',
      'payment-reminders': 'Technology_Technical_Support.pdf'
    }
  }
};

/**
 * Get the knowledge base file path for a given industry and use case
 * @param {string} industry - The industry (e.g., 'real-estate', 'healthcare')
 * @param {string} useCase - The use case (e.g., 'lead-qualification', 'appointment-booking')
 * @returns {string|null} - The file path or null if not found
 */
function getKnowledgeBaseFilePath(industry, useCase) {
  const industryConfig = KNOWLEDGE_BASE_MAPPING[industry];
  if (!industryConfig) {
    console.warn(`No knowledge base mapping found for industry: ${industry}`);
    return null;
  }

  const fileName = industryConfig.files[useCase];
  if (!fileName) {
    console.warn(`No knowledge base file found for industry: ${industry}, use case: ${useCase}`);
    return null;
  }

  return `Knowledge_base_by_Industry/${industryConfig.directory}/${fileName}`;
}

/**
 * Get all available industries
 * @returns {Array} - Array of industry objects
 */
function getAvailableIndustries() {
  return Object.keys(KNOWLEDGE_BASE_MAPPING).map(industry => ({
    value: industry,
    label: industry.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }));
}

/**
 * Get use cases for a specific industry
 * @param {string} industry - The industry
 * @returns {Array} - Array of use case objects
 */
function getUseCasesForIndustry(industry) {
  const industryConfig = KNOWLEDGE_BASE_MAPPING[industry];
  if (!industryConfig) {
    return [];
  }

  return Object.keys(industryConfig.files).map(useCase => ({
    value: useCase,
    label: useCase.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }));
}

export {
  KNOWLEDGE_BASE_MAPPING,
  getKnowledgeBaseFilePath,
  getAvailableIndustries,
  getUseCasesForIndustry
};
