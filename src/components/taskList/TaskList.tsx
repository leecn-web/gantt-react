import React, { useEffect, useRef } from "react";
import { BarTask } from "../../types/BarTask";
import { Task } from "../../types/PublicTypes";

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
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
  }>;
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
  setSelectedTask,
  onExpanderClick,
  onChangeColumnWidth,
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  // const tempRef = useRef<any[]>([]);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
    // let amount = 0;
    // const temp = columns.filter(item => {
    //   if (item.maxWidth) amount += item.maxWidth;
    //   return !item.maxWidth;
    // });
    // const column = columns.map(item => {
    //   if (item.maxWidth) return { ...item };
    //   else return { ...item, width: (440 - amount) / temp.length };
    // });
  }, [scrollY]);

  // useEffect(() => {
  //   let amount = 0;
  //   const temp = columns.filter(item => {
  //     if (item.maxWidth) amount += item.maxWidth;
  //     return !item.maxWidth;
  //   });
  //   const column = columns.map(item => {
  //     if (item.maxWidth) return { ...item };
  //     else return { ...item, width: (440 - amount) / temp.length };
  //   });
  // }, []);

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
    columns,
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
    setSelectedTask,
    onExpanderClick,
  };

  return (
    <div ref={taskListRef} style={{ overflow: "hidden" }}>
      {/* <BaseTable
        className="class"
        {...pipeline.getProps()}
        // useVirtual={false}
        // {...others}
        emptyCellHeight={40}
        useOuterBorder
        style={{
          "--bgcolor": "var(--comp-background-color)",
          "--hover-bgcolor": "#f2f6fc",
          "--cell-padding": "0",
          borderTop: "none",
          height: headerHeight - 2 + 40,
        }}
        // components={{ EmptyContent }}
      /> */}
      <TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={{
          maxHeight: ganttHeight && ganttHeight,
        }}
      >
        <TaskListTable {...tableProps} />
      </div>
    </div>
  );
};
