import React from "react";
import styles from "./bar.module.css";

type BarDateHandleProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  barCornerRadius: number;
  onMouseDown: (event: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
  onTouchStart: (event: React.TouchEvent<SVGRectElement>) => void;
  onTouchEnd: (event: React.TouchEvent<SVGRectElement>) => void;
  onTouchMove: (event: React.TouchEvent<SVGRectElement>) => void;
};
export const BarDateHandle: React.FC<BarDateHandleProps> = ({
  x,
  y,
  width,
  height,
  barCornerRadius,
  onMouseDown,
  onTouchStart,
  // onTouchEnd,
  // onTouchMove,
}) => {
  return (
    <rect
      x={x ?? 0}
      y={y ? y - 1 : 0}
      width={width}
      height={height}
      className={styles.barHandle}
      ry={barCornerRadius}
      rx={barCornerRadius}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      // onTouchEnd={onTouchEnd}
      // onTouchMove={onTouchMove}
    />
  );
};
