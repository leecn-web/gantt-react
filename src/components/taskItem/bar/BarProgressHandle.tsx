import React from "react";
import styles from "./bar.module.css";

type BarProgressHandleProps = {
  progressPoint: string;
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  onTouchStart: (event: React.TouchEvent<SVGPolygonElement>) => void;
};
export const BarProgressHandle: React.FC<BarProgressHandleProps> = ({
  progressPoint,
  onMouseDown,
  onTouchStart,
}) => {
  return (
    <polygon
      className={styles.barHandle}
      style={{
        fill: "#fff",
        stroke: "var(--primary-color)",
        strokeWidth: 1,
      }}
      points={progressPoint}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    />
  );
};
