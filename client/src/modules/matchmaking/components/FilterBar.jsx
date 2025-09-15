import React, { useState, useEffect, createContext, useContext } from "react";
import { Search, XCircle, Filter, ChevronDown } from "lucide-react";
import { Button, Input } from "../../../components";

const SelectContext = createContext();

function Select({ children, value, onValueChange }) {
  const [open, setOpen] = useState(false);
  const handleSelect = (val) => {
    onValueChange(val);
    setOpen(false);
  };
  return (
    <SelectContext.Provider value={{ value, onSelect: handleSelect, open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ children, className }) {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      className={`flex justify-between items-center px-3 py-2 bg-black/20 rounded-xl border border-white/20 text-white cursor-pointer w-full ${className}`}
      onClick={() => setOpen(!open)}
    >
      {children} <ChevronDown className="w-4 h-4 ml-2" />
    </button>
  );
}

function SelectContent({ children, className }) {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  return (
    <div
      className={`absolute z-50 mt-1 w-full bg-black/90 rounded-xl border border-white/20 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

function SelectItem({ value, children, className }) {
  const { onSelect, value: selectedValue } = useContext(SelectContext);
  const isSelected = selectedValue === value;
  return (
    <div
      className={`px-3 py-2 cursor-pointer hover:bg-white/10 ${
        isSelected ? "bg-white/20 font-semibold" : ""
      } ${className}`}
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
}

export default function FilterBar({ filters, setFilters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [availability, setAvailability] = useState(filters.availability || "");
  const [location, setLocation] = useState(filters.location || "");

  useEffect(() => {
    const handler = setTimeout(() => setFilters({ ...filters, search }), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleApplyFilters = () => setFilters({ ...filters, search, availability, location });
  const handleResetFilters = () => {
    setSearch("");
    setAvailability("");
    setLocation("");
    setFilters({ search: "", availability: "", location: "" });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 flex-wrap">
      {/* Search Input + Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <Input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleApplyFilters} className="flex items-center gap-2">
            <Search className="w-4 h-4" /> Search
          </Button>
          <Button onClick={handleResetFilters} variant="destructive" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Reset
          </Button>
        </div>
      </div>

      {/* Filters: Availability + Location + Filter Button */}
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger className="w-full sm:w-40">{availability || "Availability"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="Full-Time">Full-Time</SelectItem>
            <SelectItem value="Part-Time">Part-Time</SelectItem>
            <SelectItem value="Freelance">Freelance</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full sm:w-40"
        />

        <Button className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>
    </div>
  );
}
