import React, { SyntheticEvent, useEffect } from "react";
import styles from "./verticalScroll.module.css";

export const VerticalScroll: React.FC<{
  listCellWidth: string;
  ganttFullHeight: number;
  headerHeight: number;
  scrollRef: any;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}> = ({
  listCellWidth,
  ganttFullHeight,
  headerHeight,
  scrollRef,
  onScroll,
}) => {
  // const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = !!listCellWidth;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scroll;
    }
  }, [scroll]);
  return (
    <div
      style={{
        height: "calc(100% - 76px)",
        marginTop: headerHeight,
        left: isMobile ? "445px" : "100%",
        marginLeft: "-17px",
      }}
      className={styles.scroll}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <div style={{ height: ganttFullHeight, width: 1 }} />
    </div>
  );
};
