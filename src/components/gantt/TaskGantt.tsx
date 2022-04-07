import React, { useMemo, useRef } from "react";
import { GridProps, Grid } from "../grid/Grid";
import { CalendarProps, Calendar } from "../calendar/Calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./TaskGanttContent";
import styles from "./gantt.module.css";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  ChildrenDom: React.ReactChild;
  themeConfig: any;
  lineId: string;
  listCellWidth?: string;
  verticalGanttContainerRef: any;
  horizontalContainerRef: any;
  ganttFullHeight: number;
  svgWidth: number;
  taskListRef: any;
  scrollRight: { left: number; top: number };
  setSDate: any;
};
export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  ChildrenDom,
  themeConfig,
  lineId,
  listCellWidth,
  verticalGanttContainerRef,
  horizontalContainerRef,
  scrollRight,
  setSDate,
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };
  const newGridProps = {
    ...gridProps,
    ganttHeight,
    lineId,
    verticalGanttContainerRef,
  };

  const verticalGanttContainerHeight = useMemo(() => {
    if (verticalGanttContainerRef && verticalGanttContainerRef?.current) {
      return (
        verticalGanttContainerRef?.current?.getBoundingClientRect().height - 76
      );
    } else {
      return ganttHeight - 76;
    }
  }, [
    verticalGanttContainerRef,
    verticalGanttContainerRef.current,
    ganttHeight,
  ]);

  const svgHeight =
    barProps.rowHeight * barProps.tasks.length > verticalGanttContainerHeight
      ? barProps.rowHeight * barProps.tasks.length
      : verticalGanttContainerHeight;

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
        style={{
          boxSizing: "content-box",
          position: "sticky",
          top: 0,
          left: 0,
          backgroundColor: "var(--gantt-header-background)",
        }}
      >
        <Calendar
          {...calendarProps}
          scrollRight={scrollRight}
          setSDate={setSDate}
        />
      </svg>
      <div
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={{
          width: gridProps.svgWidth,
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
