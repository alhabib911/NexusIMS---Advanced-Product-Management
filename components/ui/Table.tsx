
import React from 'react';

interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
}

export const Table = <T extends { id: string | number },>({ columns, data, loading }: TableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto border border-gray-100 rounded-xl bg-white shadow-sm">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-[#fcfcfc] border-b border-gray-100 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-4">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-pulse h-4 w-48 bg-gray-100 rounded"></div>
                  <div className="animate-pulse h-4 w-32 bg-gray-100 rounded"></div>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                No data found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
