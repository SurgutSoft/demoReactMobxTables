import {IDateStats} from "../../intarfaces/IPayments";
import css from "./Payments.module.scss";
import {formatAmount} from "../../utils";
import {Bar, BarChart, ResponsiveContainer, Tooltip} from "recharts";
import React from "react";


interface IChartProps {
  days: Array<IDateStats>
}


export const Chart = ({days}: IChartProps) => {
  return (
    <div className={css.chart}>
      <ResponsiveContainer width="100%" height={50}>
        <BarChart
          data={days.map(item => ({
            date: item.date,
            amount: item.amount
          }))}>
          <Tooltip content={<CustomTooltip/>}/>
          <Bar dataKey="amount" maxBarSize={20} fill="#158dd4" stackId="a"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const CustomTooltip = ({active, payload}: any) => {
  if (active) {
    const data = payload[0].payload;
    return (
      <div className={css.chartTooltip}>
        {data.date}:<br/>
        <strong>{formatAmount(data.amount, 'USD')}</strong>
      </div>
    );
  }

  return null;
};