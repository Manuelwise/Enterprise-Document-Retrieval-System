
import React from 'react';
import { Search } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

const SearchAndFilter = ({ 
  searchTerm, 
  onSearchChange, 
  onDateRangeSelect 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <DateRangePicker 
        onSelect={onDateRangeSelect}
        className="z-10 w-full sm:w-auto"
      />
    </div>
  );
};

export default SearchAndFilter;