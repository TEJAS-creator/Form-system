import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface ColumnDefinition {
  key: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'select';
  options?: { label: string; value: string; hasCustomInput?: boolean }[];
  customInputKey?: string;
}

interface RepeatableTableProps {
  title?: string;
  subtitle?: string;
  columns: ColumnDefinition[];
  data: Record<string, any>[];
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onChangeField: (index: number, field: string, value: any) => void;
  addButtonText?: string;
  minRows?: number;
  errors?: Record<number, Record<string, string>>;
}

export const RepeatableTable: React.FC<RepeatableTableProps> = ({
  title,
  subtitle,
  columns,
  data,
  onAddRow,
  onRemoveRow,
  onChangeField,
  addButtonText = "+ Add Row",
  minRows = 1,
  errors = {},
}) => {
  return (
    <div className="space-y-4">
      {(title || subtitle) && (
        <div>
          {title && <h4 className="text-sm font-semibold text-slate-900">{title}</h4>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      {/* Desktop View (SM and up: >= 640px) */}
      <div className="hidden sm:block overflow-x-auto border border-slate-200 rounded-lg bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              {columns.map((col) => (
                <th key={col.key} className="py-2.5 px-3">
                  {col.label} <span className="text-rose-500">*</span>
                </th>
              ))}
              <th className="py-2.5 px-3 w-14 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-2.5 px-3 font-medium text-slate-500 text-center">{idx + 1}</td>
                {columns.map((col) => {
                  const fieldValue = row[col.key] || '';
                  const colError = errors[idx]?.[col.key];

                  return (
                    <td key={col.key} className="py-2.5 px-3 align-top">
                      {col.type === 'select' ? (
                        <div className="space-y-1">
                          <select
                            value={fieldValue}
                            onChange={(e) => onChangeField(idx, col.key, e.target.value)}
                            className={`w-full px-2.5 py-1.5 rounded-md border text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                              colError ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                            }`}
                          >
                            <option value="">Select option</option>
                            {col.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>

                          {/* Custom input if Other selected */}
                          {fieldValue === 'Other' && col.customInputKey && (
                            <input
                              type="text"
                              placeholder="Specify unit"
                              value={row[col.customInputKey] || ''}
                              onChange={(e) => onChangeField(idx, col.customInputKey!, e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          )}
                        </div>
                      ) : (
                        <input
                          type={col.type || 'text'}
                          placeholder={col.placeholder}
                          value={fieldValue}
                          onChange={(e) => onChangeField(idx, col.key, e.target.value)}
                          className={`w-full px-2.5 py-1.5 rounded-md border text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            colError ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                          }`}
                        />
                      )}
                      {colError && <span className="text-[10px] text-rose-500 mt-0.5 block">{colError}</span>}
                    </td>
                  );
                })}
                <td className="py-2.5 px-3 text-center align-top">
                  {data.length > minRows && (
                    <button
                      type="button"
                      onClick={() => onRemoveRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout (< 640px, perfect for 360px & 390px screens) */}
      <div className="sm:hidden space-y-3">
        {data.map((row, idx) => (
          <div
            key={row.id || idx}
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative shadow-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/50">
                Item #{idx + 1}
              </span>
              {data.length > minRows && (
                <button
                  type="button"
                  onClick={() => onRemoveRow(idx)}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center font-medium bg-white px-2 py-1 rounded border border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {columns.map((col) => {
                const fieldValue = row[col.key] || '';
                const colError = errors[idx]?.[col.key];

                return (
                  <div key={col.key} className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 block">
                      {col.label} <span className="text-rose-500">*</span>
                    </label>

                    {col.type === 'select' ? (
                      <div className="space-y-1">
                        <select
                          value={fieldValue}
                          onChange={(e) => onChangeField(idx, col.key, e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            colError ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                          }`}
                        >
                          <option value="">Select option</option>
                          {col.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        {fieldValue === 'Other' && col.customInputKey && (
                          <input
                            type="text"
                            placeholder="Specify custom unit"
                            value={row[col.customInputKey] || ''}
                            onChange={(e) => onChangeField(idx, col.customInputKey!, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        )}
                      </div>
                    ) : (
                      <input
                        type={col.type || 'text'}
                        placeholder={col.placeholder}
                        value={fieldValue}
                        onChange={(e) => onChangeField(idx, col.key, e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          colError ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                        }`}
                      />
                    )}

                    {colError && <span className="text-[11px] text-rose-500 block">{colError}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add Row Button */}
      <button
        type="button"
        onClick={onAddRow}
        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-colors shadow-xs"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        {addButtonText}
      </button>
    </div>
  );
};
