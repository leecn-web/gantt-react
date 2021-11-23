import React from "react";
import styles from "./taskListHeader.module.css";

const TaskListHeaderItem: React.FC<{
  index: number;
  lastIndex: boolean;
  item: any;
  alignValue: string;
}> = props => {
  const { index, lastIndex, item, alignValue } = props;
  return (
    <div
      id={`column${item.name}`}
      key={item.name}
      className={styles.ganttTable_HeaderItem}
      style={{
        minWidth: item.minWidth,
        maxWidth: item.maxWidth,
        width: item.width || item.maxWidth,
        justifyContent: alignValue,
        paddingLeft: item.align === "center" ? "0px" : "10px",
      }}
    >
      {!lastIndex && (
        <div
          id={`column${index}`}
          data-id={item.name}
          className={styles.ganttTable_HeaderItem_reSize}
        >
          <div className={styles.ganttTable_HeaderItem_reSize_Inner} />
        </div>
      )}
      {props.children}
    </div>
  );
};

export default TaskListHeaderItem;
