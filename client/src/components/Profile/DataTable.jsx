import React from "react";

export default function DataTable({
  title,
  data = [],
  columns = [],
  filterOptions = [],
  filterValue,
  setFilter,
}) {
  return (
    <div className='bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border border-white/10 rounded-2xl p-6 shadow-lg'>
      {/* Title */}
      <h2 className='text-2xl font-bold text-white mb-6'>{title}</h2>

      {/* Filters */}
      {filterOptions.length > 0 && (
        <div className='flex flex-wrap gap-3 mb-6'>
          {["All", ...filterOptions].map((opt) => (
            <button
              key={opt}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterValue === opt
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
              onClick={() => setFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className='overflow-x-auto rounded-xl bg-black/20 backdrop-blur-sm border border-white/10'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-white/5'>
              {columns.map((col) => (
                <th
                  key={col.key || col.label}
                  className='py-3 px-4 text-sm font-semibold text-gray-200 tracking-wide'
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr
                  key={row.id || i}
                  className='border-b border-white/10 hover:bg-white/10 transition-colors'
                >
                  {columns.map((col) => (
                    <td
                      key={col.key || col.label}
                      className='py-3 px-4 text-gray-300 text-sm'
                    >
                      {col.render
                        ? col.render(row)
                        : row[col.key] || row[col.label]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className='py-6 px-4 text-center text-gray-400'
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
