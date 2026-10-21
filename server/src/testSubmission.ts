import { PrismaClient } from '@prisma/client';
import { fullSurveySchema } from '../../src/validation/surveySchema';

const prisma = new PrismaClient();

const samplePayload = {
  // Page 1
  email: 'owner@bangaloreeats.in',
  restaurantName: 'Bangalore Spice Hub',
  outletsCount: 3,
  contactName: 'Anil Kumar',
  phoneNumber: '+91 98765 12345',
  role: 'Owner',
  roleOther: '',

  // Page 2
  wetWastePerDay: '15–30 kg',
  wetWasteOther: '',
  packagingWastePerDay: '5–15 kg',
  packagingWasteOther: '',
  wasteDiscardMethod: 'Private vendor',
  wasteDiscardMethodOther: '',
  monthlyWasteCostType: 'Other',
  monthlyWasteCostAmount: 1500,
  segregateWaste: 'Yes',

  // Page 3
  onlineSalesPercent: '51–75%',
  packingMaterials: ['Plastic', 'Paper', 'Biodegradable (Bagasse & Areca)'],
  packingMaterialsOther: '',
  containerTypesCount: '3–5',
  containerTypesCountOther: '',
  onlineContainers: [
    {
      id: 'cont-1',
      name: 'Biryani Meal Box',
      sizeOrVolume: '750ml',
      material: 'PP Plastic',
      quantityPerDay: 120,
    },
    {
      id: 'cont-2',
      name: 'Curry Container',
      sizeOrVolume: '500ml',
      material: 'Paper Box',
      quantityPerDay: 80,
    },
  ],

  // Page 4
  wouldSwitchToReuse: 'Yes',
  hasDineIn: 'Yes',
  usesSingleUseDineIn: 'Yes',
  dineInContainers: [
    {
      id: 'dine-1',
      name: 'Water Cup',
      sizeOrVolume: '200ml',
      material: 'Paper',
      quantityPerDay: 150,
    },
  ],
  barrierToDineInReusables: 'Lack of automatic commercial dishwasher and space constraint.',

  // Page 5
  kitchenIngredients: [
    {
      id: 'ing-1',
      product: 'Sunflower Cooking Oil',
      quantityPerMonth: 100,
      unit: 'litres',
      brand: 'Freedom',
    },
    {
      id: 'ing-2',
      product: 'Basmati Rice',
      quantityPerMonth: 250,
      unit: 'kg',
      brand: 'India Gate',
    },
  ],
};

async function testBackendSubmission() {
  console.log('--- Testing Backend Submission & Prisma Database ---');
  const validation = fullSurveySchema.safeParse(samplePayload);

  if (!validation.success) {
    console.error('Validation failed:', validation.error.format());
    process.exit(1);
  }

  console.log('✅ Zod validation passed!');

  const data = validation.data;
  const submission = await prisma.surveySubmission.create({
    data: {
      email: data.email,
      restaurantName: data.restaurantName,
      outletsCount: Number(data.outletsCount),
      contactName: data.contactName,
      phoneNumber: data.phoneNumber,
      role: data.role,
      roleOther: data.roleOther || null,
      wetWastePerDay: data.wetWastePerDay,
      packagingWastePerDay: data.packagingWastePerDay,
      wasteDiscardMethod: data.wasteDiscardMethod,
      monthlyWasteCostType: data.monthlyWasteCostType,
      monthlyWasteCostAmount: Number(data.monthlyWasteCostAmount),
      segregateWaste: data.segregateWaste,
      onlineSalesPercent: data.onlineSalesPercent,
      packingMaterials: JSON.stringify(data.packingMaterials),
      containerTypesCount: data.containerTypesCount,
      wouldSwitchToReuse: data.wouldSwitchToReuse,
      hasDineIn: data.hasDineIn,
      usesSingleUseDineIn: data.usesSingleUseDineIn || null,
      barrierToDineInReusables: data.barrierToDineInReusables || null,
      onlineContainers: {
        create: data.onlineContainers.map((item) => ({
          name: item.name,
          sizeOrVolume: item.sizeOrVolume,
          material: item.material,
          quantityPerDay: Number(item.quantityPerDay),
        })),
      },
      dineInContainers: {
        create: (data.dineInContainers || []).map((item) => ({
          name: item.name,
          sizeOrVolume: item.sizeOrVolume,
          material: item.material,
          quantityPerDay: Number(item.quantityPerDay),
        })),
      },
      kitchenIngredients: {
        create: data.kitchenIngredients.map((item) => ({
          product: item.product,
          quantityPerMonth: Number(item.quantityPerMonth),
          unit: item.unit,
          brand: item.brand,
        })),
      },
    },
    include: {
      onlineContainers: true,
      dineInContainers: true,
      kitchenIngredients: true,
    },
  });

  console.log('🎉 Successfully saved test submission to SQLite Prisma DB!');
  console.log('Submission ID:', submission.id);
  console.log('Restaurant Name:', submission.restaurantName);
  console.log('Online Containers Saved:', submission.onlineContainers.length);
  console.log('Dine-In Containers Saved:', submission.dineInContainers.length);
  console.log('Ingredients Saved:', submission.kitchenIngredients.length);
}

testBackendSubmission()
  .catch((e) => {
    console.error('Error during test submission:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
