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
  PieChart, Pie, Sector, Cell, LineChart, Line
} from "recharts";
import { Col } from "antd";
import ThongKeAPI from "../../apis/ThongKeAPI";


const COLORS = ['#546e7a', '#64dd17', '#ec407a', '#0088FE', '#651fff', '#00C49F', '#FFBB28', '#795548', '#FF8042'];

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

function LineChartDiem(props) {
  const data =(props.data);
  let lines = {};
  const values = data.reduce((resp, item) => {
    const { maNganh, tenKhoa, tenDotTuyenSinh, diemChuan, tenNganh } = item;
    lines[tenNganh] = [tenNganh]
    let acc = resp.find((item) => item.name == tenKhoa+"-"+ tenDotTuyenSinh);   
    if (!acc) { 
      acc={};
      acc[tenNganh] = diemChuan;
      acc['name'] = tenKhoa+"-"+ tenDotTuyenSinh;
      resp.push(acc);
    }
    else {
      acc[tenNganh] = diemChuan;
      resp[resp.findIndex((item) => item.name === tenKhoa+"-"+ tenDotTuyenSinh)] = acc;
    }
    return resp;
  }, []);
  console.log('data  values :>> ', values);
  console.log('data  lines :>> ', lines);

  return (

    <ResponsiveContainer width="100%" height={350}>
    <LineChart width={1300} height={250} data={values}
      margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      <Legend /> 
      {Object.keys(lines).map((item, index) => (
        <Line key={index}  dataKey={item} stroke={COLORS[index % COLORS.length]} activeDot={{ r: 8 }} />
        ))}
    </LineChart></ResponsiveContainer>
  )
}
function NganhPieChart(props) {
  return (
    <>
      <h4 style={{ textAlign: 'center' }}>Chỉ tiêu tuyển các ngành</h4>
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
            // console.log("handling label?", index);
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
                fill={COLORS[index % COLORS.length]}
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {props.data[index]?.name} ({value})
              </text>
            );
          }}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>

    </>
  );

}





export default function Chart({ khoa_start, khoa_end, mode, onGetData, ...props }) {
  const [data, setData] = useState({
    bar: [],
    pie: [],
    danh_sach_diem_chuan: []
  });
  console.log('props :>> ', props);
    console.log('khoa_start :>> ', khoa_start);
    console.log('khoa_end :>> ', khoa_end);
    console.log('mode :>> ', mode);
  useEffect(() => {
    if (!khoa_start || !khoa_end) return;
    ThongKeAPI.getThongKe({ khoa_start, khoa_end, mode, ...props })
    .then(res => {
      console.log('res :>> ', res.data.pie);
      onGetData(res.data.bar)
      setData({
        ...data,
        bar: res.data.bar.map(item => ({
          ...item,
          'Số lượng trúng tuyển': item.count_trung_tuyen,
          'Số lượng nguyện vọng': item.count_nguyen_vong
        })),
        pie: res.data.pie.map(item => ({
          name: item.tenNganh,
          value: item.chi_tieu_tuyen
        })),
        danh_sach_diem_chuan: res.data.danh_sach_diem_chuan,
        // .map(item => {
        //   return
          // {
          //   name: item.tenKhoa,
          //   'nguyện vọng': item.count_nguyen_vong,
          //   'trúng tuyển': item.count_trung_tuyen,
          //   amt: 2400
          // }
        // }),

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
            data={data.bar}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tenKhoa" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='Số lượng trúng tuyển' stackId="a" fill='#ff9800' />
            <Bar dataKey="Số lượng nguyện vọng" stackId="a" fill="#607d8b" />
          </BarChart>
        </ResponsiveContainer>
      </Col>
      <Col span={12} gridTemplateColumns="repeat(12, 1fr)" style={{ flexGrow: 1, boxShadow: '0 6px 10px -4px rgb(0 0 0 / 25%)', borderRadius: 2 }} >
        <ResponsiveContainer width="100%" height={350}>
          <NganhPieChart data={data.pie} />
        </ResponsiveContainer>
      </Col>
        <LineChartDiem data={data.danh_sach_diem_chuan} />
    </>
  );
}
