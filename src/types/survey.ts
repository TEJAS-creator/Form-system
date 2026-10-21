export interface ContainerItem {
  id: string;
  name: string;
  sizeOrVolume: string;
  material: string;
  quantityPerDay: string | number;
}

export interface IngredientItem {
  id: string;
  product: string;
  quantityPerMonth: string | number;
  unit: 'kg' | 'g' | 'litres' | 'ml' | 'units' | 'Other' | string;
  unitOther?: string;
  brand: string;
}

export interface SurveyFormData {
  // Page 1: Restaurant Details
  email: string;
  restaurantName: string;
  outletsCount: string | number;
  contactName: string;
  phoneNumber: string;
  role: 'Owner' | 'Manager' | 'Other' | string;
  roleOther?: string;

  // Page 2: Waste Generated
  wetWastePerDay: 'Less than 5 kg' | '5–15 kg' | '15–30 kg' | '30–50 kg' | 'Other' | string;
  wetWasteOther?: string;
  packagingWastePerDay: 'Less than 5 kg' | '5–15 kg' | '15–30 kg' | '30–50 kg+' | 'Other' | string;
  packagingWasteOther?: string;
  wasteDiscardMethod: 'Municipality pickup' | 'Private vendor' | 'Compost on-site' | 'Other' | string;
  wasteDiscardMethodOther?: string;
  monthlyWasteCostType: 'None' | 'Other' | string;
  monthlyWasteCostAmount?: string | number;
  segregateWaste: 'Yes' | 'No' | string;

  // Page 3: Online Sales and Packaging
  onlineSalesPercent: '0–25%' | '26–50%' | '51–75%' | '76–100%' | string;
  packingMaterials: string[]; // Plastic, Paper, Biodegradable (Bagasse & Areca), Aluminum foil, Other
  packingMaterialsOther?: string;
  containerTypesCount: '1–2' | '3–5' | '6–8' | 'Other' | string;
  containerTypesCountOther?: string;
  onlineContainers: ContainerItem[];

  // Page 4: Reuse and Dine-In
  wouldSwitchToReuse: 'Yes' | 'No' | 'Maybe' | string;
  hasDineIn: 'Yes' | 'No' | string;
  usesSingleUseDineIn?: 'Yes' | 'No' | string;
  dineInContainers?: ContainerItem[];
  barrierToDineInReusables?: string;

  // Page 5: Kitchen Ingredients
  kitchenIngredients: IngredientItem[];
}

export type SurveyStep = 1 | 2 | 3 | 4 | 5 | 6;
