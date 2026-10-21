import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { fullSurveySchema } from '../../../src/validation/surveySchema.ts';

const prisma = new PrismaClient();

export const submitSurvey = async (req: Request, res: Response) => {
  try {
    const rawBody = req.body;

    // Validate payload on backend using Zod schema
    const validationResult = fullSurveySchema.safeParse(rawBody);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed on server',
        errors: validationResult.error.format(),
      });
    }

    const data = validationResult.data;

    // Convert string numbers to numbers safely
    const outletsCount = Number(data.outletsCount);
    const monthlyCostAmount = data.monthlyWasteCostAmount ? Number(data.monthlyWasteCostAmount) : null;

    // Save into database via Prisma transaction
    const submission = await prisma.surveySubmission.create({
      data: {
        email: data.email,
        restaurantName: data.restaurantName,
        outletsCount: outletsCount,
        contactName: data.contactName,
        phoneNumber: data.phoneNumber,
        role: data.role,
        roleOther: data.roleOther || null,

        wetWastePerDay: data.wetWastePerDay,
        wetWasteOther: data.wetWasteOther || null,
        packagingWastePerDay: data.packagingWastePerDay,
        packagingWasteOther: data.packagingWasteOther || null,
        wasteDiscardMethod: data.wasteDiscardMethod,
        wasteDiscardMethodOther: data.wasteDiscardMethodOther || null,
        monthlyWasteCostType: data.monthlyWasteCostType,
        monthlyWasteCostAmount: monthlyCostAmount,
        segregateWaste: data.segregateWaste,

        onlineSalesPercent: data.onlineSalesPercent,
        packingMaterials: JSON.stringify(data.packingMaterials),
        packingMaterialsOther: data.packingMaterialsOther || null,
        containerTypesCount: data.containerTypesCount,
        containerTypesCountOther: data.containerTypesCountOther || null,

        onlineContainers: {
          create: data.onlineContainers.map(item => ({
            name: item.name,
            sizeOrVolume: item.sizeOrVolume,
            material: item.material,
            quantityPerDay: Number(item.quantityPerDay),
          })),
        },

        wouldSwitchToReuse: data.wouldSwitchToReuse,
        hasDineIn: data.hasDineIn,
        usesSingleUseDineIn: data.usesSingleUseDineIn || null,
        barrierToDineInReusables: data.barrierToDineInReusables || null,

        dineInContainers: data.dineInContainers && data.dineInContainers.length > 0 ? {
          create: data.dineInContainers.map(item => ({
            name: item.name,
            sizeOrVolume: item.sizeOrVolume,
            material: item.material,
            quantityPerDay: Number(item.quantityPerDay),
          })),
        } : undefined,

        kitchenIngredients: {
          create: data.kitchenIngredients.map(item => ({
            product: item.product,
            quantityPerMonth: Number(item.quantityPerMonth),
            unit: item.unit,
            unitOther: item.unitOther || null,
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

    console.log(`[Server] Survey submission saved successfully! Submission ID: ${submission.id}`);

    return res.status(201).json({
      success: true,
      message: 'Survey submission stored successfully!',
      submissionId: submission.id,
    });
  } catch (error: any) {
    console.error('[Server Error] Exception in submitSurvey:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while processing submission.',
      error: error.message,
    });
  }
};

export const getSubmissions = async (_req: Request, res: Response) => {
  try {
    const submissions = await prisma.surveySubmission.findMany({
      include: {
        onlineContainers: true,
        dineInContainers: true,
        kitchenIngredients: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, count: submissions.length, data: submissions });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
