import React, { useMemo } from "react";
import { useDebounceFn } from "ahooks";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
// import { getStartEndDateForProject, initTasks } from "./helper";
import { initTasks } from "./helper";
import "gantt-task-react/dist/index.css";

//Init
const App = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(false);
  const [columns, setColumns] = React.useState<any[]>([
    {
      name: "stext2e010ce8-cbfd-4fc4-bece-3c03eed17214",
      label: "姓名",
      align: "left",
      minWidth: 80,
      width: 130,
      resize: true,
      onrender: (item: any) => {
        return <div>{item.data.name}</div>;
      },
    },
    {
      name: "stext46d4fbfc-0b65-4193-a436-d24f27401e34",
      label: "性别",
      align: "left",
      width: 130,
      minWidth: 80,
      resize: true,
      onrender: (item: any) => {
        return <div>{new Date(item.data.start).getTime()}</div>;
      },
    },
    {
      name: "stextbff8d155-826c-4ffa-b221-2",
      label: "字段",
      align: "left",
      width: 130,
      minWidth: 80,
      resize: true,
      onrender: (item: any) => {
        return <div>{new Date(item.data.end).getTime()}</div>;
      },
    },
    // {
    //   name: "stextbff8d155-826c-4ffa-b221-3",
    //   label: "字段",
    //   align: "left",
    //   width: 130,
    //   minWidth: 80,
    //   resize: true,
    //   onrender: (item: any) => {
    //     return <div>{new Date(item.data.end).getTime()}</div>;
    //   },
    // },
    // {
    //   name: "stextbff8d155-826c-4ffa-b221-4",
    //   label: "字段",
    //   align: "left",
    //   width: 130,
    //   minWidth: 80,
    //   resize: true,
    //   onrender: (item: any) => {
    //     return <div>{new Date(item.data.end).getTime()}</div>;
    //   },
    // },
    // {
    //   name: "stextbff8d155-826c-4ffa-b221-5",
    //   label: "字段",
    //   align: "left",
    //   width: 130,
    //   minWidth: 80,
    //   resize: true,
    //   onrender: (item: any) => {
    //     return <div>{new Date(item.data.end).getTime()}</div>;
    //   },
    // },
    // {
    //   name: "stextbff8d155-826c-4ffa-b221-6",
    //   label: "字段",
    //   align: "left",
    //   width: 130,
    //   minWidth: 80,
    //   resize: true,
    //   onrender: (item: any) => {
    //     return <div>{new Date(item.data.end).getTime()}</div>;
    //   },
    // },
    // {
    //   name: "stextbff8d155-826c-4ffa-b221-7",
    //   label: "字段",
    //   align: "left",
    //   width: 130,
    //   minWidth: 80,
    //   resize: true,
    //   onrender: (item: any) => {
    //     return <div>{new Date(item.data.end).getTime()}</div>;
    //   },
    // },
    // {
    //   name: "stextbff8d155-826c-4ffa-b221-8",
    //   label: "字段",
    //   align: "left",
    //   width: 130,
    //   minWidth: 80,
    //   resize: true,
    //   onrender: (item: any) => {
    //     return <div>{new Date(item.data.end).getTime()}</div>;
    //   },
    // },
    // {
    //   name: "stextbff8d155-826c-4ffa-b221-9",
    //   label: "字段",
    //   align: "left",
    //   width: 130,
    //   minWidth: 80,
    //   resize: true,
    //   onrender: (item: any) => {
    //     return <div>{new Date(item.data.end).getTime()}</div>;
    //   },
    // },
    // {
    //   name: "more",
    //   label: () => <i className="iconfont iconMoreVertical'"></i>,
    //   align: "center",
    //   onrender: () => {
    //     const isBtnShow = true;
    //     return isBtnShow ? <div>2</div> : <div></div>;
    //   },
    //   width: 50,
    //   maxWidth: 50,
    //   minWidth: 50,
    //   resize: false,
    // },
  ]);
  let columnWidth = 50;
  if (view === ViewMode.Hour) {
    columnWidth = 50;
  } else if (view === ViewMode.Month) {
    columnWidth = 66;
  } else if (view === ViewMode.Week) {
    columnWidth = 100;
  } else {
    columnWidth = 50;
  }

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    // if (task.project) {
    //   const [start, end] = getStartEndDateForProject(newTasks, task.project);
    //   const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
    //   if (
    //     project.start.getTime() !== start.getTime() ||
    //     project.end.getTime() !== end.getTime()
    //   ) {
    //     const changedProject = { ...project, start, end };
    //     newTasks = newTasks.map(t =>
    //       t.id === task.project ? changedProject : t
    //     );
    //   }
    // }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
  };

  const onChangeColumnWidth = (columnId: string, diffWidth: number) => {
    const columnList = [...columns];

    const index = columnList.findIndex(column => column.name === columnId);

    if (index >= 0) {
      const dragColumn = columnList[index];
      dragColumn.width += diffWidth;

      const nextColumns = columnList.filter((column: any, i: number) => {
        return i > index && column.resize;
      });

      if (nextColumns.length) {
        nextColumns.forEach(column => {
          column.width -= Math.floor(diffWidth / nextColumns.length);
        });
      }

      setColumns(columnList);
    }
  };
  const { run } = useDebounceFn(
    () => {
      console.log("123 拉到底啦 别拉啦");
      // let oldTasks = [...tasks];
      // let newTasks = initTasks();
      // let concatTask = oldTasks.concat(newTasks);
      // setTasks(concatTask);
    },
    { wait: 500 }
  );

  const themeConfig: any = useMemo(() => {
    return {
      bgColor: "transparent",
      tableHeaderColor: "red",
      tableHeaderBg: "red",
      tableBorderColor: "red",
    };
  }, []);

  const reLoadVarClass: any = useMemo(() => {
    return {
      "--table-border-color": "red",
      "--header-hover-color": "red",
      "--tools-background": "red",
      "--tools-text-color": "red",
    };
  }, []);

  return (
    <div style={reLoadVarClass}>
      <Gantt
        tasks={tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        ganttHeight={300}
        columnWidth={columnWidth}
        columns={columns}
        onChangeColumnWidth={onChangeColumnWidth}
        onScrollBottom={run}
        themeConfig={themeConfig}
        hiddenPercent={false}
      >
        <ViewSwitcher
          onViewModeChange={viewMode => setView(viewMode)}
          changeScrollCurrent={() => {}}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
        />
      </Gantt>
    </div>
  );
};

export default App;
