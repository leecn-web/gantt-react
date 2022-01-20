import React, { ReactChild } from "react";
import { Task } from "../../types/PublicTypes";
import { BarTask } from "../../types/BarTask";
import { addToDate } from "../../helpers/DateHelper";
import styles from "./grid.module.css";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  ganttHeight: number;
  todayColor: string;
  rtl: boolean;
  selectedTask: BarTask | undefined;
  themeConfig: any;
  lineId: string;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  ganttHeight,
  // todayColor,
  rtl,
  selectedTask,
  themeConfig,
  lineId,
}) => {
  const selectedTaskId = selectedTask ? selectedTask.id : "";
  let y = 0;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y - 2}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
        style={
          selectedTaskId === task.id
            ? { fill: themeConfig.tableHeaderColor }
            : {}
        }
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  let today: ReactChild = <rect />;
  let todayLine: ReactChild = <rect />;
  const rectHeight = y > ganttHeight ? y : ganttHeight;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i] ?? new Date();
    ticks.push(
      <rect
        key={date.getTime()}
        x={tickX}
        y={0}
        width={1}
        height={rectHeight}
        className={styles.gridTick}
        style={{ fill: themeConfig.tableBorderColor }}
      />
      // <line
      //   key={date.getTime()}
      //   x1={tickX - 1}
      //   y1={0}
      //   x2={tickX}
      //   y2={y}
      //   className={styles.gridTick}
      //   style={{
      //     stroke: themeConfig.tableBorderColor,
      //   }}
      // />
    );
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      today = (
        <rect
          x={tickX}
          y={0}
          width={columnWidth}
          height={rectHeight}
          fill="transparent"
        />
      );
      todayLine = (
        <rect
          id={lineId}
          x={tickX + columnWidth / 2}
          y={0}
          width={1}
          height={rectHeight}
          style={{ fill: "var(--primary-3)" }}
        />
      );
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + columnWidth}
          y={0}
          width={columnWidth}
          height={rectHeight}
          fill="transparent"
        />
      );
      todayLine = (
        <rect
          id={lineId}
          x={tickX + columnWidth + (columnWidth / 2 - 1)}
          y={0}
          width={1}
          height={rectHeight}
          style={{ fill: "var(--primary-3)" }}
          // fill="#3D54FD"
        />
      );
    }
    tickX += columnWidth;
  }

  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className={styles.today}>
        {today}
        {todayLine}
      </g>
    </g>
  );
};
