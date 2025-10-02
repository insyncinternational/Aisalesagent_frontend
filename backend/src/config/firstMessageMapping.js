// First Message Mapping for Industries and Use Cases
// Maps industry and use case to personalized first messages

const FIRST_MESSAGE_MAPPING = {
  'financial-services': {
    'customer-support': "Hi {{first_name}}, this is Sarah from Spark AI in Dubai. A lot of banks tell me their support lines get flooded with balance and card queries. Is that the case with your team too?",
    'loan-applications': "Hi {{first_name}}, Sarah from Spark AI. Most lenders say loan approvals slow down because of manual KYC and paperwork. Do you see that as well?",
    'payment-reminders': "Hi {{first_name}}, this is Sarah from Spark AI. Finance teams tell me fraud detection eats up huge analyst hours. Is that something you deal with?",
    'account-verification': "Hi {{first_name}}, Sarah here. Banks often say routine account changes, like limits or addresses, tie up their staff. Do you face that?",
    'financial-planning': "Hi {{first_name}}, Sarah here. Banks often say routine account changes, like limits or addresses, tie up their staff. Do you face that?",
    'investment-consultation': "Hi {{first_name}}, Sarah from Spark AI. Most lenders say loan approvals slow down because of manual KYC and paperwork. Do you see that as well?"
  },
  'healthcare': {
    'appointment-booking': "Hi {{first_name}}, this is Sarah from Spark AI. Clinics often say their staff is swamped with patient booking calls. Does that happen in your clinic?",
    'patient-reminders': "Hi {{first_name}}, Sarah here. Doctors tell me patients often forget medication or follow-ups, costing time and outcomes. Do you see that?",
    'insurance-verification': "Hi {{first_name}}, this is Sarah from Spark AI. Many clinics say new patient forms and insurance checks slow down visits. Do you face that?",
    'prescription-refills': "Hi {{first_name}}, Sarah here. Doctors tell me patients often forget medication or follow-ups, costing time and outcomes. Do you see that?",
    'wellness-checkups': "Hi {{first_name}}, Sarah here. Providers say tracking vitals manually wastes staff time. Is that a challenge for you too?"
  },
  'education': {
    'enrollment-follow-up': "Hi {{first_name}}, this is Sarah from Spark AI. Schools often say student admissions drag on because everything is manual. Do you face that?",
    'course-recommendations': "Hi {{first_name}}, Sarah here. Many institutions say students get stuck with registration and timetable issues. Is that true at yours?",
    'parent-engagement': "Hi {{first_name}}, this is Sarah from Spark AI. Advisors tell me they spend hours answering the same student questions. Do you see that with your team?",
    'scholarship-outreach': "Hi {{first_name}}, Sarah here. Universities often say alumni outreach takes up staff time without much automation. Do you run into that?",
    'event-invitations': "Hi {{first_name}}, Sarah here. Many institutions say students get stuck with registration and timetable issues. Is that true at yours?"
  },
  'real-estate': {
    'property-inquiries': "Hi {{first_name}}, this is Sarah from Spark AI. Agents tell me they spend hours answering the same property listing questions. Does that happen to you?",
    'appointment-scheduling': "Hi {{first_name}}, Sarah here. Many real estate teams say scheduling tours eats up their time. Do you face that too?",
    'lead-qualification': "Hi {{first_name}}, this is Sarah from Spark AI. Brokers say too many unqualified leads take up sales hours. Do you see that?",
    'follow-up-calls': "Hi {{first_name}}, Sarah here. Many agents say they lose deals because follow-ups slip through the cracks. Does that sound familiar?",
    'market-updates': "Hi {{first_name}}, this is Sarah from Spark AI. Agents tell me they spend hours answering the same property listing questions. Does that happen to you?"
  },
  'e-commerce': {
    'order-follow-up': "Hi {{first_name}}, this is Sarah from Spark AI. Most retailers tell me 'where's my order' calls overwhelm their support. Does that happen at your company?",
    'product-recommendations': "Hi {{first_name}}, Sarah here. Many e-commerce teams say upselling and cross-selling takes too much manual effort. Do you face that?",
    'customer-support': "Hi {{first_name}}, this is Sarah from Spark AI. Retailers often say returns and refunds take up staff hours. Do you see that too?",
    'abandoned-cart': "Hi {{first_name}}, Sarah here. Teams tell me customers call daily to check stock because updates aren't automated. Do you face that?",
    'loyalty-programs': "Hi {{first_name}}, Sarah here. Many e-commerce teams say upselling and cross-selling takes too much manual effort. Do you face that?"
  },
  'automotive': {
    'service-reminders': "Hi {{first_name}}, this is Sarah from Spark AI. Service managers tell me booking calls pile up and slow down their day. Does that happen in your center?",
    'sales-follow-up': "Hi {{first_name}}, Sarah here. Dealerships say repetitive vehicle questions keep sales reps off new leads. Do you see that too?",
    'parts-availability': "Hi {{first_name}}, this is Sarah from Spark AI. Many parts teams say availability checks eat up hours. Do you face that?",
    'warranty-calls': "Hi {{first_name}}, Sarah here. Dealers tell me service reminders often get missed without automation. Does that happen at yours?",
    'trade-in-evaluation': "Hi {{first_name}}, Sarah here. Dealerships say repetitive vehicle questions keep sales reps off new leads. Do you see that too?"
  },
  'hospitality': {
    'booking-confirmations': "Hi {{first_name}}, this is Sarah from Spark AI. Hotels and travel agencies tell me booking calls pile up daily. Is that true for your team?",
    'guest-experience': "Hi {{first_name}}, this is Sarah from Spark AI. Guest service teams say calls for WiFi or amenities waste hours. Do you face that?",
    'event-planning': "Hi {{first_name}}, Sarah here. Teams say reschedules and cancellations take huge staff time. Do you see that?",
    'loyalty-rewards': "Hi {{first_name}}, Sarah here. Hotels say upselling rooms and packages manually is slow. Is that the case for you?",
    'reservation-management': "Hi {{first_name}}, Sarah here. Teams say reschedules and cancellations take huge staff time. Do you see that?"
  },
  'legal': {
    'consultation-booking': "Hi {{first_name}}, this is Sarah from Spark AI. Support teams say FAQs and Tier-1 issues clog their ticket queue. Is that the case for your team?",
    'case-updates': "Hi {{first_name}}, Sarah here. Founders tell me demo requests take too long to qualify. Do you see that too?",
    'document-collection': "Hi {{first_name}}, this is Sarah from Spark AI. SaaS teams say onboarding new users eats up hours of staff time. Does that happen in yours?",
    'client-intake': "Hi {{first_name}}, Sarah here. CS leaders say proactive reminders and usage tips don't scale without automation. Do you face that too?",
    'payment-reminders': "Hi {{first_name}}, Sarah here. CS leaders say proactive reminders and usage tips don't scale without automation. Do you face that too?"
  }
};

/**
 * Get the first message for a given industry and use case
 * @param {string} industry - The industry (e.g., 'real-estate', 'healthcare')
 * @param {string} useCase - The use case (e.g., 'lead-qualification', 'appointment-booking')
 * @param {string} firstName - The customer's first name
 * @returns {string} - The personalized first message
 */
function getFirstMessage(industry, useCase, firstName = 'there') {
  const industryMessages = FIRST_MESSAGE_MAPPING[industry];
  
  if (!industryMessages) {
    console.warn(`No first message mapping found for industry: ${industry}`);
    return `Hi ${firstName}, this is Sarah from Spark AI. I'm calling to demonstrate how our AI agent can help your business. How are you doing today?`;
  }

  const message = industryMessages[useCase];
  
  if (!message) {
    console.warn(`No first message found for industry: ${industry}, use case: ${useCase}`);
    return `Hi ${firstName}, this is Sarah from Spark AI. I'm calling to demonstrate how our AI agent can help with ${useCase}. How are you doing today?`;
  }

  // Replace {{first_name}} with actual first name
  return message.replace(/\{\{first_name\}\}/g, firstName);
}

export {
  FIRST_MESSAGE_MAPPING,
  getFirstMessage
};

