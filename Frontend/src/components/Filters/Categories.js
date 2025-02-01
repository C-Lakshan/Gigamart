import React from 'react';

const Categories = ({ types, selectedTypes, setSelectedTypes }) => {
  // Handle checkbox change events
  const handleCategoryChange = (event) => {
    const { name, checked } = event.target;
    setSelectedTypes((prev) =>
      checked ? [...prev, name] : prev.filter((type) => type !== name)
    );
  };

  return (
    <div>
      {types?.map((type) => (
        <div key={type?.code} className="flex items-center p-1">
          <input
            type="checkbox"
            name={type?.code}
            className="border rounded-xl w-4 h-4 accent-black text-black"
            checked={selectedTypes.includes(type?.code)}
            onChange={handleCategoryChange}
          />
          <label htmlFor={type?.code} className="px-2 text-[14px] text-gray-600">
            {type?.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Categories;
