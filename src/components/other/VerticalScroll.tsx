import React, { SyntheticEvent, useRef, useEffect } from "react";
import styles from "./verticalScroll.module.css";

export const VerticalScroll: React.FC<{
  listCellWidth: string;
  scroll: number;
  ganttHeight: number;
  ganttFullHeight: number;
  headerHeight: number;
  rtl: boolean;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}> = ({
  listCellWidth,
  scroll,
  ganttHeight,
  ganttFullHeight,
  headerHeight,
  rtl,
  onScroll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = !!listCellWidth;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scroll;
    }
  }, [scroll]);
  return (
    <div
      style={{
        height: ganttHeight,
        marginTop: headerHeight,
        left: isMobile ? "445px" : "100%",
        marginLeft: rtl ? "" : "-17px",
      }}
      className={styles.scroll}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <div style={{ height: ganttFullHeight, width: 1 }} />
    </div>
  );
};
