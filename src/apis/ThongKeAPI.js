import axios from "axios";
import { Config } from "../config";

export default class ThongKeAPI {

  static getThongKe = (data) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/khoa-tuyen-sinh/thong-ke`,
      params: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
}