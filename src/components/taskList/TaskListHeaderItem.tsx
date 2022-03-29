import React, { useMemo } from "react";
import styles from "./taskListHeader.module.css";

const TaskListHeaderItem: React.FC<{
  index: number;
  lastIndex: boolean;
  item: any;
  alignValue: string;
  themeConfig: any;
  type: string;
}> = props => {
  const { index, lastIndex, item, alignValue, themeConfig, type } = props;
  const width = useMemo(() => {
    if (type === "mobile") {
      return "fit-content";
    } else {
      return item.width;
    }
  }, [item.width, type]);
  return (
    <div
      id={`column${item.name}-${index}`}
      key={item.name}
      className={styles.ganttTable_HeaderItem}
      style={{
        // minWidth: item.minWidth,
        // maxWidth: item.maxWidth,
        width: width || item.maxWidth,
        justifyContent: alignValue,
        paddingLeft: item.align === "center" ? "0px" : "10px",
        borderRightWidth: !lastIndex ? "1px" : "0px",
        borderColor: themeConfig.tableBorderColor,
      }}
    >
      {!lastIndex && (
        <div
          id={`column-${index}`}
          data-id={item.name}
          data-last={item.isLast}
          className={styles.ganttTable_HeaderItem_reSize}
        >
          {/* <div
            className={styles.ganttTable_HeaderItem_reSize_Inner}
            style={{ backgroundColor: themeConfig.tableBorderColor }}
          /> */}
        </div>
      )}
      {props.children}
    </div>
  );
};

export default TaskListHeaderItem;
