import React, { SyntheticEvent, useEffect } from "react";
import styles from "./horizontalScroll.module.css";

export const HorizontalScroll: React.FC<{
  scroll: number;
  svgWidth: number;
  taskListWidth: number;
  rtl: boolean;
  scrollRef: any;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}> = ({ scroll, svgWidth, taskListWidth, rtl, scrollRef, onScroll }) => {
  // const scrollRef = useRef<HTMLDivElement>(null);

  // // 节流
  // const useThrottle = (fn: (e: any) => void, delay: number, dep = []) => {
  //   const { current }: any = useRef({ fn, timer: null });
  //   useEffect(() => {
  //     current.fn = fn;
  //   }, [fn]);
  //   return useCallback((...args) => {
  //     if (!current.timer) {
  //       current.timer = setTimeout(() => {
  //         delete current.timer;
  //       }, delay);
  //       current.fn(...args);
  //     }
  //   }, dep);
  // };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scroll;
    }
  }, [scroll]);

  return (
    <div
      dir="ltr"
      style={{
        margin: rtl
          ? `-9px ${taskListWidth}px 0px 0px`
          : `-9px 0px 0px ${taskListWidth}px`,
      }}
      className={styles.scroll}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <div style={{ width: svgWidth, height: 1 }} />
    </div>
  );
};
