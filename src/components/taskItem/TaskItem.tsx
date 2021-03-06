import React, { useEffect, useMemo, useRef, useState } from "react";
import { BarTask } from "../../types/BarTask";
import { GanttContentMoveAction } from "../../types/GanttTaskActions";
import { Bar } from "./bar/Bar";
import { BarSmall } from "./bar/BarSmall";
import { Milestone } from "./milestone/Milestone";
// import { Project } from "./project/Project";
import style from "./taskList.module.css";

export type TaskItemProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  themeConfig: any;
  hiddenPercent?: boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
  onTouchEvent: (
    action: string,
    selectedTask: BarTask,
    event?: React.TouchEvent
  ) => any;
};

export const TaskItem: React.FC<TaskItemProps> = props => {
  const {
    task,
    arrowIndent,
    isDelete,
    taskHeight,
    isSelected,
    rtl,
    themeConfig,
    onEventStart,
    onTouchEvent,
  } = {
    ...props,
  };
  const textRef = useRef<SVGTextElement>(null);
  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);
  const [isTextInside, setIsTextInside] = useState(true);

  useEffect(() => {
    switch (task.typeInternal) {
      case "milestone":
        setTaskItem(<Milestone {...props} />);
        break;
      case "project":
        // setTaskItem(<Project {...props} />);
        setTaskItem(<Bar {...props} />);
        break;
      case "smalltask":
        setTaskItem(<BarSmall {...props} />);
        break;
      default:
        setTaskItem(<Bar {...props} />);
        break;
    }
  }, [task, isSelected]);

  useEffect(() => {
    if (textRef.current) {
      setIsTextInside(textRef.current.getBBox().width < task.x2 - task.x1);
    }
  }, [textRef, task]);

  const getX = () => {
    const width = task.x2 - task.x1;
    const hasChild = task.barChildren.length > 0;
    if (isTextInside) {
      return task.x1 + width * 0.5;
    }
    if (rtl && textRef.current) {
      return (
        task.x1 -
        textRef.current.getBBox().width -
        arrowIndent * +hasChild -
        arrowIndent * 0.2
      );
    } else {
      return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;
    }
  };

  const isMinWidth = useMemo(() => {
    return task.x2 - task.x1 < 18;
  }, [task]);

  return (
    <g
      onKeyDown={e => {
        switch (e.key) {
          case "Delete": {
            if (isDelete) onEventStart("delete", task, e);
            break;
          }
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => {
        e.preventDefault();
        e.stopPropagation();
        onEventStart("mouseenter", task, e);
      }}
      onMouseLeave={e => {
        e.preventDefault();
        e.stopPropagation();
        onEventStart("mouseleave", task, e);
      }}
      onDoubleClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onEventStart("dblclick", task, e);
      }}
      // onFocus={e => {
      //   e.preventDefault();
      //   e.stopPropagation();
      //   onEventStart("select", task);
      // }}
      onTouchStart={e => {
        e.stopPropagation();
        onTouchEvent("start", task, e);
      }}
      onTouchEnd={e => {
        e.stopPropagation();
        onTouchEvent("end", task, e);
      }}
      // onTouchMove={e => {
      //   onTouchEvent("move", task, e);
      // }}
      onContextMenu={e => {
        e.preventDefault();
      }}
      style={{ userSelect: "none" }}
    >
      {!task.isEmpty && taskItem}
      <text
        x={isMinWidth ? getX() - (task.x2 - task.x1) + 18 : getX()}
        y={task.y + taskHeight * 0.5 + 16 * 0.25}
        className={
          isTextInside
            ? style.barLabel
            : style.barLabel && style.barLabelOutside
        }
        style={{ fill: themeConfig.titleColor }}
        ref={textRef}
      >
        {!task.isEmpty && task.name}
      </text>
    </g>
  );
};
