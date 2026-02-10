import React from "react";
import DNASvg from "../../assets/icon/DNA.svg";

const DNAIcon = ({ style = {}, ...props }) => {
  return (
    <img
      src={DNASvg}
      alt="DNA"
      style={{
        width: "20px",
        height: "20px",
        display: "inline-block",
        verticalAlign: "middle",
        ...style,
      }}
      {...props}
    />
  );
};

export default DNAIcon;
