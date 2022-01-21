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
  ChildrenDom: React.ReactChild;
  themeConfig: any;
  lineId: string;
  listCellWidth?: string;
  verticalGanttContainerRef: any;
  ganttFullHeight: number;
  svgWidth: number;
  taskListRef: any;
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
  ganttFullHeight,
  svgWidth,
  taskListRef,
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  // const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };
  const newGridProps = { ...gridProps, ganttHeight, lineId };

  // scroll events
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const horiRects = horizontalContainerRef.current?.getBoundingClientRect() || {
        height: 0,
        bottom: 0,
      };
      // const vertiWidth = verticalGanttContainerRef.current?.offsetWidth;
      console.log("123 horiRects", horiRects);
      // console.log("123 111", vertiWidth + 443 + 10);
      // console.log("123 ", horizontalContainerRef.current?.offsetWidth);

      if (event.shiftKey || event.deltaX) {
        // console.log("123 deltaX", event.deltaX);

        const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
        let newScrollX = scrollX + scrollMove;
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }
      } else {
        const calcHeight = horiRects?.height || 0 - horiRects?.bottom || 0;
        taskListRef.current.scrollTop = calcHeight;
        console.log("123 deltaY", calcHeight);

        let newScrollY = event.deltaY;
        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight;
        }
      }
    };
    // subscribe if scroll is necessary
    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }
    return () => {
      if (verticalGanttContainerRef.current) {
        verticalGanttContainerRef.current.removeEventListener(
          "wheel",
          handleWheel
        );
      }
    };
  }, [verticalGanttContainerRef, ganttHeight, svgWidth]);

  // const scroll = useScroll(verticalGanttContainerRef.current);

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
        style={{
          boxSizing: "content-box",
          position: "sticky",
          top: 0,
          left: 0,
        }}
      >
        <Calendar {...calendarProps} />
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
