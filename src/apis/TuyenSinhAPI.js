import axios from "axios";
import { Config } from "../config";

export default class TuyenSinhAPI {

  static getDanhSachKhoaTuyenSinh = (nameOnly) => {
    return axios.get(`http://localhost:3000/khoa-tuyen-sinh${nameOnly ? '?nameOnly=true' : ''}`);
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
      method: "PATCH",
      url: `http://localhost:3000/khoa-tuyen-sinh`,
      data: data
    })
  }
  static deleteKhoaTuyenSinh = (data) => {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/khoa-tuyen-sinh/${data.maKhoa}`,
    })
  }
  static getDSTTKhoaTuyenSinh = (data) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/khoa-tuyen-sinh-trung-tuyen/${data.maKhoa}`,
    })
  }
  static createDotTuyenSinh = (data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh`,
      data: data
    })
  }
  static updateDotTuyenSinh = (data) => {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/dot-tuyen-sinh`,
      data: data
    })
  }
  static deleteDotTuyenSinh = (data) => {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/dot-tuyen-sinh/${data.maDotTuyenSinh}`,
    })
  }

  static getDSXTDotTuyenSinh = (id) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/dot-tuyen-sinh/dsxt/${id}`,
    })
  }
  static getDSTTDotTuyenSinh = (id) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/dot-tuyen-sinh/dstt/${id}`,
    })
  }
  static getThongTinDotTuyenSinh = (id) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/dot-tuyen-sinh/${id}`,
    })
  }
  // =================== NGANH =======================================
  static getDanhSachNganh = (data) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/nganh`,
    })
  }
  static createNganh = (data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/nganh`,
      data: data
    })
  }
  static updateNganh = (data) => {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/nganh/${data.maNganh}`,
      data: data
    })
  }
  static deleteNganh = (data) => {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/nganh/${data.maNganh}`,
    })
  }

  static getDanhSachToHopXetTuyen = (data) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/to-hop-xet-tuyen`,
    })
  }
  static createToHopXetTuyen = (data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/to-hop-xet-tuyen`,
      data: data
    })
  }
  static updateToHopXetTuyen = (data) => {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/to-hop-xet-tuyen`,
      data: data
    })
  }
  static deleteToHopXetTuyen = (data) => {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/to-hop-xet-tuyen/${data.maToHop}`,
    })
  }
  
  static updateChiTieuTuyenSinh = (maDotTuyenSinh, data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh/update-chi-tieu/${maDotTuyenSinh}`,
      data: data
    })
  }
  static upload_DSNguyenVong_DotTuyenSinh = (maDotTuyenSinh, data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh/upfile/${maDotTuyenSinh}`,
      data: data
    })

  }
  static saveDSXT_DotTuyenSinh = (maDotTuyenSinh, data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh/save-dsxt/${maDotTuyenSinh}`,
      data: data
    })
  }
  //================================================================
  static getDanhSachHoSo = (params) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/thong-tin-ca-nhan`,
      params: params
    })
  }
}