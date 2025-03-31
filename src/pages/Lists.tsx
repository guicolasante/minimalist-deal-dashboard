
  const handleFilterChange = (name: keyof FilterState, value: string | number | null) => {
    // If value is "all", set it to null to clear the filter
    const finalValue = value === 'all' ? null : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };
