import React from "react";
import { getProgressPoint } from "../../../helpers/BarHelper";
import { BarDisplay } from "./BarDisplay";
import { BarDateHandle } from "./BarDateHandle";
import { BarProgressHandle } from "./BarProgressHandle";
import { TaskItemProps } from "../TaskItem";
import styles from "./bar.module.css";

export const Bar: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  rtl,
  onEventStart,
  onTouchEvent,
  isSelected,
}) => {
  const progressPoint = getProgressPoint(
    +!rtl * task.progressWidth + task.progressX,
    task.y,
    task.height
  );
  const handleHeight = task.height - 2;

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
        {isDateChangeable && (
          <g>
            {/* left */}
            <BarDateHandle
              x={task.x1 + 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("start", task, e);
              }}
              onTouchStart={e => {
                onTouchEvent("left", task, e);
              }}
              onTouchEnd={e => {
                onTouchEvent("end", task, e);
              }}
              onTouchMove={e => {
                onTouchEvent("move", task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2 - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("end", task, e);
              }}
              onTouchStart={e => {
                onTouchEvent("right", task, e);
              }}
              onTouchEnd={e => {
                e.preventDefault();
                e.stopPropagation();
                onTouchEvent("end", task, e);
              }}
              onTouchMove={e => {
                e.preventDefault();
                e.stopPropagation();
                onTouchEvent("move", task, e);
              }}
            />
          </g>
        )}
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
