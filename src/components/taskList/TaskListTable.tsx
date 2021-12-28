// import React, { useMemo } from "react";
import React, { ReactElement } from "react";
import styles from "./taskListTable.module.css";
import { Task } from "../../types/PublicTypes";
// const { HDYIcon } = window.PlatformSDK?.Widget || null;

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
  themeConfig: any;
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
  themeConfig,
  setSelectedTask,
  onExpanderClick,
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
        let expanderSymbol: ReactElement;
        if (t.hideChildren === false) {
          expanderSymbol = (
            // <i className="iconfont">&#xe654;</i>
            <i
              className={`iconfont iconxiala`}
              style={{
                marginRight: "4px",
              }}
            ></i>
          );
        } else if (t.hideChildren === true) {
          expanderSymbol = (
            <i
              className={`iconfont iconxiala-copy`}
              style={{
                marginRight: "4px",
              }}
            ></i>
          );
        }
        let background = "";
        if (selectedTaskId === t.id && themeConfig.tableHeaderColor) {
          background = themeConfig.tableHeaderColor;
        }
        return (
          <div
            className={styles.taskListTableRow}
            style={{
              height: rowHeight,
            }}
            key={`${t.id}row`}
            onClick={() => setSelectedTask(t.id)}
          >
            {columns.map((item, idx) => {
              const Render = item.onrender;
              const alignValue = showAlignValue(item);
              return (
                <div
                  key={`${item.name}-${idx}`}
                  className={styles.taskListCell}
                  style={{
                    minWidth: item.minWidth,
                    maxWidth: item.maxWidth,
                    width: item.width || item.maxWidth,
                    justifyContent: alignValue,
                    paddingLeft:
                      idx === columns.length - 1 && item.isLast === undefined
                        ? 0
                        : "10px",
                    borderColor: themeConfig.tableBorderColor,
                    backgroundColor: background,
                  }}
                >
                  <div className={styles.taskListNameWrapper}>
                    {idx === 0 ? (
                      <div
                        className={
                          expanderSymbol
                            ? styles.taskListExpander
                            : styles.taskListEmptyExpander
                        }
                        style={{ paddingLeft: `${(t?.level || 0) * 20}px` }}
                        onClick={() => onExpanderClick(t)}
                      >
                        {expanderSymbol}
                      </div>
                    ) : null}
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
