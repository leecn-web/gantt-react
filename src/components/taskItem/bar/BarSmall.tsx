import React from "react";
import { getProgressPoint } from "../../../helpers/BarHelper";
import { BarDisplay } from "./BarDisplay";
import { BarProgressHandle } from "./BarProgressHandle";
import { TaskItemProps } from "../TaskItem";
import styles from "./bar.module.css";

export const BarSmall: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  onTouchEvent,
  isSelected,
}) => {
  const progressPoint = getProgressPoint(
    task.progressWidth + task.x1,
    task.y,
    task.height
  );
  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
        onTouchStart={e => {
          isDateChangeable && onTouchEvent("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
            onTouchStart={e => {
              onTouchEvent("progress", task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
