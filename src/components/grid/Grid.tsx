import React from "react";
import { GridBody, GridBodyProps } from "./GridBody";

export type GridProps = GridBodyProps;
export const Grid: React.FC<GridProps> = props => {
  return (
    <g className="grid">
      <GridBody {...props} />
    </g>
  );
};
