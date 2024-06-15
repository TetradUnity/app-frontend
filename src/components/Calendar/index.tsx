import dayjs, { Dayjs } from 'dayjs';
import objectPlugin from "dayjs/plugin/toObject";
import isTodayPlugin from "dayjs/plugin/isToday";
import weekdayPlugin from "dayjs/plugin/weekday";
import React, { useEffect, useState } from 'react';

import "./style.css";
import { Button } from 'antd';

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useDeviceStore } from '@/stores/deviceStore';

dayjs.extend(weekdayPlugin);

dayjs.extend(objectPlugin);
dayjs.extend(isTodayPlugin);

type DateObject = {
  day: number,
  month: number,
  year: number,
  isCurrentMonth: boolean,
  isCurrentDay: boolean
}

type CellProps  = {
  year: number,
  month: number,
  day: number,
};

type Props = {
  cellRenderer: React.FunctionComponent<CellProps>,
  initialDate?: Dayjs,
  onChange?: (newDate: Dayjs) => void,
  onCellClick?: (cell: CellProps) => void
};
export default function Calendar({cellRenderer : CellRenderer, initialDate, onChange: onChangeCallback, onCellClick: onCellClickCallback} : Props) {
  const now = dayjs();
  const [currentMonth, setCurrentMonth] = useState(initialDate || now);
  const [arrayOfDays, setArrayOfDays] = useState<{ dates: DateObject[] }[]>([]);

  const deviceType = useDeviceStore(state => state.type);

  const nextMonth = () => {
    const plus = currentMonth.add(1, "month");
    setCurrentMonth(plus);
    
    if (onChangeCallback) {
      onChangeCallback(plus.clone());
    }
  };

  const prevMonth = () => {
    const minus = currentMonth.subtract(1, "month");
    setCurrentMonth(minus);

    if (onChangeCallback) {
      onChangeCallback(minus.clone());
    }
  };

  const formateDateObject = (date: Dayjs) => {
    const clonedObject = { ...date.toObject() };
    const formatedObject: DateObject = {
      day: clonedObject.date,
      month: clonedObject.months,
      year: clonedObject.years,
      isCurrentMonth: clonedObject.months === currentMonth.month(),
      isCurrentDay: date.isToday(),
    };

    return formatedObject;
  };

  const getAllDays = () => {
    let currentDate = currentMonth.startOf("month").weekday(0);
    const nextMonth = currentMonth.add(1, "month").month();
    let allDates = [];
    let weekDates = [];
    let weekCounter = 1;

    while (currentDate.weekday(0).toObject().months !== nextMonth) {
      const formated = formateDateObject(currentDate);
      weekDates.push(formated);

      if (weekCounter === 7) {
        allDates.push({ dates: weekDates });
        weekDates = [];
        weekCounter = 0;
      }

      weekCounter++;
      currentDate = currentDate.add(1, "day");
    }

    setArrayOfDays(allDates);
  };

  const renderHeader = () => {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="cd_header cd_row cd_flex-middle">
        <div className="cd_col cd_col-start">
          <Button
            className="cd_icon"
            shape="circle"
            type="dashed"
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={prevMonth}
          />
        </div>
        <div className="cd_col cd_col-center">
          <span>{currentMonth.format(dateFormat)}</span>
        </div>
        <div className="cd_col cd_col-end" onClick={nextMonth}>
          <Button
            className="cd_icon"
            shape="circle"
            type="dashed"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={nextMonth}
          />
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = deviceType == "mobile" ? "dd" : "dddd";
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="cd_col cd_col-center" key={i}>
          {now.weekday(i).format(dateFormat)}
        </div>
      );
    }
    return <div className="cd_days cd_row">{days}</div>
  };

  const renderCells = () => {
    const rows: React.ReactElement[] = [];
    let days: React.ReactElement[] = [];

    arrayOfDays.forEach((week, index) => {
      week.dates.forEach((d, i) => {
        let props: CellProps = {
          year: d.year, month: d.month, day: d.day
        };

        days.push(
          <div onClick={() => onCellClickCallback && onCellClickCallback(props)} className={`cd_col cd_cell ${!d.isCurrentMonth ? "cd_disabled" :
            d.isCurrentDay ? "cd_selected" : ""}`} key={i}>
            <span className="cd_number">{d.day}</span>
            <span className="cd_bg">{d.day}</span>

            {CellRenderer &&
              <CellRenderer {...props} />
            }
          </div>
        );
      });
      rows.push(
        <div className="cd_row" key={index}>
          {days}
        </div>
      );
      days = [];
    });
    return <div className="cd_body">{rows}</div>;
  };

  useEffect(() => {
    getAllDays();
  }, [currentMonth]);

  return (
    <div className="cd_calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}