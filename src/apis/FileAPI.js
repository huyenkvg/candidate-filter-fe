import axios from "axios";
import { Config } from "../config";

export default class FileAPI {
  static upload_DSChiTieu = (data, save, maDotTuyenSinh) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/file-handler/upload-chi-tieu${save ? ("?save=true" + "&maDotTuyenSinh=" + maDotTuyenSinh) : ""}`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static GET_DSXT_DOT_TUYEN_SINH = (maDotTuyenSinh) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/dot-tuyen-sinh/dsxt/${maDotTuyenSinh}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static GET_DSTT_DOT_TUYEN_SINH = (maDotTuyenSinh) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/dot-tuyen-sinh/dstt/${maDotTuyenSinh}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
}