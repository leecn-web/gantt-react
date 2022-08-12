import React, { ReactChild, useMemo, useRef } from "react";
import { GridProps, Grid } from "../grid/Grid";
import { CalendarProps, Calendar } from "../calendar/Calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./TaskGanttContent";
import styles from "./gantt.module.css";
import { ViewMode } from "../../types/PublicTypes";

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
  tasks: any[];
  rowHeight: number;
  degree?: string;
  floatIcon?: JSX.Element;
  setSDate: any;
  viewMode: ViewMode;
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
  tasks,
  rowHeight,
  floatIcon,
  degree,
  setSDate,
  viewMode,
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };
  const newGridProps = {
    ...gridProps,
    ganttHeight,
    lineId,
    verticalGanttContainerRef,
    viewMode,
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

  const handleScroll = (e: any, task: any) => {
    e.stopPropagation();
    if (task?.x1 || task?.x2) {
      verticalGanttContainerRef.current.scrollLeft = task.x1 ?? task.x2;
    }
  };

  const handleScrollRight = (e: any, task: any) => {
    e.stopPropagation();
    if (task?.x1 || task?.x2) {
      verticalGanttContainerRef.current.scrollLeft =
        (task?.x1 ?? 0) -
        verticalGanttContainerRef.current?.offsetWidth +
        (task?.x2 - task?.x1 ? task?.x2 - task?.x1 : 18);
    }
  };

  const floatBar = useMemo(() => {
    const gridRows: ReactChild[] = [];

    for (const task of tasks) {
      let isLeftShow = false;
      let isRightShow = false;

      if (new Date(task?.start).getTime() === new Date(task?.end).getTime()) {
        isLeftShow = false;
      } else if ((scrollRight.left || 0) > (task?.x1 || task?.x2 || 0)) {
        isLeftShow = true;
      }

      const rightDiff =
        (scrollRight.left || 0) +
        (verticalGanttContainerRef.current?.offsetWidth || 0) -
        ((task?.x2 || 0) - (task?.x1 || 0));

      if (new Date(task?.start).getTime() === new Date(task?.end).getTime()) {
        isRightShow = false;
      } else if (rightDiff < (task?.x1 || task?.x2 || 0)) {
        isRightShow = true;
      }

      gridRows.push(
        <div
          className={styles.barScrollFloatItem}
          style={{ height: rowHeight }}
        >
          <div
            className={styles.barScrollFloatItemLeft}
            style={{
              display: isLeftShow ? "flex" : "none",
            }}
            onClick={e => handleScroll(e, task)}
          >
            {floatIcon ?? ""}
          </div>
          <div
            className={styles.barScrollFloatItemRight}
            style={{
              display: isRightShow ? "flex" : "none",
            }}
            onClick={e => handleScrollRight(e, task)}
          >
            {floatIcon ?? ""}
          </div>
        </div>
      );
    }

    return gridRows;
  }, [tasks, scrollRight]);

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
      {ChildrenDom}
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
          zIndex: 1,
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
          pointerEvents: "none",
        }}
      >
        <div
          className={styles.barScrollFloat}
          style={{
            width: verticalGanttContainerRef.current
              ? verticalGanttContainerRef.current.offsetWidth
              : "100%",
            height: horizontalContainerRef.current
              ? horizontalContainerRef.current.scrollHeight
              : "100%",
            transform: `translateY(-${scrollRight.top ?? 0}px)`,
            display: degree === "90" ? "none" : "block",
          }}
        >
          {floatBar}
        </div>
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
