import React, { useCallback, useEffect, useRef } from "react";
import TaskListHeaderItem from "./TaskListHeaderItem";
import styles from "./taskListHeader.module.css";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  fontFamily: string;
  fontSize: string;
  columns: any[];
  onChangeColumnWidth: (columnId: string, width: number) => void;
}> = ({ headerHeight, fontFamily, fontSize, columns, onChangeColumnWidth }) => {
  const showAlignValue = (item: { align: any }) => {
    switch (item.align) {
      case "center":
        return "center";
      case "left":
        return "flex-start";
      case "right":
        return "flex-end";
      default:
        return "flex-start";
    }
  };

  const dragRef = useRef<{
    draging: boolean;
    dragColumn?: string;
    dragStart: number;
  }>({
    draging: false,
    dragStart: 0,
  });

  const onMouseDown = (e: any): void => {
    const target = e.target;

    // 记录拖动的列及起始位置
    const name = target.getAttribute("data-id");
    const isLast = target.getAttribute("data-last") === "1";
    if (name && !isLast) {
      dragRef.current.draging = true;
      dragRef.current.dragColumn = name;
      dragRef.current.dragStart = e.clientX; // 获取鼠标按下时光标x的值
    }
  };

  const onMouseUp = (): void => {
    // 获取当前鼠标位置，与起始位置的差为最新的列宽
    if (dragRef.current.draging) {
      dragRef.current.draging = false;
      dragRef.current.dragColumn = "";
      dragRef.current.dragStart = 0; // 获取鼠标按下时光标x的值
    }
  };

  const onMouseMove = async (e: any): Promise<void> => {
    // 实时改变列宽
    // TODO 防抖
    if (dragRef.current.draging) {
      const moveX = e.clientX;
      const diffX = moveX - (dragRef.current.dragStart as number);
      if (onChangeColumnWidth) {
        await onChangeColumnWidth(dragRef.current.dragColumn as string, diffX);
        dragRef.current.dragStart += diffX;
      }
    }
  };

  // const useDebounce = (fn: (e: any) => void, delay: number, dep = []) => {
  //   const current: any = useRef({ fn, timer: null });
  //   useEffect(() => {
  //     current.current.fn = fn;
  //   }, [fn]);

  //   return useCallback((...args) => {
  //     if (current.current.timer) {
  //       clearTimeout(current.current.timer);
  //     }
  //     current.current.timer = setTimeout(() => {
  //       current.current.fn(...args);
  //     }, delay);
  //   }, dep);
  // };
  const useThrottle = (fn: (e: any) => void, delay: number, dep = []) => {
    const { current }: any = useRef({ fn, timer: null });
    useEffect(
      function () {
        current.fn = fn;
      },
      [fn]
    );
    return useCallback((...args) => {
      if (!current.timer) {
        current.timer = setTimeout(() => {
          delete current.timer;
        }, delay);
        current.fn(...args);
      }
    }, dep);
  };

  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        userSelect: "none",
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      // onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      onMouseMove={useThrottle(onMouseMove, 100)}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 1,
        }}
      >
        {columns.map((item, index) => {
          const Label =
            typeof item.label !== "string"
              ? item.label
              : () => <div>{item.label}</div>;
          const alignValue = showAlignValue(item);
          return (
            <TaskListHeaderItem
              key={`column${item.name}`}
              index={index}
              lastIndex={columns.length - 1 === index}
              item={item}
              alignValue={alignValue}
            >
              <Label />
            </TaskListHeaderItem>
          );
        })}
      </div>
    </div>
  );
};
