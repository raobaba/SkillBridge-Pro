import React, { useState, createContext, useContext } from "react";
import { List, ChevronDown } from "lucide-react";

const SelectContext = createContext();

function Select({ children, value, onValueChange }) {
  const [open, setOpen] = useState(false);
  const handleSelect = (val) => { onValueChange(val); setOpen(false); };
  return <SelectContext.Provider value={{ value, onSelect: handleSelect, open, setOpen }}>
    <div className="relative inline-block">{children}</div>
  </SelectContext.Provider>;
}

function SelectTrigger({ children, className }) {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <button type="button" className={`flex justify-between items-center px-3 py-2 bg-black/20 rounded-xl border border-white/20 text-white cursor-pointer ${className}`} onClick={() => setOpen(!open)}>
      {children} <ChevronDown className="w-4 h-4 ml-2" />
    </button>
  );
}

function SelectContent({ children, className }) {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  return <div className={`absolute z-50 mt-1 w-full bg-black/90 rounded-xl border border-white/20 shadow-lg ${className}`}>{children}</div>;
}

function SelectItem({ value, children, className }) {
  const { onSelect, value: selectedValue } = useContext(SelectContext);
  const isSelected = selectedValue === value;
  return (
    <div className={`px-3 py-2 cursor-pointer hover:bg-white/10 ${isSelected ? "bg-white/20 font-semibold" : ""} ${className}`} onClick={() => onSelect(value)}>
      {children}
    </div>
  );
}

export default function SortDropdown({ sortOption, setSortOption }) {
  const options = [
    { label: "Relevance", value: "relevance" },
    { label: "Highest Match", value: "highest" },
    { label: "Lowest Match", value: "lowest" },
    { label: "Experience", value: "experience" },
    { label: "Availability", value: "availability" },
    { label: "Location A-Z", value: "locationAsc" },
    { label: "Location Z-A", value: "locationDesc" },
  ];

  return (
    <Select value={sortOption} onValueChange={setSortOption}>
      <SelectTrigger className="w-48 flex items-center justify-between">
        <span className="flex items-center gap-2"><List className="w-4 h-4" /> Sort</span>
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
