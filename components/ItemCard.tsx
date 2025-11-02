import React from 'react';
import { Item } from '../types';
interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<{ item: Item; isAdmin: boolean }> = ({ item, isAdmin }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{item.category}</p>
        <a
          href={`/item/${item.id}`}
          className="mt-auto w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
        >
          פרטים והזמנה
        </a>
      </div>
    </div>
  );
};

export default ItemCard;