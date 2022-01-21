import React, { useEffect, useRef } from "react";
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
    onChangeColumnWidth: (columnId: string, width: number) => void;
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
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
    onDoubleClick?: (task: Task) => void;
  }>;
  themeConfig: any;
  setSelectedTask: (task: string) => void;
  onExpanderClick: (task: Task) => void;
  onChangeColumnWidth: (columnId: string, width: number) => void;
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

  return (
    <div ref={taskListRef} className={styles.task}>
      <TaskListHeader {...headerProps} />
      {/* <div className={styles.tableWrap}> */}
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={{
          width: widthRef.current,
        }}
      >
        <TaskListTable {...tableProps} />
      </div>
      {/* </div> */}
    </div>
  );
};
