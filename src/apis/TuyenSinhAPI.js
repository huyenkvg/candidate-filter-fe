import axios from "axios";
import { Config } from "../config";

export default class TuyenSinhAPI {

  static getDanhSachKhoaTuyenSinh = (nameOnly, payload) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/khoa-tuyen-sinh${nameOnly ? '?nameOnly=true' : ''}`,
      params: { ...payload },
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })

  }
  static DIEMCHUAN_DUKIEN = (maDotTuyenSinh) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/dot-tuyen-sinh/danh-sach-diem-chuan/${maDotTuyenSinh}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static saveDiemChuan = (maDotTuyenSinh, payload) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh/danh-sach-diem-chuan/${maDotTuyenSinh}`,
      data: payload,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }

  static createKhoaTuyenSinh = (data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/khoa-tuyen-sinh`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static updateKhoaTuyenSinh = (data) => {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/khoa-tuyen-sinh`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static deleteKhoaTuyenSinh = (data) => {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/khoa-tuyen-sinh/${data.maKhoa}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static getDSTTKhoaTuyenSinh = (data) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/khoa-tuyen-sinh-trung-tuyen/${data.maKhoa}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static createDotTuyenSinh = (data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static updateDotTuyenSinh = (data) => {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/dot-tuyen-sinh`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static deleteDotTuyenSinh = (data) => {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/dot-tuyen-sinh/${data.maDotTuyenSinh}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }

  static getDSXTDotTuyenSinh = (id) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/dot-tuyen-sinh/dsxt/${id}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static getDSTTDotTuyenSinh = (id) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/dot-tuyen-sinh/dstt/${id}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static getThongTinDotTuyenSinh = (id) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/dot-tuyen-sinh/${id}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  // =================== NGANH =======================================
  static getDanhSachNganh = (data) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/nganh`,
      params: { ...data},
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static createNganh = (data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/nganh`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static updateNganh = (data) => {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/nganh/${data.maNganh}`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static deleteNganh = (data) => {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/nganh/${data.maNganh}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }

  static getDanhSachToHopXetTuyen = (data) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/to-hop-xet-tuyen`,
      params: { ...data},
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static createToHopXetTuyen = (data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/to-hop-xet-tuyen`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static updateToHopXetTuyen = (data) => {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/to-hop-xet-tuyen`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static deleteToHopXetTuyen = (data) => {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/to-hop-xet-tuyen/${data.maToHop}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  
  static updateChiTieuTuyenSinh = (maDotTuyenSinh, data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh/update-chi-tieu/${maDotTuyenSinh}`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static upload_DSNguyenVong_DotTuyenSinh = (maDotTuyenSinh, data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh/upfile/${maDotTuyenSinh}`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })

  }
  static saveDSXT_DotTuyenSinh = (maDotTuyenSinh, data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh/save-dsxt/${maDotTuyenSinh}`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static saveTuyenThang = (maDotTuyenSinh, data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh/tuyen-thang/${maDotTuyenSinh}`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  static upload_XACNHAN_NHAPHOC = (maDotTuyenSinh, data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh/upfile-xac-nhan-nhap-hoc/${maDotTuyenSinh}`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })

  }
  static XACNHAN_NHAPHOC = (maDotTuyenSinh, data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/dot-tuyen-sinh/xac-nhan-nhap-hoc/${maDotTuyenSinh}`,
      data: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })

  }
  //================================================================
  static getDanhSachHoSo = (params) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/thong-tin-ca-nhan`,
      params: params,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
  //================================================================
  static deleteAllHoSo = (khoa) => {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/thong-tin-ca-nhan/delete-all-by-khoa/${khoa}`,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },
    })
  }
}