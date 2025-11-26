import React from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Plus, Search } from 'lucide-react';

interface ListHeaderProps {
  title: string;
  onAddClick: () => void;
  onSearch: (query: string) => void;
  searchPlaceholder?: string;
}

export const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  onAddClick,
  onSearch,
  searchPlaceholder = 'Search...',
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <Button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>
    </div>
  );
};
