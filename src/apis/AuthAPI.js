import axios from "axios";
import { Config } from "../config";

export default class AuthAPI {
  static getDanhSachAccount = (data) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/users`,
      params: data,
      headers: {
        Authorization: `Bearer ` + localStorage.getItem('token'),
      },

    })
  }
  static createAccount = (data) => {
    return axios.post(`http://localhost:3000/users/create`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "accept": 'application/json',
          Authorization: `Bearer ` + localStorage.getItem('token'),
        },
      }
    )
  }
  static updateAccount = (id, data) => {
    return axios.patch(`http://localhost:3000/users/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "accept": 'application/json',
          Authorization: `Bearer ` + localStorage.getItem('token'),
        },
      }
    )
  }
  static updateProfile = (id, data) => {
    return axios.patch(`http://localhost:3000/users/update-profile/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "accept": 'application/json',
          Authorization: `Bearer ` + localStorage.getItem('token'),
        },
      }
    )
  }

}