import axios from "axios";
import { Config } from "../config";

export default class AuthAPI {
  static getDanhSachAccount = (data) => {
    return axios({
      method: "GET",
      url: `http://localhost:3000/users`,
    })
  }
  static createAccount = (data) => {
    return axios.post( `http://localhost:3000/users`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "accept": 'application/json',
          "Bearer": localStorage.getItem("token")
        },
      }
    )
  }
}