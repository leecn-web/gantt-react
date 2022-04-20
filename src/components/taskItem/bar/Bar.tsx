import React, { useMemo } from "react";
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
  isSelected,
  hiddenPercent,
  onEventStart,
  onTouchEvent,
}) => {
  let progressWidth = task.progressWidth;
  if (task.progressWidth > task.x2 - task.x1) progressWidth = task.x2 - task.x1;
  else if (task.progressWidth < 0) progressWidth = 0;
  const progressPoint = getProgressPoint(
    +!rtl * progressWidth + task.progressX,
    task.y,
    task.height
  );
  const handleHeight = task.height - 2;

  const barWidth = useMemo(() => {
    return task.x2 - task.x1 > 18 ? task.x2 - task.x1 : 18;
  }, [task]);
  const isMinWidth = useMemo(() => {
    return task.x2 - task.x1 < 18;
  }, [task]);

  return (
    <g
      className={styles.barWrapper}
      onDoubleClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onEventStart("dblclick", task, e);
      }}
    >
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={barWidth}
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
              x={
                isMinWidth
                  ? task.x1 + barWidth - task.handleWidth - 1
                  : task.x2 - task.handleWidth - 1
              }
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
                e.stopPropagation();
                onTouchEvent("end", task, e);
              }}
              onTouchMove={e => {
                e.stopPropagation();
                onTouchEvent("move", task, e);
              }}
            />
          </g>
        )}
        {isProgressChangeable && !hiddenPercent && (
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
