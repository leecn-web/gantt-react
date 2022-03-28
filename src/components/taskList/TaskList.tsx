import React, { useEffect, useMemo, useRef } from "react";
import { BarTask } from "../../types/BarTask";
import { Task } from "../../types/PublicTypes";
import styles from "./task.css";
// import inStyles from "./taskListTable.module.css";
import heaStyles from "./taskListHeader.module.css";

export type TaskListProps = {
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  rowHeight: number;
  ganttHeight: number;
  locale: string;
  tasks: Task[];
  taskListRef: React.RefObject<HTMLDivElement>;
  horizontalContainerClass?: string;
  selectedTask: BarTask | undefined;
  columns: any[];
  TaskListHeader: React.FC<{
    headerHeight: number;
    fontFamily: string;
    fontSize: string;
    columns: any[];
    themeConfig: any;
    headRef: any;
    newWidth: number;
    onChangeColumnWidth: (
      columnId: string,
      width: number,
      headRef: any
    ) => void;
  }>;
  TaskListTable: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    columns: any[];
    themeConfig: any;
    ganttHeight: number;
    newWidth: number;
    verticalGanttContainerRef: React.RefObject<HTMLDivElement>;
    headRef: React.RefObject<HTMLDivElement>;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
    onDoubleClick?: (task: Task) => void;
  }>;
  themeConfig: any;
  dragRef: any;
  verticalGanttContainerRef: React.RefObject<HTMLDivElement>;
  ganttHeaderWidth: string | number;
  setSelectedTask: (task: string) => void;
  onExpanderClick: (task: Task) => void;
  onChangeColumnWidth: (columnId: string, width: number, headRef: any) => void;
  onDoubleClick?: (task: Task) => void;
};

export const TaskList: React.FC<TaskListProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  rowWidth,
  rowHeight,
  tasks,
  selectedTask,
  locale,
  ganttHeight,
  taskListRef,
  horizontalContainerClass,
  TaskListHeader,
  TaskListTable,
  columns,
  themeConfig,
  dragRef,
  verticalGanttContainerRef,
  ganttHeaderWidth,
  setSelectedTask,
  onExpanderClick,
  onChangeColumnWidth,
  onDoubleClick,
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<any>();

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
    columns,
    themeConfig,
    headRef,
    onChangeColumnWidth,
  };
  const selectedTaskId = selectedTask ? selectedTask.id : "";
  const tableProps = {
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize,
    tasks,
    locale,
    selectedTaskId: selectedTaskId,
    columns,
    themeConfig,
    ganttHeight,
    verticalGanttContainerRef,
    setSelectedTask,
    onExpanderClick,
    onDoubleClick: onDoubleClick,
  };

  const widthRef = useRef(443);

  useEffect(() => {
    const itemScrollWidth: number = headRef.current?.scrollWidth || 443;
    if (itemScrollWidth >= 443) {
      widthRef.current = itemScrollWidth;
    }
  }, [tasks, columns, horizontalContainerRef, widthRef.current, heaStyles]);

  const width = useMemo(() => {
    if (taskListRef.current) {
      if (!dragRef?.dragStart) {
        return taskListRef.current?.offsetWidth;
      } else {
        const newW = taskListRef.current?.offsetWidth + dragRef?.dragMove;
        return newW;
      }
    } else if (ganttHeaderWidth) {
      return ganttHeaderWidth;
    } else {
      return 443;
    }
  }, [dragRef, taskListRef.current]);

  return (
    <div
      ref={taskListRef}
      className={styles.task}
      style={{ width: `${width}px` }}
    >
      <TaskListHeader {...headerProps} newWidth={width} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={{
          width:
            width > widthRef.current ? `${width}px` : `${widthRef.current}px`,
          userSelect: "none",
        }}
      >
        <TaskListTable
          {...tableProps}
          newWidth={width}
          headRef={headRef.current}
        />
      </div>
      {/* </div> */}
    </div>
  );
};
