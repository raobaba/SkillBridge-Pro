import React from 'react';
import { Target } from 'lucide-react';

/**
 * Reusable Filter Summary component to display active filters
 * @param {Object} props
 * @param {Object} props.filters - Object containing all filter values
 * @param {Object} props.options - Object containing all filter options
 */
const FilterSummary = ({ filters, options }) => {
  const {
    selectedStatus,
    selectedPriority,
    selectedLocation,
    selectedCategory,
    selectedExperienceLevel,
    budgetMin,
    budgetMax,
    isRemoteOnly
  } = filters;

  const {
    statusOptions,
    priorityOptions,
    locationOptions,
    categoryOptions,
    experienceOptions
  } = options;

  const hasActiveFilters = 
    selectedStatus !== "all" ||
    selectedPriority !== "all" ||
    selectedLocation !== "all" ||
    selectedCategory !== "all" ||
    selectedExperienceLevel !== "all" ||
    budgetMin !== "" ||
    budgetMax !== "" ||
    isRemoteOnly;

  return (
    <div className='space-y-2'>
      <label className='block text-sm font-medium text-gray-300 flex items-center gap-2'>
        <Target className='w-4 h-4 text-purple-400' />
        Active Filters
      </label>
      <div className='bg-white/10 border border-white/20 rounded-lg p-4'>
        <div className='text-xs text-gray-400 space-y-2'>
          {selectedStatus !== "all" && (
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 bg-blue-400 rounded-full'></span>
              Status: {statusOptions.find(s => s.value === selectedStatus)?.label}
            </div>
          )}
          {selectedPriority !== "all" && (
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 bg-orange-400 rounded-full'></span>
              Priority: {priorityOptions.find(p => p.value === selectedPriority)?.label}
            </div>
          )}
          {selectedLocation !== "all" && (
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 bg-green-400 rounded-full'></span>
              Location: {locationOptions.find(l => l.value === selectedLocation)?.label}
            </div>
          )}
          {selectedCategory !== "all" && (
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 bg-purple-400 rounded-full'></span>
              Category: {categoryOptions.find(c => c.value === selectedCategory)?.label}
            </div>
          )}
          {selectedExperienceLevel !== "all" && (
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 bg-cyan-400 rounded-full'></span>
              Experience: {experienceOptions.find(e => e.value === selectedExperienceLevel)?.label}
            </div>
          )}
          {budgetMin !== "" && (
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 bg-green-400 rounded-full'></span>
              Min Budget: ${budgetMin}
            </div>
          )}
          {budgetMax !== "" && (
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 bg-green-400 rounded-full'></span>
              Max Budget: ${budgetMax}
            </div>
          )}
          {isRemoteOnly && (
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 bg-blue-400 rounded-full'></span>
              Remote Only
            </div>
          )}
          {!hasActiveFilters && (
            <div className='text-gray-500'>No filters applied</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSummary;
