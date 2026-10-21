import { describe, it, expect } from 'vitest';
import {
  page1Schema,
  page2Schema,
  page3Schema,
  page4Schema,
  page5Schema,
  fullSurveySchema,
} from '../validation/surveySchema';

describe('Zod Validation Schemas', () => {
  it('validates Page 1 required fields correctly', () => {
    const invalidData = {
      email: 'invalid-email',
      restaurantName: '',
      outletsCount: 0,
      contactName: '',
      phoneNumber: '',
      role: 'Other',
      roleOther: '',
    };

    const result = page1Schema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const issues = result.error.issues;
      expect(issues.some((i) => i.path.includes('email'))).toBe(true);
      expect(issues.some((i) => i.path.includes('restaurantName'))).toBe(true);
      expect(issues.some((i) => i.path.includes('outletsCount'))).toBe(true);
      expect(issues.some((i) => i.path.includes('roleOther'))).toBe(true);
    }
  });

  it('passes Page 1 valid data', () => {
    const validData = {
      email: 'owner@greenbistro.com',
      restaurantName: 'Green Bistro',
      outletsCount: 2,
      contactName: 'Suresh Kumar',
      phoneNumber: '+91 9876543210',
      role: 'Owner',
    };

    const result = page1Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('validates Page 2 numeric waste cost when Other selected', () => {
    const invalidCost = {
      wetWastePerDay: '5–15 kg',
      packagingWastePerDay: '5–15 kg',
      wasteDiscardMethod: 'Private vendor',
      monthlyWasteCostType: 'Other',
      monthlyWasteCostAmount: 'not-a-number',
      segregateWaste: 'Yes',
    };

    const result = page2Schema.safeParse(invalidCost);
    expect(result.success).toBe(false);
  });

  it('does NOT trigger validation errors for hidden dine-in fields when hasDineIn is No', () => {
    const noDineInData = {
      wouldSwitchToReuse: 'Yes',
      hasDineIn: 'No',
      // usesSingleUseDineIn, dineInContainers, and barrierToDineInReusables omitted
    };

    const result = page4Schema.safeParse(noDineInData);
    expect(result.success).toBe(true);
  });

  it('requires dineInContainers when hasDineIn is Yes and usesSingleUseDineIn is Yes', () => {
    const missingContainers = {
      wouldSwitchToReuse: 'Yes',
      hasDineIn: 'Yes',
      usesSingleUseDineIn: 'Yes',
      dineInContainers: [],
    };

    const result = page4Schema.safeParse(missingContainers);
    expect(result.success).toBe(false);
  });

  it('validates kitchen ingredients numeric quantities and required fields', () => {
    const invalidIngredient = {
      kitchenIngredients: [
        {
          id: '1',
          product: '',
          quantityPerMonth: -10,
          unit: 'kg',
          brand: '',
        },
      ],
    };

    const result = page5Schema.safeParse(invalidIngredient);
    expect(result.success).toBe(false);
  });
});
