import "./styles.css";
import React, { PureComponent, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart, Pie, Sector, Cell
} from "recharts";
import { Col } from "antd";
import ThongKeAPI from "../../apis/ThongKeAPI";

const data1 = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
];
const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function NganhPieChart(props) {
  return (
    <>
      <PieChart width={500} height={200}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>

    </>
  );

}





export default function Chart({ khoa_start, khoa_end, mode, ...props }) {
  console.log('props :>> ', props);
  useEffect(() => {
    console.log('khoa_start :>> ', khoa_start);
    console.log('khoa_end :>> ', khoa_end);
    console.log('mode :>> ', mode);

    ThongKeAPI.getThongKe({ khoa_start, khoa_end, mode, ...props })
    .then(res => {
        console.log('res :>> ', res);
      })
    .catch(err => {
        console.log('err :>> ', err);
      })

  }, [khoa_start, khoa_end, mode])

  return (
    <>
      <Col span={15} gridTemplateColumns="repeat(12, 1fr)" style={{ flexGrow: 1, boxShadow: '0 6px 10px -4px rgb(0 0 0 / 25%)', borderRadius: 2 }} >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            width={500}
            height={300}
            data={data1}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" stackId="a" fill="#8884d8" />
            <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Col>
      <Col span={9} gridTemplateColumns="repeat(12, 1fr)" style={{ flexGrow: 1, boxShadow: '0 6px 10px -4px rgb(0 0 0 / 25%)', borderRadius: 2 }} >
        <ResponsiveContainer width="100%" height={250}>
          <NganhPieChart />
        </ResponsiveContainer>
      </Col>
    </>
  );
}
