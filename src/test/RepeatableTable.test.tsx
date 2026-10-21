import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RepeatableTable, ColumnDefinition } from '../components/RepeatableTable';

describe('RepeatableTable Component', () => {
  const sampleColumns: ColumnDefinition[] = [
    { key: 'name', label: 'Item Name', placeholder: 'Enter item' },
    { key: 'quantityPerDay', label: 'Daily Quantity', placeholder: '0', type: 'number' },
  ];

  const initialData = [
    { id: '1', name: 'Meal Box 500ml', quantityPerDay: 50 },
    { id: '2', name: 'Curry Bowl 250ml', quantityPerDay: 30 },
  ];

  it('renders table headers and initial rows on desktop view', () => {
    render(
      <RepeatableTable
        title="Test Containers"
        columns={sampleColumns}
        data={initialData}
        onAddRow={vi.fn()}
        onRemoveRow={vi.fn()}
        onChangeField={vi.fn()}
        addButtonText="+ Add Item"
      />
    );

    expect(screen.getByText('Test Containers')).toBeInTheDocument();
    expect(screen.getAllByText('Item Name')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Daily Quantity')[0]).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('Meal Box 500ml')[0]).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('Curry Bowl 250ml')[0]).toBeInTheDocument();
  });

  it('triggers onAddRow when Add button is clicked', () => {
    const handleAddRow = vi.fn();
    render(
      <RepeatableTable
        columns={sampleColumns}
        data={initialData}
        onAddRow={handleAddRow}
        onRemoveRow={vi.fn()}
        onChangeField={vi.fn()}
        addButtonText="+ Add Container"
      />
    );

    const addButton = screen.getByText('+ Add Container');
    fireEvent.click(addButton);
    expect(handleAddRow).toHaveBeenCalledTimes(1);
  });

  it('triggers onChangeField when an input value is edited', () => {
    const handleChangeField = vi.fn();
    render(
      <RepeatableTable
        columns={sampleColumns}
        data={initialData}
        onAddRow={vi.fn()}
        onRemoveRow={vi.fn()}
        onChangeField={handleChangeField}
      />
    );

    const inputs = screen.getAllByDisplayValue('Meal Box 500ml');
    fireEvent.change(inputs[0], { target: { value: 'Updated Meal Box' } });
    expect(handleChangeField).toHaveBeenCalledWith(0, 'name', 'Updated Meal Box');
  });

  it('triggers onRemoveRow when delete button is clicked', () => {
    const handleRemoveRow = vi.fn();
    render(
      <RepeatableTable
        columns={sampleColumns}
        data={initialData}
        onAddRow={vi.fn()}
        onRemoveRow={handleRemoveRow}
        onChangeField={vi.fn()}
        minRows={1}
      />
    );

    // Click remove button for second row
    const deleteButtons = screen.getAllByTitle('Remove row');
    fireEvent.click(deleteButtons[1]);
    expect(handleRemoveRow).toHaveBeenCalledWith(1);
  });

  it('renders field validation errors when present', () => {
    const errors = {
      0: { name: 'Item name is required' },
    };

    render(
      <RepeatableTable
        columns={sampleColumns}
        data={[{ id: '1', name: '', quantityPerDay: 10 }]}
        onAddRow={vi.fn()}
        onRemoveRow={vi.fn()}
        onChangeField={vi.fn()}
        errors={errors}
      />
    );

    expect(screen.getAllByText('Item name is required')[0]).toBeInTheDocument();
  });
});
