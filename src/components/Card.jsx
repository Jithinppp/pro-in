import React from "react";
import { Link } from "react-router-dom";

function Card({ item, basePath = "/equipment" }) {
  return (
    <Link
      to={`${basePath}/${item.id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300  transition-all duration-200 cursor-pointer"
    >
      <h3 className="font-bold text-lg tracking-tight">{item.brand}</h3>
      <p className="text-gray-500 text-sm">{item.model}</p>
      <p className="text-gray-500 text-sm">
        Quantity -{" "}
        <span className="font-semibold text-gray-800 text-lg">
          {item.quantity}
        </span>
      </p>
      <p className="text-gray-600 text-sm">{item.category?.name}</p>
    </Link>
  );
}

export default Card;
