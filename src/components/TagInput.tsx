'use client';

import { useState } from 'react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export default function TagInput({
  tags,
  onTagsChange,
  placeholder = 'Add a tag and press Enter',
  label,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setError('Tag cannot be empty');
      return;
    }

    if (trimmedValue.length > 30) {
      setError('Tag must be 30 characters or less');
      return;
    }

    if (tags.includes(trimmedValue)) {
      setError('This tag already exists');
      return;
    }

    if (tags.length >= 10) {
      setError('Maximum 10 tags allowed');
      return;
    }

    onTagsChange([...tags, trimmedValue]);
    setInputValue('');
    setError('');
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="space-y-2">
        {/* Tags Display */}
        <div className="flex flex-wrap gap-2 min-h-10">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 group"
            >
              <span>{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-blue-600 hover:text-blue-900 font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove tag"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        {!disabled && (
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-1 text-xs text-gray-500">
              Press Enter or comma to add a tag • Click ✕ to remove
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Tag Count */}
        <p className="text-xs text-gray-500">
          {tags.length}/10 tags
        </p>
      </div>
    </div>
  );
}
