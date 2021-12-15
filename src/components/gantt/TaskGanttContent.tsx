import React, { useCallback, useEffect, useState } from "react";
import { EventOption } from "../../types/PublicTypes";
import { BarTask } from "../../types/BarTask";
import { Arrow } from "../other/Arrow";
import { handleTaskBySVGMouseEvent } from "../../helpers/BarHelper";
import { isKeyboardEvent } from "../../helpers/OtherHelper";
import { TaskItem } from "../taskItem/TaskItem";
import {
  BarMoveAction,
  GanttContentMoveAction,
  GanttEvent,
} from "../../types/GanttTaskActions";

export type TaskGanttContentProps = {
  tasks: BarTask[];
  dates: Date[];
  ganttEvent: GanttEvent;
  selectedTask: BarTask | undefined;
  rowHeight: number;
  columnWidth: number;
  timeStep: number;
  svg?: React.RefObject<SVGSVGElement>;
  svgWidth: number;
  taskHeight: number;
  arrowColor: string;
  arrowIndent: number;
  fontSize: string;
  fontFamily: string;
  rtl: boolean;
  themeConfig: any;
  setGanttEvent: (value: GanttEvent) => void;
  setFailedTask: (value: BarTask | null) => void;
  setSelectedTask: (taskId: string) => void;
  onChangeColumnWidth?: (columnId: string, width: number) => void;
} & EventOption;

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
  tasks,
  dates,
  ganttEvent,
  selectedTask,
  rowHeight,
  columnWidth,
  timeStep,
  svg,
  taskHeight,
  arrowColor,
  arrowIndent,
  fontFamily,
  fontSize,
  rtl,
  themeConfig,
  setGanttEvent,
  setFailedTask,
  setSelectedTask,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onDelete,
}) => {
  const point = svg?.current?.createSVGPoint();
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleMove = async (event: any) => {
    if (!ganttEvent.changedTask || !point || !svg?.current) return;

    point.x = event.clientX;
    const cursor = point.matrixTransform(
      svg?.current.getScreenCTM()?.inverse()
    );

    const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
      cursor.x,
      ganttEvent.action as BarMoveAction,
      ganttEvent.changedTask,
      xStep,
      timeStep,
      initEventX1Delta,
      rtl
    );
    if (isChanged) {
      setGanttEvent({
        action: ganttEvent.action,
        changedTask,
        originalSelectedTask: ganttEvent.originalSelectedTask,
      });
    }
  };

  const handleUp = async (event: any) => {
    const { action, originalSelectedTask, changedTask } = ganttEvent;

    if (!changedTask || !point || !svg?.current || !originalSelectedTask)
      return;

    point.x = event ? event.clientX : point.x;
    const cursor = point.matrixTransform(
      svg?.current.getScreenCTM()?.inverse()
    );
    const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
      cursor.x,
      action as BarMoveAction,
      changedTask,
      xStep,
      isMobile ? 0 : timeStep,
      initEventX1Delta,
      rtl
    );
    if (isMobile) {
      newChangedTask.progress = changedTask.progress;
    }

    const isNotLikeOriginal =
      originalSelectedTask.start !== newChangedTask.start ||
      originalSelectedTask.end !== newChangedTask.end ||
      originalSelectedTask.progress !== newChangedTask.progress;

    // remove listeners
    svg.current.removeEventListener("mousemove", handleMouseMove);
    svg.current.removeEventListener("mouseup", handleMouseUp);

    setGanttEvent({ action: "" });
    setIsMoving(false);

    // custom operation start
    let operationSuccess = true;

    if (
      (action === "move" || action === "end" || action === "start") &&
      onDateChange &&
      isNotLikeOriginal
    ) {
      try {
        const result = await onDateChange(
          newChangedTask,
          newChangedTask.barChildren
        );
        if (result !== undefined) {
          operationSuccess = result;
        }
      } catch (error) {
        operationSuccess = false;
      }
    } else if (onProgressChange && isNotLikeOriginal) {
      try {
        const result = await onProgressChange(
          newChangedTask,
          newChangedTask.barChildren
        );
        if (result !== undefined) {
          operationSuccess = result;
        }
      } catch (error) {
        operationSuccess = false;
      }
    }

    // If operation is failed - return old state
    if (!operationSuccess) {
      setFailedTask(originalSelectedTask);
    }
  };

  const handleTouchMove = useCallback(
    async (event: TouchEvent) => {
      event.preventDefault();
      const e = event.touches[0];
      handleMove(e);
    },
    [ganttEvent, selectedTask, handleMove]
  );

  const handleTouchUp = useCallback(
    async (event: TouchEvent) => {
      event.preventDefault();
      const e = event.touches[0];
      handleUp(e);
    },
    [ganttEvent, selectedTask, handleUp]
  );

  const handleMouseMove = async (event: MouseEvent) => {
    event.preventDefault();
    handleMove(event);
  };

  const handleMouseUp = async (event: MouseEvent) => {
    event.preventDefault();
    handleUp(event);
  };

  // create xStep
  useEffect(() => {
    const date1 = dates?.[1] ?? new Date();
    const date0 = dates?.[0] ?? new Date();
    const dateDelta =
      date1.getTime() -
      date0.getTime() -
      date1.getTimezoneOffset() * 60 * 1000 +
      date0.getTimezoneOffset() * 60 * 1000;
    const newXStep = (timeStep * columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dates, timeStep]);

  // pc端事件绑定
  useEffect(() => {
    if (
      !isMoving &&
      (ganttEvent.action === "move" ||
        ganttEvent.action === "end" ||
        ganttEvent.action === "start" ||
        ganttEvent.action === "progress") &&
      svg?.current
    ) {
      // pc端绑定事件
      svg.current.addEventListener("mousemove", handleMouseMove);
      svg.current.addEventListener("mouseup", handleMouseUp);
      setIsMoving(true);
    }
  }, [
    ganttEvent,
    xStep,
    initEventX1Delta,
    onProgressChange,
    timeStep,
    onDateChange,
    svg,
    isMoving,
  ]);

  // 移动端事件绑定
  useEffect(() => {
    // 移动端绑定事件
    svg?.current?.addEventListener("touchmove", handleTouchMove);
    svg?.current?.addEventListener("touchend", handleTouchUp);
    return () => {
      // 移动端绑定事件
      svg?.current?.removeEventListener("touchmove", handleTouchMove);
      svg?.current?.removeEventListener("touchend", handleTouchUp);
    };
  }, [ganttEvent, svg, handleTouchMove, handleTouchUp]);

  /**
   * Method is Start point of task change
   */
  const handleBarEventStart = async (
    action: GanttContentMoveAction,
    task: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => {
    event?.stopPropagation();
    event?.preventDefault();

    setIsMobile(false);

    if (!event) {
      if (action === "select") {
        setSelectedTask(task.id);
      }
    }
    // Keyboard events
    else if (isKeyboardEvent(event)) {
      if (action === "delete") {
        if (onDelete) {
          try {
            const result = await onDelete(task);
            if (result !== undefined && result) {
              setGanttEvent({ action, changedTask: task });
            }
          } catch (error) {
            console.error("Error on Delete. " + error);
          }
        }
      }
    }
    // Change task event start
    else if (action === "move") {
      if (!svg?.current || !point) return;
      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse()
      );
      setInitEventX1Delta(cursor.x - task.x1);
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    }
    // Mouse Events
    else if (action === "mouseenter") {
      // if (!ganttEvent.action) {
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
      // }
    } else if (action === "mouseleave") {
      if (ganttEvent.action === "mouseenter") {
        setGanttEvent({ action: "" });
      }
    } else if (action === "dblclick") {
      !!onDoubleClick && onDoubleClick(task);
    } else {
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    }
  };
  /**
   * Method is Touch of task change
   */
  const handleBarTouchStart = async (
    action: string,
    task: BarTask,
    event?: React.TouchEvent
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    setIsMobile(true);
    if (!event) {
      if (action === "select") {
        setSelectedTask(task.id);
      }
    }
    // Mouse Events
    else if (action === "left") {
      await setGanttEvent({
        action: "start",
        changedTask: task,
        originalSelectedTask: task,
      });
    } else if (action === "right") {
      await setGanttEvent({
        action: "end",
        changedTask: task,
        originalSelectedTask: task,
      });
    } else if (action === "dblclick") {
      !!onDoubleClick && onDoubleClick(task);
    } else if (action === "progress") {
      await setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    } else if (action === "move") {
      if (!svg?.current || !point) return;
      point.x = event.touches[0].pageX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse()
      );
      setInitEventX1Delta(cursor.x - task.x1);
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    } else if (action === "end") {
      if (ganttEvent.action === "move") {
        setGanttEvent({ action: "" });
      }
    }
    // else if (action === "end") {
    //   // handleUp(event);
    //   setGanttEvent({ action: "" });
    //   setIsMoving(false);
    //   setSelectedTask("");
    // }
  };

  return (
    <g className="content">
      <g className="arrows" fill={arrowColor} stroke={arrowColor}>
        {tasks.map(task => {
          return task.barChildren.map(child => {
            return (
              <Arrow
                key={`Arrow from ${task.id} to ${tasks[child.index].id}`}
                taskFrom={task}
                taskTo={tasks[child.index]}
                rowHeight={rowHeight}
                taskHeight={taskHeight}
                arrowIndent={arrowIndent}
                rtl={rtl}
              />
            );
          });
        })}
      </g>
      <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
        {tasks.map(task => {
          return (
            <TaskItem
              task={task}
              arrowIndent={arrowIndent}
              taskHeight={taskHeight}
              isProgressChangeable={!!onProgressChange && !task.isDisabled}
              isDateChangeable={!!onDateChange && !task.isDisabled}
              isDelete={!task.isDisabled}
              onEventStart={handleBarEventStart}
              onTouchEvent={handleBarTouchStart}
              key={task.id}
              isSelected={!!selectedTask && task.id === selectedTask.id}
              rtl={rtl}
              themeConfig={themeConfig}
            />
          );
        })}
      </g>
    </g>
  );
};
