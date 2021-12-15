import React, { useEffect, useRef } from "react";
import { BarTask } from "../../types/BarTask";
import { Task } from "../../types/PublicTypes";
import styles from "./task.css";
import inStyles from "./taskListTable.module.css";

export type TaskListProps = {
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  rowHeight: number;
  ganttHeight: number;
  scrollY: number;
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
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
  }>;
  themeConfig: any;
  setSelectedTask: (task: string) => void;
  onExpanderClick: (task: Task) => void;
  onChangeColumnWidth: (columnId: string, width: number) => void;
};

export const TaskList: React.FC<TaskListProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  rowWidth,
  rowHeight,
  scrollY,
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
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
    columns,
    themeConfig,
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
    setSelectedTask,
    onExpanderClick,
  };

  const widthRef = useRef(443);

  useEffect(() => {
    const itemScrollWidth: number =
      document.querySelector(`.${inStyles.taskListTableRow}`)?.scrollWidth ||
      443;
    if (itemScrollWidth >= 443) {
      widthRef.current = itemScrollWidth;
    }
  }, [tasks]);

  return (
    <div ref={taskListRef} className={styles.task}>
      <TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={{
          width: widthRef.current,
          maxHeight: ganttHeight && ganttHeight,
        }}
      >
        <TaskListTable {...tableProps} />
      </div>
    </div>
  );
};
