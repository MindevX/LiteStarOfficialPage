import React from "react";
import rawVoucherData from "../data/voucher.json";

const Voucher: React.FC = () => {
  const jsonText = JSON.stringify(rawVoucherData, null, 2);

  return (
    <pre>
      {jsonText}
    </pre>
  );
};

export default Voucher;