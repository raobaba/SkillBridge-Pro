import { useMemo } from 'react';

/**
 * Custom hook to generate filter options from API data
 * @param {Object} filterOptions - The filter options from API
 * @returns {Object} Object containing all filter option arrays
 */
export const useFilterOptions = (filterOptions) => {
  const statusOptions = useMemo(() => 
    filterOptions?.statuses?.length
      ? [
          { value: "all", label: "All Status" },
          ...filterOptions.statuses.map((s) => ({
            value: s.value,
            label: s.label,
          })),
        ]
      : [{ value: "all", label: "All Status" }],
    [filterOptions?.statuses]
  );

  const priorityOptions = useMemo(() =>
    filterOptions?.priorities?.length
      ? [
          { value: "all", label: "All Priority" },
          ...filterOptions.priorities.map((p) => ({
            value: p.value,
            label: p.label,
          })),
        ]
      : [{ value: "all", label: "All Priority" }],
    [filterOptions?.priorities]
  );

  const sortOptions = useMemo(() => 
    filterOptions?.sortOptions?.length
      ? filterOptions.sortOptions
      : [{ value: "relevance", label: "Most Relevant" }],
    [filterOptions?.sortOptions]
  );

  const locationOptions = useMemo(() => 
    filterOptions?.locations?.length
      ? [
          { value: "all", label: "All Locations" },
          ...filterOptions.locations.map((l) => ({
            value: l.value,
            label: l.label,
          })),
        ]
      : [{ value: "all", label: "All Locations" }],
    [filterOptions?.locations]
  );

  const categoryOptions = useMemo(() => 
    filterOptions?.categories?.length
      ? [
          { value: "all", label: "All Categories" },
          ...filterOptions.categories.map((c) => ({
            value: c,
            label: c,
          })),
        ]
      : [{ value: "all", label: "All Categories" }],
    [filterOptions?.categories]
  );

  const experienceOptions = useMemo(() => 
    filterOptions?.experienceLevels?.length
      ? [
          { value: "all", label: "All Experience Levels" },
          ...filterOptions.experienceLevels.map((e) => ({
            value: e.value,
            label: e.label,
          })),
        ]
      : [{ value: "all", label: "All Experience Levels" }],
    [filterOptions?.experienceLevels]
  );

  return {
    statusOptions,
    priorityOptions,
    sortOptions,
    locationOptions,
    categoryOptions,
    experienceOptions,
  };
};
