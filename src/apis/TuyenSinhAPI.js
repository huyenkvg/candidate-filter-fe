import axios from "axios";
import { Config } from "../config";

export default class TuyenSinhAPI {

  static getDanhSachKhoaTuyenSinh = (data) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/khoa-tuyen-sinh`,
    })
  }
  static createKhoaTuyenSinh = (data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/khoa-tuyen-sinh`,
      data: data
    })
  }
  static updateKhoaTuyenSinh = (data) => {
    return axios({
      method: "PUT",
      url: `http://localhost:3000/khoa-tuyen-sinh/${data.id}`,
      data: data
    })
  }
  static deleteKhoaTuyenSinh = (data) => {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/khoa-tuyen-sinh/${data.id}`,
    })
  }
  

}