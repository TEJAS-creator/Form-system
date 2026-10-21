import { z } from 'zod';

export const containerItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Container name or type is required' }),
  sizeOrVolume: z.string().min(1, { message: 'Size or volume is required' }),
  material: z.string().min(1, { message: 'Material is required' }),
  quantityPerDay: z.union([z.string(), z.number()]).refine(val => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, { message: 'Quantity per day must be a valid positive number' })
});

export const ingredientItemSchema = z.object({
  id: z.string(),
  product: z.string().min(1, { message: 'Product or ingredient name is required' }),
  quantityPerMonth: z.union([z.string(), z.number()]).refine(val => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }, { message: 'Monthly quantity must be a valid positive number' }),
  unit: z.string().min(1, { message: 'Unit is required' }),
  unitOther: z.string().optional(),
  brand: z.string().min(1, { message: 'Brand or company is required' })
}).refine(data => {
  if (data.unit === 'Other') {
    return !!data.unitOther && data.unitOther.trim().length > 0;
  }
  return true;
}, {
  message: 'Please specify the custom unit',
  path: ['unitOther']
});

export const page1Schema = z.object({
  email: z.string().min(1, { message: 'Email address is required' }).email({ message: 'Please enter a valid email address' }),
  restaurantName: z.string().min(1, { message: 'Restaurant name is required' }),
  outletsCount: z.union([z.string(), z.number()]).refine(val => {
    const num = Number(val);
    return !isNaN(num) && num >= 1;
  }, { message: 'Please enter a valid number of outlets (at least 1)' }),
  contactName: z.string().min(1, { message: 'Your name is required' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required' }).regex(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/, { message: 'Please enter a valid phone number' }),
  role: z.string().min(1, { message: 'Please select your role' }),
  roleOther: z.string().optional()
}).refine(data => {
  if (data.role === 'Other') {
    return !!data.roleOther && data.roleOther.trim().length > 0;
  }
  return true;
}, {
  message: 'Please specify your role',
  path: ['roleOther']
});

export const page2Schema = z.object({
  wetWastePerDay: z.string().min(1, { message: 'Please select wet waste quantity' }),
  wetWasteOther: z.string().optional(),
  packagingWastePerDay: z.string().min(1, { message: 'Please select packaging waste quantity' }),
  packagingWasteOther: z.string().optional(),
  wasteDiscardMethod: z.string().min(1, { message: 'Please select waste discard method' }),
  wasteDiscardMethodOther: z.string().optional(),
  monthlyWasteCostType: z.string().min(1, { message: 'Please select monthly waste cost option' }),
  monthlyWasteCostAmount: z.union([z.string(), z.number()]).optional(),
  segregateWaste: z.enum(['Yes', 'No'], { errorMap: () => ({ message: 'Please indicate if you segregate waste' }) })
}).refine(data => {
  if (data.wetWastePerDay === 'Other' && (!data.wetWasteOther || data.wetWasteOther.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'Please specify custom wet waste amount',
  path: ['wetWasteOther']
}).refine(data => {
  if (data.packagingWastePerDay === 'Other' && (!data.packagingWasteOther || data.packagingWasteOther.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'Please specify custom packaging waste amount',
  path: ['packagingWasteOther']
}).refine(data => {
  if (data.wasteDiscardMethod === 'Other' && (!data.wasteDiscardMethodOther || data.wasteDiscardMethodOther.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'Please specify custom waste discard method',
  path: ['wasteDiscardMethodOther']
}).refine(data => {
  if (data.monthlyWasteCostType === 'Other') {
    if (data.monthlyWasteCostAmount === undefined || data.monthlyWasteCostAmount === '') return false;
    const num = Number(data.monthlyWasteCostAmount);
    return !isNaN(num) && num >= 0;
  }
  return true;
}, {
  message: 'Please enter a valid monthly cost in ₹',
  path: ['monthlyWasteCostAmount']
});

export const page3Schema = z.object({
  onlineSalesPercent: z.string().min(1, { message: 'Please select percentage of online sales' }),
  packingMaterials: z.array(z.string()).min(1, { message: 'Please select at least one packing material' }),
  packingMaterialsOther: z.string().optional(),
  containerTypesCount: z.string().min(1, { message: 'Please select container types count' }),
  containerTypesCountOther: z.string().optional(),
  onlineContainers: z.array(containerItemSchema).min(1, { message: 'Please add at least one container type details' })
}).refine(data => {
  if (data.packingMaterials.includes('Other') && (!data.packingMaterialsOther || data.packingMaterialsOther.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'Please specify custom packing material',
  path: ['packingMaterialsOther']
}).refine(data => {
  if (data.containerTypesCount === 'Other' && (!data.containerTypesCountOther || data.containerTypesCountOther.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'Please specify number of container types',
  path: ['containerTypesCountOther']
});

export const page4Schema = z.object({
  wouldSwitchToReuse: z.enum(['Yes', 'No', 'Maybe'], { errorMap: () => ({ message: 'Please select an option' }) }),
  hasDineIn: z.enum(['Yes', 'No'], { errorMap: () => ({ message: 'Please specify if you have dine-in service' }) }),
  usesSingleUseDineIn: z.enum(['Yes', 'No']).optional(),
  dineInContainers: z.array(containerItemSchema).optional(),
  barrierToDineInReusables: z.string().optional()
}).refine(data => {
  if (data.hasDineIn === 'Yes' && !data.usesSingleUseDineIn) {
    return false;
  }
  return true;
}, {
  message: 'Please indicate if you use single-use items for dine-in',
  path: ['usesSingleUseDineIn']
}).refine(data => {
  if (data.hasDineIn === 'Yes' && data.usesSingleUseDineIn === 'Yes') {
    return data.dineInContainers && data.dineInContainers.length > 0;
  }
  return true;
}, {
  message: 'Please add at least one single-use dine-in item details',
  path: ['dineInContainers']
});

export const page5Schema = z.object({
  kitchenIngredients: z.array(ingredientItemSchema).min(1, { message: 'Please add at least one kitchen ingredient' })
});

export const fullSurveySchema = page1Schema.and(page2Schema).and(page3Schema).and(page4Schema).and(page5Schema);
