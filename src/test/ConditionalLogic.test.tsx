import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { Page1RestaurantDetails } from '../components/pages/Page1RestaurantDetails';
import { Page2WasteGenerated } from '../components/pages/Page2WasteGenerated';
import { Page4ReuseAndDineIn } from '../components/pages/Page4ReuseAndDineIn';
import { SurveyFormData } from '../types/survey';

const TestWrapperPage1 = () => {
  const form = useForm<SurveyFormData>({
    defaultValues: {
      email: 'test@restaurant.com',
      restaurantName: 'Test Bistro',
      outletsCount: 1,
      contactName: 'Tester',
      phoneNumber: '9876543210',
      role: 'Owner',
      roleOther: '',
    },
  });
  return <Page1RestaurantDetails form={form} />;
};

const TestWrapperPage2 = () => {
  const form = useForm<SurveyFormData>({
    defaultValues: {
      wetWastePerDay: 'Less than 5 kg',
      wetWasteOther: '',
      packagingWastePerDay: 'Less than 5 kg',
      packagingWasteOther: '',
      wasteDiscardMethod: 'Municipality pickup',
      wasteDiscardMethodOther: '',
      monthlyWasteCostType: 'None',
      monthlyWasteCostAmount: '',
      segregateWaste: 'Yes',
    },
  });
  return <Page2WasteGenerated form={form} />;
};

const TestWrapperPage4 = () => {
  const form = useForm<SurveyFormData>({
    defaultValues: {
      wouldSwitchToReuse: 'Yes',
      hasDineIn: 'No',
      usesSingleUseDineIn: undefined,
      dineInContainers: [],
      barrierToDineInReusables: '',
    },
  });
  return <Page4ReuseAndDineIn form={form} />;
};

describe('Conditional Logic & Field Visibility', () => {
  it('reveals Role Other text field when Other role is selected and hides when changed', () => {
    render(<TestWrapperPage1 />);

    // Initially Other input is not present
    expect(screen.queryByPlaceholderText('Please specify your role')).not.toBeInTheDocument();

    // Select Other
    const otherRadio = screen.getByLabelText('Other');
    fireEvent.click(otherRadio);

    // Other input appears
    expect(screen.getByPlaceholderText('Please specify your role')).toBeInTheDocument();

    // Select Owner again
    const ownerRadio = screen.getByLabelText('Owner');
    fireEvent.click(ownerRadio);

    // Other input disappears
    expect(screen.queryByPlaceholderText('Please specify your role')).not.toBeInTheDocument();
  });

  it('reveals numeric monthly waste cost input when Other cost type is selected', () => {
    render(<TestWrapperPage2 />);

    expect(screen.queryByPlaceholderText('Enter monthly cost in ₹ (Rs.)')).not.toBeInTheDocument();

    // Find Other radio for monthly cost section
    const costOtherRadios = screen.getAllByLabelText('Other');
    // Click monthly cost Other radio
    fireEvent.click(costOtherRadios[costOtherRadios.length - 1]);

    expect(screen.getByPlaceholderText('Enter monthly cost in ₹ (Rs.)')).toBeInTheDocument();
  });

  it('skips dine-in questions when Dine-In service is No and displays when Yes', () => {
    render(<TestWrapperPage4 />);

    // Initially hasDineIn is 'No', so Dine-In Service Details should not be displayed
    expect(screen.queryByText('Dine-In Service Details')).not.toBeInTheDocument();

    // Click 'Yes' for Dine-In Service
    const yesRadios = screen.getAllByLabelText('Yes');
    fireEvent.click(yesRadios[1]); // second Yes is hasDineIn

    // Dine-In details section appears
    expect(screen.getByText('Dine-In Service Details')).toBeInTheDocument();
    expect(screen.getByText('Do you use single-use items for dine-in (paper plates, paper cups, etc.)?')).toBeInTheDocument();
  });
});
