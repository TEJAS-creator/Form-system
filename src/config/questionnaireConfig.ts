export interface QuestionOption {
  label: string;
  value: string;
  hasCustomInput?: boolean;
}

export interface QuestionnaireStepConfig {
  id: number;
  title: string;
  shortTitle: string;
  description?: string;
  contactHeaderDescription?: string;
}

export const QUESTIONNAIRE_CONFIG = {
  surveyTitle: "Help Us Build a Reuse System for Bangalore Restaurants",
  surveySubtitle: "A 5-minute survey to shape sustainable packaging & clean reusable infrastructure for restaurants across Bangalore.",

  steps: [
    {
      id: 1,
      title: "Restaurant Details",
      shortTitle: "Details",
      description: "Basic details about your business and primary contact point.",
      contactHeaderDescription: "So we can follow up if this looks like a good fit for your restaurant."
    },
    {
      id: 2,
      title: "Waste Generated",
      shortTitle: "Waste",
      description: "Helps us understand how much waste (wet & dry) your restaurant generates daily."
    },
    {
      id: 3,
      title: "Online Sales & Packaging",
      shortTitle: "Packaging",
      description: "A few questions about your delivery/online order packaging."
    },
    {
      id: 4,
      title: "Reuse & Dine-In",
      shortTitle: "Reuse & Dine-in",
      description: "Assessing interest in returnable containers and dine-in reusable solutions."
    },
    {
      id: 5,
      title: "Kitchen Ingredients",
      shortTitle: "Ingredients",
      description: "Information on key kitchen ingredients consumed monthly."
    },
    {
      id: 6,
      title: "Confirmation",
      shortTitle: "Thank You",
      description: "Submission completed."
    }
  ] as QuestionnaireStepConfig[],

  // Page 1 Questions
  page1: {
    email: {
      label: "Email Address",
      placeholder: "name@restaurant.com",
      helperText: "Used for sending confirmation and system updates."
    },
    restaurantName: {
      label: "Restaurant Name",
      placeholder: "e.g. The Green Kitchen"
    },
    outletsCount: {
      label: "Number of outlets in Bangalore",
      placeholder: "e.g. 1"
    },
    contactSectionTitle: "Contact Details",
    contactSectionDescription: "So we can follow up if this looks like a good fit for your restaurant.",
    contactName: {
      label: "Your Name",
      placeholder: "e.g. Rajesh Kumar"
    },
    phoneNumber: {
      label: "Phone Number",
      placeholder: "e.g. +91 98765 43210",
      helperText: "No spam calls don't worry!"
    },
    role: {
      label: "Your Role",
      options: [
        { label: "Owner", value: "Owner" },
        { label: "Manager", value: "Manager" },
        { label: "Other", value: "Other", hasCustomInput: true }
      ]
    },
    roleOther: {
      placeholder: "Please specify your role"
    }
  },

  // Page 2 Questions
  page2: {
    wetWastePerDay: {
      label: "How much wet waste do you generate per day?",
      options: [
        { label: "Less than 5 kg", value: "Less than 5 kg" },
        { label: "5–15 kg", value: "5–15 kg" },
        { label: "15–30 kg", value: "15–30 kg" },
        { label: "30–50 kg", value: "30–50 kg" },
        { label: "Other", value: "Other", hasCustomInput: true }
      ]
    },
    packagingWastePerDay: {
      label: "How much packaging waste do you generate per day?",
      options: [
        { label: "Less than 5 kg", value: "Less than 5 kg" },
        { label: "5–15 kg", value: "5–15 kg" },
        { label: "15–30 kg", value: "15–30 kg" },
        { label: "30–50 kg+", value: "30–50 kg+" },
        { label: "Other", value: "Other", hasCustomInput: true }
      ]
    },
    wasteDiscardMethod: {
      label: "How do you discard your waste?",
      options: [
        { label: "Municipality pickup", value: "Municipality pickup" },
        { label: "Private vendor", value: "Private vendor" },
        { label: "Compost on-site", value: "Compost on-site" },
        { label: "Other", value: "Other", hasCustomInput: true }
      ]
    },
    monthlyWasteCostType: {
      label: "How much do you pay the waste collector per month in Rs. to pick up waste?",
      options: [
        { label: "None", value: "None" },
        { label: "Other", value: "Other", hasCustomInput: true }
      ],
      amountPlaceholder: "Enter monthly cost in ₹ (Rs.)"
    },
    segregateWaste: {
      label: "Do you segregate waste into wet and dry?",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" }
      ]
    }
  },

  // Page 3 Questions
  page3: {
    onlineSalesPercent: {
      label: "What percentage of your total sales are online?",
      options: [
        { label: "0–25%", value: "0–25%" },
        { label: "26–50%", value: "26–50%" },
        { label: "51–75%", value: "51–75%" },
        { label: "76–100%", value: "76–100%" }
      ]
    },
    packingMaterials: {
      label: "What material do you use for packing food for online deliveries?",
      helperText: "Select all options that apply.",
      options: [
        { label: "Plastic", value: "Plastic" },
        { label: "Paper", value: "Paper" },
        { label: "Biodegradable (Bagasse & Areca)", value: "Biodegradable (Bagasse & Areca)" },
        { label: "Aluminum foil", value: "Aluminum foil" },
        { label: "Other", value: "Other", hasCustomInput: true }
      ]
    },
    containerTypesCount: {
      label: "How many different types/sizes of containers do you use?",
      options: [
        { label: "1–2", value: "1–2" },
        { label: "3–5", value: "3–5" },
        { label: "6–8", value: "6–8" },
        { label: "Other", value: "Other", hasCustomInput: true }
      ]
    },
    onlineContainersTable: {
      title: "Can you name these container types?",
      subtitle: "Add details for each container type used in delivery orders.",
      columns: {
        name: { label: "Container type/name", placeholder: "e.g. Meal box, Curry bowl 500ml" },
        size: { label: "Container volume or size", placeholder: "e.g. 500ml, 1000ml, Medium" },
        material: { label: "Container material", placeholder: "e.g. PP Plastic, Kraft Paper" },
        quantity: { label: "Average quantity used per day", placeholder: "e.g. 150" }
      },
      addButtonText: "+ Add Container Type"
    }
  },

  // Page 4 Questions
  page4: {
    wouldSwitchToReuse: {
      label: "If a reuse system existed, where containers are collected from customers, cleaned, and returned to you, at the same cost as your current expenses, would you switch from single-use to reuse containers?",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Maybe", value: "Maybe" }
      ]
    },
    hasDineIn: {
      label: "Do you have dine-in service?",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" }
      ]
    },
    usesSingleUseDineIn: {
      label: "Do you use single-use items for dine-in (paper plates, paper cups, etc.)?",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" }
      ]
    },
    dineInContainersTable: {
      title: "Single-Use Dine-In Items",
      subtitle: "List the single-use items used in your dine-in service.",
      columns: {
        name: { label: "Item/container name", placeholder: "e.g. Paper cup 200ml, Paper plate" },
        size: { label: "Size or volume", placeholder: "e.g. 200ml, 10 inch" },
        material: { label: "Material", placeholder: "e.g. PE Coated Paper, Areca Leaf" },
        quantity: { label: "Approximate quantity used per day", placeholder: "e.g. 200" }
      },
      addButtonText: "+ Add Dine-In Item"
    },
    barrierToDineInReusables: {
      label: "What stops you from using steel, glass or similar items for the dine-in experience if you are currently using single-use?",
      placeholder: "e.g. Dishwashing cost, high breakage rate, lack of space, labor shortage...",
      helperText: "Optional detailed response."
    }
  },

  // Page 5 Questions
  page5: {
    kitchenIngredientsTable: {
      title: "Kitchen Ingredients Consumed Monthly",
      subtitle: "List key raw ingredients and supplies used in your kitchen.",
      columns: {
        product: { label: "Product/ingredient", placeholder: "e.g. Cooking Oil, Cooking Rice, Paneer" },
        quantity: { label: "Quantity consumed per month", placeholder: "e.g. 50" },
        unit: {
          label: "Unit",
          options: [
            { label: "kg", value: "kg" },
            { label: "g", value: "g" },
            { label: "litres", value: "litres" },
            { label: "ml", value: "ml" },
            { label: "units", value: "units" },
            { label: "Other", value: "Other", hasCustomInput: true }
          ]
        },
        brand: { label: "Brand/company", placeholder: "e.g. Fortune, Amul, Local Vendor" }
      },
      addButtonText: "+ Add Kitchen Ingredient"
    }
  },

  // Page 6 Thank You Page
  page6: {
    heading: "Thank you!",
    messageParagraphs: [
      "We understand that this did take some time from your daily routine. We appreciate your trust in us and providing the data.",
      "Please give us sometime to analyse the data."
    ]
  }
};
