import React from "react";
import rawNewsData from "../data/news.json";

const News: React.FC = () => {
  const jsonText = JSON.stringify(rawNewsData, null, 2);

  return (
    <pre>{jsonText}</pre>
  );
};

export default News;