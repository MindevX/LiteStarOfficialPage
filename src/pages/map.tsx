import React from "react";
import rawNewsData from "../data/MapRotation.json";

const Map: React.FC = () => {
  const jsonText = JSON.stringify(rawNewsData, null, 2);

  return (
    <pre>{jsonText}</pre>
  );
};

export default Map;