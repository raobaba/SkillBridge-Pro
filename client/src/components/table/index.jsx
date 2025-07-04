/**
 * --------------------------------------------------------
 * File        : DataTable.jsx
 * Description : Renders a customizable data table with features such as sorting,
 *               filtering, pagination, row editing, and data export functionality.
 * Author      : Developer Team
 * Created On  : 2025-05-07
 * Updated On  : 2025-05-07
 * --------------------------------------------------------
 * Notes:
 * - Displays dynamic data in a table with pagination, search, and filter options.
 * - Includes sorting functionality with ascending/descending order.
 * - Editable rows with the ability to update cell values.
 * - Pagination with custom page size and page navigation.
 * - Export functionality to CSV.
 * - Integrates with the `AgentDetails` modal for displaying agent information.
 * - Uses Tailwind CSS for layout and styling.
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  DataButton,
  DateOptionsDropdown,
  Dropdown,
  ScrollBar,
  SearchInput,
} from "../../ui-controls";

import { Image } from "../../../src/ui-controls/index";
import noDataImage from "../../../src/assets/images/no_data_found.png";
const DataTable = ({
  tableHeading,
  initialData = [],
  columns = [],
  defaultPageSize = 10,
  editable = true,
  onRowAdd = () => {},
  onRowDelete = (id) => {},
  onCellUpdate = (rowId, field, value) => {},
  setSearchTerm,
  // setPageSizePagination,
  totalRecords = 0,
  setSelectedPageSize,
  setCurrentPageNumber,
  selectedPageSize,
  handleExportCsv,
  currentPageNumber,
  searchTerms,
  searchTerm,
  agentStatusList,
  // tableHeight,
  selectedAgentStatus,
  setSelectedAgentStatus,
  setSelectedDate,
  selectedDate,
  dateOptions,
  onApplyFilters,
  handleItemAction,
  // styling props
  tableStyle = "",
  headerStyle = "",
  rowStyle = "",
  cellStyle = "",
  paginationStyle = "",
  containerStyle = "",
}) => {
  // State management
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState({ field: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const onboardingStatusOptions = agentStatusList?.data
    ?.filter((status) => status.category === "ONBOARDING")
    .map((status) => ({
      label: status.name, // Shown in dropdown
      name: status.code, // Used as value
    }));

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Apply filtering, sorting, and pagination
  useEffect(() => {
    let result = [...data];

    // Apply filters
    Object.keys(filters).forEach((field) => {
      if (filters[field]) {
        result = result.filter((row) => {
          const value = String(row[field]).toLowerCase();
          return value.includes(String(filters[field]).toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sorting.field) {
      result.sort((a, b) => {
        let valA = a[sorting.field];
        let valB = b[sorting.field];

        // Handle string comparison
        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sorting.direction === "asc" ? -1 : 1;
        if (valA > valB) return sorting.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
  }, [data, filters, sorting]);
  // Calculate pagination info
  const totalPages = Math.ceil(totalRecords / selectedPageSize);
  const startIndex = (currentPage - 1) * selectedPageSize;
  // const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
  const paginatedData = filteredData;

  // Calculate column summaries
  const columnSummaries = useMemo(() => {
    const summary = {};

    columns.forEach((column) => {
      if (column.calculateTotal) {
        summary[column.field] = filteredData.reduce((sum, row) => {
          const value = Number(row[column.field]) || 0;
          return sum + value;
        }, 0);
      }

      if (column.calculateAverage) {
        summary[`${column.field}_avg`] =
          filteredData.length > 0
            ? filteredData.reduce(
                (sum, row) => sum + (Number(row[column.field]) || 0),
                0,
              ) / filteredData.length
            : 0;
      }
    });

    return summary;
  }, [filteredData, columns]);

  // Handle sorting
  const handleSort = (field) => {
    setSorting((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle filtering
  // const handleFilter = (field, value) => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  //   setCurrentPage(1);
  //   setCurrentPageNumber(1);
  // };

  // Handle editing
  const startEditing = (rowId, field, value) => {
    if (!editable) return;
    setEditingCell({ rowId, field });
    setEditValue(value);
  };

  const saveEdit = () => {
    if (!editingCell) return;

    const { rowId, field } = editingCell;
    const newData = data.map((row) =>
      row.id === rowId ? { ...row, [field]: editValue } : row,
    );

    setData(newData);
    onCellUpdate(rowId, field, editValue);
    setEditingCell(null);
  };

  // Handle row operations
  const addRow = () => {
    const newRow = columns.reduce(
      (acc, col) => {
        acc[col.field] = "";
        return acc;
      },
      { id: Date.now() },
    );

    setData([...data, newRow]);
    onRowAdd(newRow);
  };

  const deleteRow = (id) => {
    setData(data.filter((row) => row.id !== id));
    onRowDelete(id);
  };

  // Render functions
  const renderTableHeader = () => (
    <thead className={headerStyle}>
      <tr className="bg-white py-2 text-sm">
        {columns.map((column) => (
          <th
            key={column.field}
            className="border-b border-gray-200 px-3 py-2 text-left font-medium whitespace-nowrap text-gray-400"
          >
            <div
              className="grid cursor-pointer auto-cols-max grid-flow-col items-center"
              onClick={() => handleSort(column.field)}
            >
              {column.header}
              {sorting.field === column.field &&
                (sorting.direction === "asc" ? (
                  <ChevronUpIcon className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-3 w-3" />
                ))}
            </div>
          </th>
        ))}
        {/* {editable && <th className="px-4 py-2 border-b border-gray-200 text-gray-600">Actions</th>} */}
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
      {paginatedData?.length > 0 ? (
        paginatedData.map((row, rowIndex) => (
          <tr key={row.id} className={`hover:bg-gray-100 ${rowStyle}`}>
            {columns.map((column) => {
              const cellValue = row[column.field];
              const isEditing =
                editingCell &&
                editingCell.rowId === row.id &&
                editingCell.field === column.field;
              // Apply conditional formatting
              let cellClass =
                "px-2 py-3 text-indigo-900 font-semibold border-b border-[#E9EDF7] text-txt-md-12 ";
              if (column.conditionalFormat) {
                const formatting = column.conditionalFormat(cellValue, row);
                if (formatting) {
                  cellClass += ` ${formatting}`;
                }
              }
              return (
                <td
                  key={`${row.id}-${column.field}`}
                  className={cellClass + " " + cellStyle}
                  onClick={() =>
                    column.clickable && column.onClick?.(row, column.field)
                  }
                >
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full rounded border px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={saveEdit}
                      onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                      autoFocus
                    />
                  ) : (
                    <div
                      className={`${column.clickable ? "cursor-pointer" : ""} whitespace-nowrap`}
                      onClick={() => handleItemAction(column, row)}
                    >
                      {column.render
                        ? column.render(cellValue, row)
                        : cellValue}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={columns.length} className="py-8 text-center">
            <div className="flex justify-center">
              <Image
                src={noDataImage}
                alt="No Data Available"
                className="h-[120px] w-[108px] rounded-lg bg-cover bg-center sm:h-[150px] sm:w-[135px] md:h-[180px] md:w-[200px]"
                isHoverEnable={false}
              />
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );

  return (
    <>
      {/* Search and filters */}

      <div
        className={`w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm ${containerStyle}`}
      >
        {/* Main table */}
        {/* <div
          className={`scrollbar-thin h-full overflow-x-auto `}
          // style={tableHeight ? { height: tableHeight } : {}}
        > */}
        
          <div className="h-[calc(100vh-200px)] scrollbar-thin overflow-x-auto md:h-[calc(50vh-20px)] lg:h-[calc(55vh-10px)] 2xl:h-auto">
          {/* <div className="overflow-x-auto"> */}
          <table className={`min-w-full !bg-white`}>
            {renderTableHeader()}
            {renderTableBody()}
          </table>
        </div>
        {/* Pagination controls */}
        <div
          className={`grid grid-cols-2 items-center border-t border-gray-200 bg-white p-4 ${paginationStyle}`}
        >
          <div className="grid auto-cols-min grid-flow-col items-center gap-1">
            <button
              className="grid h-6 w-6 cursor-pointer place-items-center rounded border text-xs"
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                setCurrentPageNumber((prev) => Math.max(prev - 1, 1));
              }}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-3 w-3" />
            </button>

            {[1, 2, 3, 4, 5, 6, 7]
              .slice(0, Math.min(7, totalPages))
              .map((page) => (
                <button
                  key={page}
                  className={`grid h-6 w-6 cursor-pointer place-items-center rounded-sm text-xs ${currentPageNumber === page ? "bg-primary-theme-1 text-white" : "border text-gray-700"}`}
                  onClick={() => {
                    setCurrentPage(page);
                    setCurrentPageNumber(page);
                  }}
                >
                  {page}
                </button>
              ))}

            {totalPages > 7 && (
              <>
                <span className="text-gray-700">...</span>
                <button
                  className={`grid h-6 w-6 cursor-pointer place-items-center rounded-sm border text-xs`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              className="grid h-6 w-6 cursor-pointer place-items-center rounded border text-xs"
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                setCurrentPageNumber((prev) => Math.min(prev + 1, totalPages));
              }}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-3 w-3" />
            </button>
          </div>

          <div className="grid auto-cols-max grid-flow-col items-center gap-2 justify-self-end text-sm">
            <span className="hidden sm:flex">Show</span>
            <div className="relative">
              <select
                className="appearance-none rounded border border-gray-300 bg-white py-1 pr-6 pl-2 text-sm focus:outline-none"
                value={selectedPageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setSelectedPageSize(Number(e.target.value));
                  // setPageSizePagination(Number(e.target.value))
                  setCurrentPage(1);
                  setCurrentPageNumber(1);
                }}
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {/* <ChevronDownIcon className="absolute right-1.5 top-1.5 h-3 w-3 text-gray-400 pointer-events-none" /> */}
            </div>
            <span className="hidden sm:flex">per page</span>
          </div>
        </div>
      </div>

      {/* {selectedAgent && (
        // <AgentDetails
        //   selectedAgent={selectedAgent}
        //   setSelectedAgent={setSelectedAgent}
        // />
        // <Profile selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent} />
      )} */}
    </>
  );
};

export default DataTable;
