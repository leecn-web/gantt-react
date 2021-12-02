import React from "react";
import style from "./bar.module.css";

type BarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  /* progress start point */
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  onTouchStart: (event: React.TouchEvent<SVGPolygonElement>) => void;
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  // isSelected,
  progressX,
  progressWidth,
  barCornerRadius,
  // styles,
  onMouseDown,
  onTouchStart,
}) => {
  const getProcessColor = () => {
    return "#3D54FD";
    // return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return "#3D54FD";
    // return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };
  let pWidth = progressWidth;
  if (pWidth > width) pWidth = width;
  else if (pWidth < 0) pWidth = 0;
  return (
    <g onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        className={style.barBackground}
      />
      <rect
        x={progressX}
        width={pWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getProcessColor()}
      />
    </g>
  );
};
