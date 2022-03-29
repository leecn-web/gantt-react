import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useScroll } from "ahooks";
import { ViewMode, GanttProps, Task } from "../../types/PublicTypes";
import { GridProps } from "../grid/Grid";
// import { ganttDateRange, seedDates, addToDate } from "../../helpers/DateHelper";
import { ganttDateRange, seedDates } from "../../helpers/DateHelper";
import { CalendarProps } from "../calendar/Calendar";
import { TaskGanttContentProps } from "./TaskGanttContent";
import { TaskListHeaderDefault } from "../taskList/TaskListHeader";
import { TaskListTableDefault } from "../taskList/TaskListTable";
import { StandardTooltipContent, Tooltip } from "../other/Tooltip";
import { TaskListProps, TaskList } from "../taskList/TaskList";
import { TaskGantt } from "./TaskGantt";
import { BarTask } from "../../types/BarTask";
import { convertToBarTasks } from "../../helpers/BarHelper";
import { GanttEvent } from "../../types/GanttTaskActions";
import { DateSetup } from "../../types/DateSetup";
import { removeHiddenTasks } from "../../helpers/OtherHelper";
import styles from "./gantt.module.css";
// import scrollStyle from "../other/horizontalScroll.module.css";

export const Gantt: React.FunctionComponent<GanttProps> = props => {
  const {
    tasks,
    headerHeight = 75,
    columnWidth = 60,
    listCellWidth = "155px",
    rowHeight = 40,
    ganttHeight = 0,
    viewMode = ViewMode.Day,
    locale = "en-GB",
    barFill = 93.75,
    barCornerRadius = 3,
    barProgressColor = "#a3a3ff",
    barProgressSelectedColor = "#8282f5",
    barBackgroundColor = "#b8c2cc",
    barBackgroundSelectedColor = "#aeb8c2",
    projectProgressColor = "#7db59a",
    projectProgressSelectedColor = "#59a985",
    projectBackgroundColor = "#fac465",
    projectBackgroundSelectedColor = "#f7bb53",
    milestoneBackgroundColor = "#f1c453",
    milestoneBackgroundSelectedColor = "#f29e4c",
    rtl = false,
    handleWidth = 8,
    timeStep = 300000,
    arrowColor = "grey",
    fontFamily = "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
    fontSize = "13px",
    arrowIndent = 20,
    todayColor = "rgba(252, 248, 227, 0.5)",
    TooltipContent = StandardTooltipContent,
    TaskListHeader = TaskListHeaderDefault,
    TaskListTable = TaskListTableDefault,
    columns = [],
    themeConfig = {},
    lineId = "currentLine",
    hiddenPercent = false,
    ganttHeaderWidth = 443,
    type = "web",
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onDelete,
    onSelect,
    onExpanderClick,
    onChangeColumnWidth,
    onScrollBottom,
    onChangeColumnAllWidth,
  } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);
  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    if (!tasks.length) {
      return {
        viewMode,
        dates: seedDates(
          new Date(),
          new Date(new Date().getTime() - 100000),
          viewMode
        ),
      };
    }
    const [startDate, endDate] = ganttDateRange(tasks, viewMode);
    return { viewMode, dates: seedDates(startDate, endDate, viewMode) };
  });

  const [taskHeight, setTaskHeight] = useState((rowHeight * barFill) / 100);

  const [taskListWidth, setTaskListWidth] = useState(0);
  const [svgContainerWidth, setSvgContainerWidth] = useState(0);
  const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight);
  const [barTasks, setBarTasks] = useState<BarTask[]>([]);
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: "",
  });

  const [selectedTask, setSelectedTask] = useState<BarTask>();
  const [failedTask, setFailedTask] = useState<BarTask | null>(null);

  const svgWidth = dateSetup.dates.length * columnWidth;
  const ganttFullHeight = barTasks.length * rowHeight;

  const isFirstLoaded = useRef<boolean>(true);

  const verticalGanttContainerRef = useRef<any>();
  const horizontalContainerRef = useRef<any>();

  const [dragRef, setDragRef] = useState({
    draging: false,
    dragStart: 0,
    dragMove: 0,
  });

  const coefficientRef = useRef({
    hourRight: 1,
    dayRight: 1,
    weekRight: 1,
    monthRight: 1,
    hourLeft: 1,
    dayLeft: 1,
    weekLeft: 1,
    monthLeft: 1,
  });

  useEffect(() => {
    const { changedTask, action } = ganttEvent;
    if (changedTask) {
      if (action === "delete") {
        setGanttEvent({ action: "" });
        setBarTasks(barTasks.filter(t => t.id !== changedTask.id));
      } else if (
        action === "move" ||
        action === "end" ||
        action === "start" ||
        action === "progress"
      ) {
        const prevStateTask = barTasks.find(t => t.id === changedTask.id) ?? {
          start: new Date(),
          end: new Date(),
          progress: 0,
        };
        prevStateTask.start = prevStateTask?.start || new Date();
        prevStateTask.end = prevStateTask?.end || new Date();
        prevStateTask.progress = prevStateTask?.progress || 0;
        if (
          prevStateTask &&
          (prevStateTask?.start?.getTime() !== changedTask.start.getTime() ||
            prevStateTask?.end?.getTime() !== changedTask.end.getTime() ||
            prevStateTask?.progress !== changedTask.progress)
        ) {
          // actions for change
          const newTaskList = barTasks.map(t =>
            t.id === changedTask.id ? changedTask : t
          );
          setBarTasks(newTaskList);
        }
      }
    }
  }, [ganttEvent, barTasks]);

  useEffect(() => {
    if (failedTask) {
      setBarTasks(barTasks.map(t => (t.id !== failedTask.id ? t : failedTask)));
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);

  useEffect(() => {
    const newTaskHeight = (rowHeight * barFill) / 100;
    if (newTaskHeight !== taskHeight) {
      setTaskHeight(newTaskHeight);
    }
  }, [rowHeight, barFill, taskHeight]);

  useEffect(() => {
    if (!listCellWidth) {
      setTaskListWidth(0);
    }
    if (taskListRef.current) {
      setTimeout(() => {
        setTaskListWidth(taskListRef?.current?.offsetWidth ?? 0);
      }, 0);
    }
  }, [taskListRef.current, listCellWidth]);

  useEffect(() => {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
    }
  }, [wrapperRef, taskListWidth]);

  useEffect(() => {
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight);
    } else {
      setSvgContainerHeight(tasks.length * rowHeight + headerHeight);
    }
  }, [ganttHeight, tasks]);

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  /**
   * Task select event
   */
  const handleSelectedTask = (taskId: string) => {
    const newSelectedTask = barTasks.find(t => t.id === taskId);
    const oldSelectedTask = barTasks.find(
      t => !!selectedTask && t.id === selectedTask.id
    );
    if (onSelect) {
      if (oldSelectedTask) {
        onSelect(oldSelectedTask, false);
      }
      if (newSelectedTask) {
        onSelect(newSelectedTask, true);
      }
    }
    setSelectedTask(newSelectedTask);

    const rect = verticalGanttContainerRef.current.getBoundingClientRect();
    if (newSelectedTask?.x1) {
      verticalGanttContainerRef.current.scrollLeft =
        newSelectedTask?.x1 -
        rect.width / 2 +
        (newSelectedTask.x2 - newSelectedTask.x1) / 2;
    }
  };
  const handleExpanderClick = (task: Task) => {
    if (onExpanderClick && task.hideChildren !== undefined) {
      onExpanderClick({ ...task, hideChildren: !task.hideChildren });
    }
  };

  // 改变dates
  const changeDates = useCallback(
    async (fn?) => {
      let filteredTasks: Task[];
      if (onExpanderClick) {
        filteredTasks = removeHiddenTasks(tasks);
      } else {
        filteredTasks = tasks;
      }
      const [startDate, endDate] = ganttDateRange(
        filteredTasks,
        viewMode,
        coefficientRef.current[`${viewMode}Right`],
        coefficientRef.current[`${viewMode}Left`]
      );

      let newDates = seedDates(startDate, endDate, viewMode);
      setDateSetup({ dates: newDates, viewMode });
      setBarTasks(
        convertToBarTasks(
          filteredTasks,
          newDates,
          columnWidth,
          rowHeight,
          taskHeight,
          barCornerRadius,
          handleWidth,
          rtl,
          barProgressColor,
          barProgressSelectedColor,
          barBackgroundColor,
          barBackgroundSelectedColor,
          projectProgressColor,
          projectProgressSelectedColor,
          projectBackgroundColor,
          projectBackgroundSelectedColor,
          milestoneBackgroundColor,
          milestoneBackgroundSelectedColor
        )
      );
      fn && fn();
    },
    [
      tasks,
      viewMode,
      rowHeight,
      barCornerRadius,
      columnWidth,
      taskHeight,
      handleWidth,
      barProgressColor,
      barProgressSelectedColor,
      barBackgroundColor,
      barBackgroundSelectedColor,
      projectProgressColor,
      projectProgressSelectedColor,
      projectBackgroundColor,
      projectBackgroundSelectedColor,
      milestoneBackgroundColor,
      milestoneBackgroundSelectedColor,
      rtl,
      dateSetup,
      onExpanderClick,
    ]
  );
  // 得到当前时间和结束时间的时间戳，用于计算当前日期是否在图表内
  const first = useRef(dateSetup.dates[0].getTime());
  const end = useRef(dateSetup.dates[dateSetup.dates.length - 1].getTime());
  useEffect(() => {
    first.current = dateSetup.dates[0].getTime();
    end.current = dateSetup.dates[dateSetup.dates.length - 1].getTime();
  }, [viewMode, first, end, coefficientRef, dateSetup, changeDates]);
  // 定位到当前位置
  const onChangeScrollX8Current = useCallback(() => {
    const now = new Date().getTime();
    let timer: NodeJS.Timeout | null = null;
    if (first.current > now) {
      coefficientRef.current[`${viewMode}Left`] =
        coefficientRef.current[`${viewMode}Left`] + 1;
      changeDates(() => {
        timer = setTimeout(() => {
          if (timer) clearTimeout(timer);
          onChangeScrollX8Current();
        }, 1);
      });
    } else if (end.current < now) {
      coefficientRef.current[`${viewMode}Right`] =
        coefficientRef.current[`${viewMode}Right`] + 1;
      changeDates();
      timer = setTimeout(() => {
        if (timer) clearTimeout(timer);
        onChangeScrollX8Current();
      }, 1);
    } else {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (timer) clearTimeout(timer);
        const todayDOM = document.getElementById(lineId);
        const boxDOM: any = verticalGanttContainerRef.current?.getBoundingClientRect();
        const x = todayDOM?.getAttribute("x");
        const width = Math.floor((boxDOM?.width || 0) / 2);
        let linex = Number(x) - width;
        if (linex < 0) linex = 0;
        verticalGanttContainerRef.current.scrollLeft = linex;
      }, 10);
    }
  }, [first, end, coefficientRef, viewMode, scrollX, changeDates]);
  // 初始化加载
  useEffect(() => {
    if (isFirstLoaded.current && barTasks && barTasks.length) {
      let timer: NodeJS.Timeout | null = null;
      timer = setTimeout(() => {
        if (timer) clearTimeout(timer);
      }, 100);
    }
  }, [isFirstLoaded.current, barTasks]);

  const defaultWidth = useMemo(() => {
    if (taskListRef.current) {
      return taskListRef.current?.offsetWidth;
    }
    return 443;
  }, [taskListRef.current, taskListRef.current?.offsetWidth]);

  const gridProps: GridProps = useMemo(() => {
    return {
      ganttHeight,
      columnWidth,
      svgWidth,
      tasks: barTasks,
      rowHeight,
      dates: dateSetup.dates,
      todayColor,
      rtl,
      selectedTask,
      themeConfig,
      lineId,
      verticalGanttContainerRef,
    };
  }, [
    ganttHeight,
    columnWidth,
    svgWidth,
    tasks,
    rowHeight,
    dateSetup.dates,
    todayColor,
    rtl,
    selectedTask,
    themeConfig,
    lineId,
    verticalGanttContainerRef,
  ]);
  const calendarProps: CalendarProps = useMemo(() => {
    return {
      dateSetup,
      locale,
      viewMode,
      headerHeight,
      columnWidth,
      fontFamily,
      fontSize,
      rtl,
      themeConfig,
    };
  }, [
    dateSetup,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
    rtl,
    themeConfig,
  ]);
  const barProps: TaskGanttContentProps = useMemo(() => {
    return {
      tasks: barTasks,
      dates: dateSetup.dates,
      ganttEvent,
      selectedTask,
      rowHeight,
      taskHeight,
      columnWidth,
      arrowColor,
      timeStep,
      fontFamily,
      fontSize,
      arrowIndent,
      svgWidth,
      rtl,
      themeConfig,
      hiddenPercent,
      setGanttEvent,
      setFailedTask,
      setSelectedTask: handleSelectedTask,
      onDateChange,
      onProgressChange,
      onDoubleClick,
      onDelete,
      onChangeColumnWidth,
    };
  }, [
    barTasks,
    dateSetup.dates,
    ganttEvent,
    selectedTask,
    rowHeight,
    taskHeight,
    columnWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgWidth,
    rtl,
    themeConfig,
    hiddenPercent,
    setGanttEvent,
    setFailedTask,
    handleSelectedTask,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onDelete,
  ]);

  const tableProps: TaskListProps = useMemo(() => {
    return {
      rowHeight,
      rowWidth: listCellWidth,
      fontFamily,
      fontSize,
      tasks: barTasks,
      locale,
      headerHeight,
      ganttHeight,
      horizontalContainerClass: styles.horizontalContainer,
      selectedTask,
      taskListRef,
      TaskListHeader,
      TaskListTable,
      columns,
      themeConfig,
      defaultWidth,
      dragRef,
      verticalGanttContainerRef,
      ganttHeaderWidth,
      type,
      setSelectedTask: handleSelectedTask,
      onExpanderClick: handleExpanderClick,
      onChangeColumnWidth,
      onDoubleClick,
    };
  }, [
    rowHeight,
    listCellWidth,
    fontFamily,
    fontSize,
    barTasks,
    locale,
    headerHeight,
    ganttHeight,
    styles.horizontalContainer,
    selectedTask,
    taskListRef,
    TaskListHeader,
    TaskListTable,
    columns,
    themeConfig,
    defaultWidth,
    dragRef,
    verticalGanttContainerRef,
    ganttHeaderWidth,
    type,
    handleSelectedTask,
    handleExpanderClick,
    onChangeColumnWidth,
    onDoubleClick,
  ]);

  const childrenRef = useRef<any>();
  // const [width, setWidth] = useState<number>(0);

  const Children = (
    <div
      ref={childrenRef}
      className={styles.toolsBar}
      style={{
        maxWidth: verticalGanttContainerRef?.current?.offsetWidth
          ? `${verticalGanttContainerRef?.current?.offsetWidth}px`
          : "100%",
      }}
    >
      {
        // children 不是数组我们需要用 React.Children.map 来遍历
        // 或者把它转成数组
        React.Children.map(props.children, child => {
          if (!React.isValidElement(child)) {
            return null;
          }
          const childProps = {
            ...child.props,
            changeScrollCurrent: onChangeScrollX8Current,
          };
          // 这里我们通常还会判断 child 的类型来确定是不是要传递相应的数据，这里我就不做了
          return React.cloneElement(child, childProps);
        })
      }
    </div>
  );

  // useEffect(() => {
  //   const func = () => {
  //     const wrapDOM = verticalGanttContainerRef.current;
  //     const rect = wrapDOM?.getBoundingClientRect();
  //     setWidth(rect?.width ? rect?.width - 10 : 0);
  //   };
  //   setTimeout(() => {
  //     func();
  //   }, 500);
  //   window.addEventListener("resize", func, false);
  //   return () => {
  //     window.removeEventListener("resize", func, false);
  //   };
  // }, [childrenRef, verticalGanttContainerRef]);

  const scrollRight = useScroll(verticalGanttContainerRef);
  const scrollLeftMaps = { day: 1500, month: 792, week: 400 };

  useEffect(() => {
    if (scrollRight.top !== taskListRef.current?.scrollTop) {
      if (taskListRef.current) {
        taskListRef.current.scrollTop = scrollRight.top;
      }
    }
  }, [scrollRight, taskListRef]);

  useEffect(() => {
    if (
      wrapperRef &&
      wrapperRef.current &&
      horizontalContainerRef &&
      horizontalContainerRef.current
    ) {
      if (
        !scrollRight.top ||
        !(
          horizontalContainerRef.current.offsetHeight -
          (wrapperRef.current?.offsetHeight - 78)
        )
      ) {
        return;
      }

      if (
        scrollRight.top >=
        horizontalContainerRef.current.offsetHeight -
          (wrapperRef.current?.offsetHeight - 78)
      ) {
        onScrollBottom && onScrollBottom();
      }
    }
  }, [onScrollBottom, horizontalContainerRef, wrapperRef, scrollRight]);

  // task change events
  useEffect(() => {
    if (
      scrollRight.left >=
      svgWidth - verticalGanttContainerRef.current.offsetWidth
    ) {
      coefficientRef.current[`${viewMode}Right`] =
        coefficientRef.current[`${viewMode}Right`] + 1;
    } else if (scrollRight.left <= 50) {
      coefficientRef.current[`${viewMode}Left`] =
        coefficientRef.current[`${viewMode}Left`] + 1;
      verticalGanttContainerRef.current.scrollLeft = scrollLeftMaps[viewMode];
    }
    let filteredTasks: Task[];
    if (onExpanderClick) {
      filteredTasks = removeHiddenTasks(tasks);
    } else {
      filteredTasks = tasks;
    }
    const [startDate, endDate] = ganttDateRange(
      filteredTasks,
      viewMode,
      coefficientRef.current[`${viewMode}Right`],
      coefficientRef.current[`${viewMode}Left`]
    );

    let newDates = seedDates(startDate, endDate, viewMode);
    setDateSetup({ dates: newDates, viewMode });

    setBarTasks(
      convertToBarTasks(
        filteredTasks,
        newDates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor
      )
    );
  }, [
    tasks,
    viewMode,
    rowHeight,
    barCornerRadius,
    columnWidth,
    taskHeight,
    handleWidth,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    projectProgressColor,
    projectProgressSelectedColor,
    projectBackgroundColor,
    projectBackgroundSelectedColor,
    milestoneBackgroundColor,
    milestoneBackgroundSelectedColor,
    rtl,
    scrollRight,
    verticalGanttContainerRef,
    onExpanderClick,
    removeHiddenTasks,
  ]);

  const onMouseDown = useCallback(
    (e: any): void => {
      const target = e.target;
      e.stopPropagation();
      e.preventDefault();

      // 记录拖动的列及起始位置
      const name = target.getAttribute("data-id");

      if (name === "column-header") {
        setDragRef({
          draging: true,
          dragStart: e.clientX,
          dragMove: 0,
        });
        // dragRef.current.draging = true;
        // dragRef.current.dragStart = e.clientX; // 获取鼠标按下时光标x的值
        // dragRef.current.dragMove = e.clientX; // 获取鼠标按下时光标x的值
      }
    },
    [dragRef, setDragRef]
  );

  const onMouseUp = useCallback(
    (e): void => {
      e.stopPropagation();
      e.preventDefault();
      // 获取当前鼠标位置，与起始位置的差为最新的列宽
      if (dragRef.draging) {
        setDragRef({
          draging: false,
          dragStart: 0,
          dragMove: 0,
        });
        // dragRef.current.draging = false;
        // dragRef.current.dragStart = 0; // 获取鼠标按下时光标x的值
        // dragRef.current.dragMove = 0; // 获取鼠标按下时光标x的值
      }
    },
    [dragRef, setDragRef]
  );

  const onMouseMove = useCallback(
    async (e: any): Promise<void> => {
      e.stopPropagation();
      e.preventDefault();
      // 实时改变列宽
      // TODO 防抖
      if (dragRef.draging) {
        const moveX = e.clientX;
        const diffX = moveX - (dragRef.dragStart as number);
        setDragRef({
          ...dragRef,
          dragStart: (dragRef.dragStart += diffX),
          dragMove: diffX,
        });
        onChangeColumnAllWidth &&
          onChangeColumnAllWidth(diffX, verticalGanttContainerRef, taskListRef);
      }
      // if (dragRef.current.draging) {
      //   const moveX = e.clientX;
      //   const diffX = moveX - (dragRef.current.dragMove as number);
      //   dragRef.current.dragMove = dragRef.current.dragMove + diffX; // 获取鼠标按下时光标x的值
      // }
    },
    [dragRef]
  );

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

  // useEffect(() => {
  //   if (taskListRef.current) {
  //     if (!dragRef.current?.dragStart) {
  //       listwidth1 = taskListRef.current?.offsetWidth;
  //     } else {
  //       const newW =
  //         taskListRef.current?.offsetWidth +
  //         (dragRef.current?.dragMove - dragRef.current?.dragStart);
  //       listwidth1 = newW;
  //     }
  //   } else {
  //     listwidth1 = 443;
  //   }
  // }, [taskListRef.current, dragRef.current]);
  // const listWidth = () => {
  //   if (taskListRef.current) {
  //     if (!dragRef.current?.dragStart) {
  //       return taskListRef.current?.offsetWidth;
  //     } else {
  //       const newW =
  //         taskListRef.current?.offsetWidth +
  //         (dragRef.current?.dragMove - dragRef.current?.dragStart);
  //       return newW;
  //     }
  //   } else {
  //     return 443;
  //   }
  // };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        className={styles.wrapper}
        style={{ borderColor: themeConfig.tableBorderColor }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={wrapperRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={useThrottle(onMouseMove, 100)}
      >
        {listCellWidth && <TaskList {...tableProps} dragRef={dragRef} />}
        {listCellWidth && (
          <div
            className={styles.headerDrag}
            data-id="column-header"
            style={{ left: `${defaultWidth - 6}px` }}
          ></div>
        )}
        <TaskGantt
          verticalGanttContainerRef={verticalGanttContainerRef}
          listCellWidth={listCellWidth}
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          ganttHeight={ganttHeight}
          ChildrenDom={Children}
          themeConfig={themeConfig}
          lineId={lineId}
          ganttFullHeight={ganttFullHeight}
          svgWidth={svgWidth}
          taskListRef={taskListRef}
          horizontalContainerRef={horizontalContainerRef}
        />
        {ganttEvent.changedTask && (
          <Tooltip
            arrowIndent={arrowIndent}
            rowHeight={rowHeight}
            svgContainerHeight={svgContainerHeight}
            svgContainerWidth={svgContainerWidth}
            fontFamily={fontFamily}
            fontSize={fontSize}
            task={ganttEvent.changedTask}
            headerHeight={headerHeight}
            taskListWidth={taskListWidth}
            TooltipContent={TooltipContent}
            rtl={rtl}
            svgWidth={svgWidth}
            scrollX={scrollRight.left}
            scrollY={scrollRight.top}
          />
        )}
      </div>
    </div>
  );
};
