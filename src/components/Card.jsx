import React from "react";
import { Link } from "react-router-dom";

function Card({ item }) {
  console.log(item);
  return (
    <Link to={`/equipment`} className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-bold text-lg tracking-tight">{item.sub_category}</h3>
      <p className="text-gray-500 text-sm">
        Quantity -{" "}
        <span className="font-semibold text-gray-800 text-lg">
          {item.equipment_items?.length}
        </span>
      </p>
      <p>
        {item.category} | {item.sub_category}
      </p>
      <p className="text-gray-700 text-sm">{item.product_desc}</p>
    </Link>
  );
}

export default Card;
