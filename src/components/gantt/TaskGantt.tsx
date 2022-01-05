import React, { useRef, useEffect } from "react";
import { GridProps, Grid } from "../grid/Grid";
import { CalendarProps, Calendar } from "../calendar/Calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./TaskGanttContent";
import styles from "./gantt.module.css";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
  ChildrenDom: React.ReactChild;
  themeConfig: any;
  lineId: string;
  listCellWidth?: string;
};
export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX,
  ChildrenDom,
  themeConfig,
  lineId,
  listCellWidth,
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };
  const newGridProps = { ...gridProps, ganttHeight, lineId };

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  const svgHeight =
    barProps.rowHeight * barProps.tasks.length > ganttHeight
      ? barProps.rowHeight * barProps.tasks.length
      : ganttHeight;

  return (
    <div
      className={styles.ganttVerticalContainer}
      style={{
        borderColor: themeConfig.tableBorderColor,
        borderWidth: listCellWidth ? `1px` : `0px`,
      }}
      ref={verticalGanttContainerRef}
      dir="ltr"
    >
      <div>{ChildrenDom}</div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={gridProps.svgWidth}
        height={calendarProps.headerHeight + 1}
        fontFamily={barProps.fontFamily}
        // style={{ height: "90px", paddingTop: "40px" }}
        // style={{ paddingTop: "40px", boxSizing: "content-box" }}
        style={{ boxSizing: "content-box" }}
      >
        <Calendar {...calendarProps} />
      </svg>
      <div
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={{
          width: gridProps.svgWidth,
          height: ganttHeight && ganttHeight,
          maxHeight: ganttHeight && ganttHeight,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={svgHeight}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...newGridProps} />
          <TaskGanttContent {...newBarProps} />
        </svg>
      </div>
    </div>
  );
};
