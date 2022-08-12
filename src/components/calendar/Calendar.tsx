import React, { ReactChild } from "react";
import dayjs from "dayjs";
import { ViewMode } from "../../types/PublicTypes";
import { TopPartOfCalendar } from "./TopPartOfCalendar";
import {
  getCachedDateTimeFormat,
  getDaysInMonth,
} from "../../helpers/DateHelper";
import { DateSetup } from "../../types/DateSetup";
import styles from "./calendar.module.css";

import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.extend(isoWeek);

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
  themeConfig: any;
  scrollRight: { left: number; top: number };
  setSDate: any;
};

export const Calendar: React.FC<CalendarProps> = ({
  dateSetup,
  locale,
  viewMode,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
  themeConfig,
  scrollRight,
  setSDate,
}) => {
  const getCalendarValuesForMonth = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.35;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const now = new Date();
      let isNow = false;
      if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() + 1 === now.getMonth() + 1
      ) {
        isNow = true;
      }
      const bottomValue = `${date.getMonth() + 1}月`;
      if (isNow) {
        bottomValues.push(
          <rect
            key={bottomValue + date.getFullYear() + date.getMonth() + 1}
            width={40}
            height={26}
            rx="13"
            x={columnWidth * i + columnWidth * 0.5 - 20}
            y={45}
            style={{ fill: "var(--primary-color)" }}
          />
        );
      }
      bottomValues.push(
        <text
          key={`${bottomValue}-${date.getFullYear()}`}
          y={headerHeight * 0.846}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
          style={{ fill: isNow ? "#fff" : themeConfig.h2Color }}
        >
          {bottomValue}
        </text>
      );

      if (scrollRight.left > columnWidth * i) {
        setSDate(`${date.getFullYear()}年`);
      }

      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = `${date.getFullYear()}年`;
        let xText: number;
        if (rtl) {
          xText = (i + date.getMonth() + 1) * columnWidth + columnWidth;
        } else {
          xText = (i - date.getMonth()) * columnWidth + columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={42}
            xText={xText}
            yText={topDefaultHeight}
            themeConfig={themeConfig}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    let weeksCount: number = 1;
    const topDefaultHeight = headerHeight * 0.35;
    const dates = dateSetup.dates;
    let month = null;
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      let topValue = "";

      // bottom
      const bottomValue = `第${dayjs(date.valueOf()).isoWeek()}周`;

      bottomValues.push(
        <text
          key={`${bottomValue}-${date.getFullYear()}`}
          y={headerHeight * 0.846}
          x={columnWidth * i - columnWidth * 0.5}
          // x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          style={{ fill: themeConfig.h2Color }}
        >
          {bottomValue}
        </text>
      );

      const now = new Date();
      let isNow = false;
      if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() + 1 === now.getMonth() + 1 &&
        dayjs(date.valueOf()).isoWeek() === dayjs(now.getTime()).isoWeek()
      ) {
        isNow = true;
      }
      if (isNow) {
        bottomValues.push(
          <rect
            key={`${bottomValue}-${date.getFullYear()}-today`}
            width={60}
            height={26}
            rx="13"
            x={columnWidth * i + (columnWidth * 0.5 - 30)}
            y={45}
            style={{ fill: "var(--primary-color)" }}
          />
        );
        bottomValues.push(
          <text
            key={`${bottomValue}-${date.getFullYear()}`}
            y={headerHeight * 0.846}
            x={columnWidth * i + columnWidth * 0.5}
            // x={columnWidth * (i + +rtl)}
            className={styles.calendarBottomText}
            style={{ fill: "#fff" }}
          >
            {`第${dayjs(dates[i + 1].valueOf()).isoWeek()}周`}
          </text>
        );
      }

      // if last day is new month
      if (
        i === 0 ||
        month !== `${date.getFullYear()}年${date.getMonth() + 1}月`
      ) {
        // top
        topValue = `${date.getFullYear()}年${date.getMonth() + 1}月`;
        month = `${date.getFullYear()}年${date.getMonth() + 1}月`;
        topValues.push(
          <TopPartOfCalendar
            key={`${bottomValue}-${date.getFullYear()}`}
            value={topValue}
            x1Line={columnWidth * i + weeksCount * columnWidth}
            y1Line={0}
            xText={columnWidth * i + columnWidth * 0.5}
            y2Line={42}
            yText={topDefaultHeight}
            themeConfig={themeConfig}
          />
        );
        weeksCount = 0;
      }

      if (columnWidth * i + weeksCount * columnWidth > scrollRight.left) {
        setSDate(`${date.getFullYear()}年${date.getMonth() + 1}月`);
      }
      weeksCount++;
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.35;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = date.getDate().toString();

      const now = new Date();
      let isNow = false;
      if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() + 1 === now.getMonth() + 1 &&
        date.getDate().toString() === now.getDate().toString()
      ) {
        isNow = true;
      }
      if (isNow) {
        bottomValues.push(
          <rect
            key={`${bottomValue}-${
              date.getMonth() + 1
            }-${date.getFullYear()}-today`}
            width={32}
            height={26}
            rx="13"
            x={columnWidth * i + columnWidth * 0.5 - 16}
            y={45}
            style={{ fill: "var(--primary-color)" }}
          />
        );
      }

      bottomValues.push(
        <text
          key={`${bottomValue}-${date.getMonth() + 1}-${date.getFullYear()}`}
          y={headerHeight * 0.846}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
          style={{ fill: isNow ? "#fff" : themeConfig.h2Color }}
        >
          {bottomValue}
        </text>
      );

      if (scrollRight.left > columnWidth * (i + 1)) {
        setSDate(`${date.getFullYear()}年${date.getMonth() + 1}月`);
      }

      if (
        i + 1 !== dates.length &&
        date.getMonth() !== dates[i + 1].getMonth()
      ) {
        const topValue = `${date.getFullYear()}年${date.getMonth() + 1}月`;

        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * (i + 1)}
            y1Line={0}
            y2Line={42}
            xText={
              columnWidth * (i + 1) -
              getDaysInMonth(date.getMonth(), date.getFullYear()) *
                columnWidth +
              columnWidth
            }
            yText={topDefaultHeight}
            themeConfig={themeConfig}
          />
        );
      } else if (i === dates.length - 1) {
        const topValue = `${date.getFullYear()}年${date.getMonth() + 1}月`;

        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * (i + 1)}
            y1Line={0}
            y2Line={42}
            xText={
              (columnWidth * (i + 1) -
                getDaysInMonth(date.getMonth(), date.getFullYear()) *
                  columnWidth) *
                2 +
              columnWidth
            }
            yText={topDefaultHeight}
            themeConfig={themeConfig}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForOther = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = headerHeight * 0.35;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      const now = new Date();
      let isNow = false;
      if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() + 1 === now.getMonth() + 1 &&
        date.getDate().toString() === now.getDate().toString()
      ) {
        isNow = true;
      }
      if (isNow) {
        bottomValues.push(
          <rect
            key={bottomValue + date.getTime()}
            width={32}
            height={26}
            rx="13"
            x={columnWidth * i + columnWidth * 0.5 - 16}
            y={45}
            style={{ fill: "var(--primary-color)" }}
          />
        );
      }

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.83}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
          style={{ fill: isNow ? "#fff" : themeConfig.h2Color }}
        >
          {`${bottomValue}:00`}
        </text>
      );
      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        const topValue = `${date.getMonth() + 1}月${date.getDate()}日`;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i + ticks * columnWidth}
            y1Line={0}
            y2Line={42}
            xText={columnWidth * i + ticks * columnWidth * 0.5}
            yText={topDefaultHeight}
            themeConfig={themeConfig}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  let topValues: ReactChild[] = [];
  let bottomValues: ReactChild[] = [];
  switch (dateSetup.viewMode) {
    case ViewMode.Month:
      [topValues, bottomValues] = getCalendarValuesForMonth();
      break;
    case ViewMode.Week:
      [topValues, bottomValues] = getCalendarValuesForWeek();
      break;
    case ViewMode.Day:
      [topValues, bottomValues] = getCalendarValuesForDay();
      break;
    default:
      [topValues, bottomValues] = getCalendarValuesForOther();
      break;
  }
  return (
    <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
      <rect
        x={0}
        y={0}
        width={columnWidth * dateSetup.dates.length}
        height={headerHeight + 1}
        className={styles.calendarHeader}
      />
      <rect
        x={0}
        y={42}
        width={columnWidth * dateSetup.dates.length}
        height={32}
        style={{ fill: "transparent" }}
      />
      {bottomValues}
      <line
        x="0"
        y1="42"
        x2="100%"
        y2="43"
        className={styles.calendarLine}
        style={{ stroke: themeConfig.tableBorderColor }}
      />
      <line
        x="0"
        y1="74"
        x2="100%"
        y2="75"
        className={styles.calendarLine}
        style={{ stroke: themeConfig.tableBorderColor }}
      />
      {/* <line x="0" y1="45" x2="100%" y2="50" className="_3rUKi" /> */}
      {topValues}
    </g>
  );
};
