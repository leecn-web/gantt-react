import React, {
  useState,
  SyntheticEvent,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { ViewMode, GanttProps, Task } from "../../types/PublicTypes";
import { GridProps } from "../grid/Grid";
// import { ganttDateRange, seedDates, addToDate } from "../../helpers/DateHelper";
import { ganttDateRange, seedDates } from "../../helpers/DateHelper";
import { CalendarProps } from "../calendar/Calendar";
import { TaskGanttContentProps } from "./TaskGanttContent";
import { TaskListHeaderDefault } from "../taskList/TaskListHeader";
import { TaskListTableDefault } from "../taskList/TaskListTable";
import { StandardTooltipContent, Tooltip } from "../other/Tooltip";
import { VerticalScroll } from "../other/VerticalScroll";
import { TaskListProps, TaskList } from "../taskList/TaskList";
import { TaskGantt } from "./TaskGantt";
import { BarTask } from "../../types/BarTask";
import { convertToBarTasks } from "../../helpers/BarHelper";
import { GanttEvent } from "../../types/GanttTaskActions";
import { DateSetup } from "../../types/DateSetup";
import { HorizontalScroll } from "../other/HorizontalScroll";
import { removeHiddenTasks } from "../../helpers/OtherHelper";
import styles from "./gantt.module.css";
import scrollStyle from "../other/horizontalScroll.module.css";

export const Gantt: React.FunctionComponent<GanttProps> = props => {
  const {
    tasks,
    headerHeight = 75,
    columnWidth = 60,
    listCellWidth = "155px",
    rowHeight = 32,
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
    fontSize = "14px",
    arrowIndent = 20,
    todayColor = "rgba(252, 248, 227, 0.5)",
    TooltipContent = StandardTooltipContent,
    TaskListHeader = TaskListHeaderDefault,
    TaskListTable = TaskListTableDefault,
    columns = [],
    themeConfig = {},
    lineId = "currentLine",
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onDelete,
    onSelect,
    onExpanderClick,
    onChangeColumnWidth,
    onScrollBottom,
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

  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(-1);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);
  const isFirstLoaded = useRef<boolean>(true);

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

  // task change events
  useEffect(() => {
    // 拿到滚动的滑块dom
    const scrollDom: any = document.querySelector(`.${scrollStyle.scroll}`);
    const scrollWidth = scrollDom.scrollWidth - scrollDom.clientWidth; // 总可滑动长度
    // 判断是向左滑还是向右滑 增加左右两侧的 差量 差量是增加的空数据列表
    if (scrollX >= scrollWidth - 100) {
      coefficientRef.current[`${viewMode}Right`] =
        coefficientRef.current[`${viewMode}Right`] + 1;
    } else if (scrollX <= 100) {
      coefficientRef.current[`${viewMode}Left`] =
        coefficientRef.current[`${viewMode}Left`] + 1;
      setTimeout(() => {
        const timeMap = { month: 15, week: 4, day: 15 };
        setScrollX(timeMap[viewMode] * columnWidth);
      }, 50);
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
    if (rtl) {
      newDates = newDates.reverse();
      if (scrollX === -1) {
        setScrollX(newDates.length * columnWidth);
      }
    }
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
    scrollX,
    onExpanderClick,
  ]);

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

  // scroll events
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.shiftKey || event.deltaX) {
        const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
        let newScrollX = scrollX + scrollMove;
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }
        setScrollX(newScrollX);
        event.preventDefault();
      } else if (ganttHeight) {
        let newScrollY = scrollY + event.deltaY;
        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight;
        }
        if (newScrollY !== scrollY) {
          setScrollY(newScrollY);
          event.preventDefault();
        }
      }

      setIgnoreScrollEvent(true);
    };

    // subscribe if scroll is necessary
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }
    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, [wrapperRef.current, scrollY, scrollX, ganttHeight, svgWidth, rtl]);

  const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      setScrollY(event.currentTarget.scrollTop);
    }
    const scrollHeight =
      event.currentTarget.scrollHeight - event.currentTarget.clientHeight; // 总可滑动高度
    if (scrollY >= scrollHeight * 0.8) {
      onScrollBottom && onScrollBottom();
    }
    setIgnoreScrollEvent(false);
  };

  const handleScrollX = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
      setScrollX(event.currentTarget.scrollLeft);
    }
    setIgnoreScrollEvent(false);
  };

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    let newScrollY = scrollY;
    let newScrollX = scrollX;
    let isX = true;
    switch (event.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        newScrollY += rowHeight;
        isX = false;
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        newScrollY -= rowHeight;
        isX = false;
        break;
      case "Left":
      case "ArrowLeft":
        newScrollX -= columnWidth;
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        newScrollX += columnWidth;
        break;
    }
    if (isX) {
      if (newScrollX < 0) {
        newScrollX = 0;
      } else if (newScrollX > svgWidth) {
        newScrollX = svgWidth;
      }
      setScrollX(newScrollX);
    } else {
      if (newScrollY < 0) {
        newScrollY = 0;
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        newScrollY = ganttFullHeight - ganttHeight;
      }
      setScrollY(newScrollY);
    }
    setIgnoreScrollEvent(true);
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
      if (rtl) {
        newDates = newDates.reverse();
        if (scrollX === -1) {
          setScrollX(newDates.length * columnWidth);
        }
      }
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
      scrollX,
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
        const boxDOM: any = document.querySelector(
          `.${styles.ganttVerticalContainer}`
        );
        const x = todayDOM?.getAttribute("x");
        const width = Math.floor(boxDOM.clientWidth / 2);
        let linex = Number(x) - width;
        if (linex < 0) linex = 0;
        setScrollX(linex);
      }, 10);
    }
  }, [first, end, coefficientRef, viewMode, scrollX, changeDates]);
  // 初始化加载
  useEffect(() => {
    if (isFirstLoaded.current && barTasks && barTasks.length) {
      let timer: NodeJS.Timeout | null = null;
      timer = setTimeout(() => {
        if (timer) clearTimeout(timer);
        const firstItem = barTasks[0];
        const boxDOM: any = document.querySelector(
          `.${styles.ganttVerticalContainer}`
        );
        const width = Math.floor(boxDOM.clientWidth / 2);
        const linex = firstItem.x1 - width;
        setScrollX(linex);
        isFirstLoaded.current = false;
      }, 100);
    }
  }, [isFirstLoaded.current, barTasks]);

  const gridProps: GridProps = useMemo(() => {
    return {
      ganttHeight,
      columnWidth,
      svgWidth,
      tasks: tasks,
      rowHeight,
      dates: dateSetup.dates,
      todayColor,
      rtl,
      selectedTask,
      themeConfig,
      lineId,
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
      setGanttEvent,
      setFailedTask,
      setSelectedTask: handleSelectedTask,
      onDateChange,
      onProgressChange,
      onDoubleClick,
      onDelete,
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
      scrollY,
      ganttHeight,
      horizontalContainerClass: styles.horizontalContainer,
      selectedTask,
      taskListRef,
      TaskListHeader,
      TaskListTable,
      columns,
      themeConfig,
      setSelectedTask: handleSelectedTask,
      onExpanderClick: handleExpanderClick,
      onChangeColumnWidth,
    };
  }, [
    rowHeight,
    listCellWidth,
    fontFamily,
    fontSize,
    barTasks,
    locale,
    headerHeight,
    scrollY,
    ganttHeight,
    styles.horizontalContainer,
    selectedTask,
    taskListRef,
    TaskListHeader,
    TaskListTable,
    columns,
    themeConfig,
    handleSelectedTask,
    handleExpanderClick,
    onChangeColumnWidth,
  ]);

  const childrenRef = useRef<any>();
  const [width, setWidth] = useState<number>(0);

  const Children = (
    <div
      ref={childrenRef}
      className={styles.toolsBar}
      style={{
        maxWidth: `${width}px`,
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

  useEffect(() => {
    const func = () => {
      const rect = document
        .querySelector(`.${styles.ganttVerticalContainer}`)
        ?.getBoundingClientRect();
      setWidth(rect?.width ? rect?.width - 10 : 0);
    };
    func();
    window.addEventListener("resize", func);
    return () => {
      window.removeEventListener("resize", func);
    };
  }, [childrenRef]);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div
        className={styles.wrapper}
        style={{ borderColor: themeConfig.tableBorderColor }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={wrapperRef}
      >
        {listCellWidth && <TaskList {...tableProps} />}
        <TaskGantt
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          ganttHeight={ganttHeight}
          scrollY={scrollY}
          scrollX={scrollX}
          ChildrenDom={Children}
          themeConfig={themeConfig}
          lineId={lineId}
        />
        {ganttEvent.changedTask && (
          <Tooltip
            arrowIndent={arrowIndent}
            rowHeight={rowHeight}
            svgContainerHeight={svgContainerHeight}
            svgContainerWidth={svgContainerWidth}
            fontFamily={fontFamily}
            fontSize={fontSize}
            scrollX={scrollX}
            scrollY={scrollY}
            task={ganttEvent.changedTask}
            headerHeight={headerHeight}
            taskListWidth={taskListWidth}
            TooltipContent={TooltipContent}
            rtl={rtl}
            svgWidth={svgWidth}
          />
        )}
        <VerticalScroll
          listCellWidth={listCellWidth}
          ganttFullHeight={ganttFullHeight}
          ganttHeight={ganttHeight}
          headerHeight={headerHeight}
          scroll={scrollY}
          onScroll={handleScrollY}
          rtl={rtl}
        />
      </div>
      <HorizontalScroll
        svgWidth={svgWidth}
        taskListWidth={taskListWidth}
        scroll={scrollX}
        rtl={rtl}
        onScroll={handleScrollX}
      />
    </div>
  );
};
