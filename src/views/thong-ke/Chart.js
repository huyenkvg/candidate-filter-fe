import "./styles.css";
import React, { PureComponent, useEffect, useState } from "react";
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
    name: "2017",
    'nguyện vọng': 4931,
    'trúng tuyển': 595,
    amt: 2400
  },
  {
    name: "2018",
    'nguyện vọng': 4931,
    'trúng tuyển': 595,
    amt: 2400
  },
  {
    name: "2019",
    'nguyện vọng': 4931,
    'trúng tuyển': 595,
    amt: 2400
  },

];
const data = [
  { name: 'Ngành Công Nghệ Thông Tin', value: 400 },
  { name: 'Ngành Công Nghệ Đa Phương Tiện', value: 300 },
  { name: 'Ngành An toàn thông tin', value: 300 },
  { name: 'Ngành Kế Toán', value: 200 },
  { name: 'Ngành Marketing', value: 200 },
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
      <PieChart width={600} height={350}>
        <Pie
          data={props.data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index
          }) => {
            console.log("handling label?");
            const RADIAN = Math.PI / 180;
            // eslint-disable-next-line
            const radius = 25 + innerRadius + (outerRadius - innerRadius);
            // eslint-disable-next-line
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            // eslint-disable-next-line
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="#8884d8"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {data[index].name} ({value})
              </text>
            );
          }}
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
  const [data, setData] = useState({
    data_bar: [],
    data_pie: []
  });
  console.log('props :>> ', props);
  useEffect(() => {
    console.log('khoa_start :>> ', khoa_start);
    console.log('khoa_end :>> ', khoa_end);
    console.log('mode :>> ', mode);

    ThongKeAPI.getThongKe({ khoa_start, khoa_end, mode, ...props })
    .then(res => {
        console.log('res :>> ', res.data.map(item => {
          return {
            name: item.tenKhoa,
            'nguyện vọng': item.count_nguyen_vong,
            'trúng tuyển': item.count_trung_tuyen,
            amt: 2400
          }
        }));
      setData({
        ...data,
        data_bar: res.data.map(item => {
          return {
            name: item.tenKhoa,
            'nguyện vọng': item.count_nguyen_vong,
            'trúng tuyển': item.count_trung_tuyen,
            amt: 2400
          }
        }),

      })
    })
    .catch(err => {
        // console.log('err :>> ', err);
      })


  }, [khoa_start, khoa_end, mode])

  return (
    <>
      <Col span={12} gridTemplateColumns="repeat(12, 1fr)" style={{ flexGrow: 1, boxShadow: '0 6px 10px -4px rgb(0 0 0 / 25%)', borderRadius: 2 }} >
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            width={500}
            height={300}
            data={data.data_bar}
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
            <Bar dataKey='trúng tuyển' stackId="a" fill="#8884d8" />
            <Bar dataKey="nguyện vọng" stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Col>
      <Col span={12} gridTemplateColumns="repeat(12, 1fr)" style={{ flexGrow: 1, boxShadow: '0 6px 10px -4px rgb(0 0 0 / 25%)', borderRadius: 2 }} >
        <ResponsiveContainer width="100%" height={350}>
          <NganhPieChart data={data.data_pie} />
        </ResponsiveContainer>
      </Col>
    </>
  );
}
