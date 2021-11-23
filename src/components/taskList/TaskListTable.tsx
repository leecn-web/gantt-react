// import React, { useMemo } from "react";
import React from "react";
import styles from "./taskListTable.module.css";
import { Task } from "../../types/PublicTypes";

// const localeDateStringCache = {};
// const toLocaleDateStringFactory = (locale: string) => (
//   date: Date,
//   dateTimeOptions: Intl.DateTimeFormatOptions
// ) => {
//   const key = date.toString();
//   let lds = localeDateStringCache[key];
//   if (!lds) {
//     lds = date.toLocaleDateString(locale, dateTimeOptions);
//     localeDateStringCache[key] = lds;
//   }
//   return lds;
// };
// const dateTimeOptions: Intl.DateTimeFormatOptions = {
//   weekday: "short",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// };

export const TaskListTableDefault: React.FC<{
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
}> = ({
  rowHeight,
  // rowWidth,
  tasks,
  fontFamily,
  fontSize,
  // locale,
  columns,
  selectedTaskId,
  setSelectedTask,
  // onExpanderClick,
}) => {
  // const toLocaleDateString = useMemo(() => toLocaleDateStringFactory(locale), [
  //   locale,
  // ]);
  const showAlignValue = (item: { align: string }) => {
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
  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map(t => {
        // let expanderSymbol = "";
        // if (t.hideChildren === false) {
        //   expanderSymbol = "▼";
        // } else if (t.hideChildren === true) {
        //   expanderSymbol = "▶";
        // }
        return (
          <div
            className={styles.taskListTableRow}
            style={{
              height: rowHeight,
              backgroundColor:
                selectedTaskId === t.id ? "rgba(61, 84, 253, 0.1)" : "#fff",
            }}
            key={`${t.id}row`}
            onClick={() => setSelectedTask(t.id)}
          >
            {columns.map(item => {
              const Render = item.onrender;
              const alignValue = showAlignValue(item);
              return (
                <div
                  key={item.name}
                  className={styles.taskListCell}
                  style={{
                    minWidth: item.minWidth,
                    maxWidth: item.maxWidth,
                    width: item.width || item.maxWidth,
                    justifyContent: alignValue,
                  }}
                >
                  <div className={styles.taskListNameWrapper}>
                    {/* <div
                      className={
                        expanderSymbol
                          ? styles.taskListExpander
                          : styles.taskListEmptyExpander
                      }
                      onClick={() => onExpanderClick(t)}
                    >
                      {expanderSymbol}
                    </div> */}
                    <div>
                      <Render data={t} />
                    </div>
                  </div>
                </div>
              );
            })}
            {/* <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.end, dateTimeOptions)}
            </div> */}
          </div>
        );
      })}
    </div>
  );
};
