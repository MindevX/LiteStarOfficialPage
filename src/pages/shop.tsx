import React from "react";
import rawShopData from "../data/Shop.json";

const Shop: React.FC = () => {
  const jsonText = JSON.stringify(rawShopData, null, 2);

  return (
    <pre>
      {jsonText}
    </pre>
  );
};

export default Shop;