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

  //================================================== FILE - TẢI - XUẤT ========================================================
  static getExcelFileOf = async (categoryStr, khoa, name) => {
    let url = ``;
    let ex_name = (name || khoa || '') + new Date().toISOString().slice(0, 10);
    switch (categoryStr) {
      case `nguyen-vong-mau`: // TÀi SẢN
        url = `http://127.0.0.1:3000/file-handler/nguyen-vong-mau`;
        break;
      case `chi-tieu`: // NHÂn VIÊN
        url = `http://127.0.0.1:3000/file-handler/chi-tieu`;
        break;
      case `DSTT-KHOA`: // KHO chứa
        url = `http://127.0.0.1:3000/file-handler/report-dstt-khoa/` + khoa;
        break;
      case `DSNV-KHOA`: // KHO chứa
        url = `http://127.0.0.1:3000/file-handler/report-dsnv-khoa/` + khoa;
        break;
      case `DS-HO-SO`: //
        url = `http://127.0.0.1:3000/file-handler/report-ds-hoso-khoa/` + khoa;
        break;
      default:
    }
    return await axios({
      url: url, //your url
      method: `GET`,
      responseType: `blob`, // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement(`a`);
      link.href = url;
      link.setAttribute(`download`, `${categoryStr}_${ex_name}_EXPORT.xlsx`); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  };

}