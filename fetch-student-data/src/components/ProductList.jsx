import React from "react";
import "./ProductList.css";

const ProductList = ({ items, type }) => {
  return (
    <div className="list-container">
      {items.map((item, index) => (
        <p key={item.id}>
          {index + 1}. {type === "products" && item.productName}
          {type === "customers" && item.fullName}
          {type === "policies" && item.policyNumber}
        </p>
      ))}
    </div>
  );
};

export default ProductList;
