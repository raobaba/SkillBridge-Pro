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
  DataButton,
  Dropdown,
  ScrollBar,
  SearchInput,
} from "../../ui-controls";
import AgentDetails from "../../modules/admin-dashboard/component/AgentDetails";

const DataTable = ({
  initialData = [],
  columns = [],
  defaultPageSize = 10,
  editable = true,
  onRowAdd = () => {},
  onRowDelete = (id) => {},
  onCellUpdate = (rowId, field, value) => {},
  setSearchTerm,
  // setPageSizePagination,
  totalRecords=0,
  setSelectedPageSize,
  setCurrentPageNumber,
  handleExportCsv
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
  const [selectedAgent, setSelectedAgent] = useState(null);

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
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
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
  const handleFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1);
    setCurrentPageNumber(1)
  };

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
    <thead>
      <tr className="bg-white py-2 text-xs uppercase">
        {columns.map((column) => (
          <th
            key={column.field}
            className="border-b border-gray-200 px-4 py-2 text-left font-medium whitespace-nowrap text-gray-400"
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
      {paginatedData.map((row, rowIndex) => (
        <tr key={row.id} className={`hover:bg-gray-100`}>
          {columns.map((column) => {
            const cellValue = row[column.field];
            const isEditing =
              editingCell &&
              editingCell.rowId === row.id &&
              editingCell.field === column.field;

            // Apply conditional formatting
            let cellClass =
              "px-4 py-3 text-indigo-900 font-semibold border-b border-[#E9EDF7] text-txt-md-12 ";
            if (column.conditionalFormat) {
              const formatting = column.conditionalFormat(cellValue, row);
              if (formatting) {
                cellClass += ` ${formatting}`;
              }
            }

            return (
              <td
                key={`${row.id}-${column.field}`}
                className={cellClass}
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
                    onClick={() => {
                      if (column.field === "name") {
                        setSelectedAgent(row);
                      } else if (column.field === "status") {
                        
                      }
                    }}
                    onDoubleClick={() =>
                      startEditing(row.id, column.field, cellValue)
                    }
                  >
                    {column.render ? column.render(cellValue, row) : cellValue}
                  </div>
                )}
              </td>
            );
          })}

          {/* {editable && (
                        <td className="px-4 py-2 border-b border-gray-200">
                            <div className="grid grid-flow-col auto-cols-min gap-2">
                                <button
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    onClick={() => deleteRow(row.id)}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    )} */}
        </tr>
      ))}
    </tbody>
  );

  return (
    <>
      {/* Search and filters */}
      <div className="grid-cols-auto mb-3 grid">
        <div className="grid w-full grid-cols-1 gap-4 md:flex md:items-start md:gap-4">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <SearchInput
              placeholder="Search for name, email, product, insured name"
              onChange={(value) => {
                // const newFilters = {};
                // columns.forEach((col) => {
                //   newFilters[col.field] = value;
                // });
                // setFilters(newFilters);
                setSearchTerm(value);
              }}
              inputStyle="w-full !h-9 !rounded-lg border pl-8 py-1 text-sm placeholder:text-[#707EAE] placeholder:text-txt-md-13"
              isDisabled={false}
              iconStyle="text-gray-400 icon-Search"
              isLeft={true}
            />
          </div>

          {/* Dropdowns */}
          <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:gap-4 [@media(max-width:470px)]:grid-cols-1">
            <div className="relative w-full md:w-30">
              <Dropdown
                id="dropdown"
                name="agentStatus"
                placeholder="Agent Status"
                optionLabel="label"
                optionValue="name"
                dropdownStyle="dropdown w-full"
                menuStyle="menu"
                mainStyle="bg-white text-primary-theme-1 !rounded-lg"
                itemStyle="text-primary-theme-1 font-[450]"
              />
            </div>
            <div className="relative w-full md:w-30">
              <Dropdown
                id="dropdown"
                name="amlStatus"
                placeholder="AML Status"
                optionLabel="label"
                optionValue="name"
                dropdownStyle="dropdown w-full"
                menuStyle="menu"
                mainStyle="bg-white text-primary-theme-1 !rounded-lg"
                itemStyle="text-primary-theme-1 font-[450]"
              />
            </div>
            <div className="relative w-full md:w-30">
              <Dropdown
                id="dropdown"
                name="eandoStatus"
                placeholder="E&O Status"
                optionLabel="label"
                optionValue="name"
                dropdownStyle="dropdown w-full"
                menuStyle="menu"
                mainStyle="bg-white text-primary-theme-1 !rounded-lg"
                itemStyle="text-primary-theme-1 font-[450]"
              />
            </div>
            <div className="relative w-full md:w-30">
              <Dropdown
                id="dropdown"
                name="licenseStatus"
                placeholder="License Status"
                optionLabel="label"
                optionValue="name"
                dropdownStyle="dropdown w-full"
                menuStyle="menu"
                mainStyle="bg-white text-primary-theme-1 !rounded-lg"
                itemStyle="text-primary-theme-1 font-[450]"
              />
            </div>

            <div className="relative w-full md:w-30">
              <DataButton
                size={"md"}
                name={"Export CSV"}
                icon={"icon-downloads"}
                icSize={"md"}
                icPosition={"left"}
                isDisabled={false}
                isHoverEnable={false}
                onClick={handleExportCsv}
                btnStyle={
                  "w-full bg-white border text-primary-theme-1 pt-[2px] !rounded-lg !h-[35.33px]"
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        {/* Main table */}
        <ScrollBar
          maxHeight={`calc(100dvh)`}
          maxWidth={`100%`}
          horizontal={"scroll"}
          verticle={"hidden"}
        >
          <div className="">
            <table className="min-w-full !bg-white">
              {renderTableHeader()}
              {renderTableBody()}
            </table>
          </div>
        </ScrollBar>

        {/* Pagination controls */}
        <div className="grid grid-cols-2 items-center border-t border-gray-200 bg-white p-4">
          <div className="grid auto-cols-min grid-flow-col items-center gap-1">
            <button
              className="grid h-6 w-6 cursor-pointer place-items-center rounded border text-xs"
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1))
                setCurrentPageNumber((prev) => Math.max(prev-1, 1))
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
                  className={`grid h-6 w-6 cursor-pointer place-items-center rounded-sm text-xs ${currentPage === page ? "bg-primary-theme-1 text-white" : "border text-gray-700"}`}
                  onClick={() => {
                    setCurrentPage(page)
                    setCurrentPageNumber(page)
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
              onClick={() =>{
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                setCurrentPageNumber((prev) => Math.min(prev + 1, totalPages))
              }}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-3 w-3" />
            </button>
          </div>

          <div className="grid auto-cols-max grid-flow-col items-center gap-2 justify-self-end text-sm">
            <span>Show</span>
            <div className="relative">
              <select
                className="appearance-none rounded border border-gray-300 bg-white py-1 pr-6 pl-2 text-sm focus:outline-none"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setSelectedPageSize(Number(e.target.value))
                  // setPageSizePagination(Number(e.target.value))
                  setCurrentPage(1);
                  setCurrentPageNumber(1)
                }}
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {/* <ChevronDownIcon className="absolute right-1.5 top-1.5 h-3 w-3 text-gray-400 pointer-events-none" /> */}
            </div>
            <span>per page</span>
          </div>
        </div>
      </div>

      {selectedAgent && (
        <AgentDetails
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
        />
      )}
    </>
  );
};

export default DataTable;
