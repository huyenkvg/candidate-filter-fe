import axios from "axios";
import { Config } from "../config";

export default class CandidateAPI {

  static getCandidatesFromXls = (data) => {
    return  axios({
      method: "POST",
      url: `http://localhost:3000/wish-list/upfile`,
      headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
      },
      data: data
  })
  }

  static filterCandidates = (data) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/wish-list/filter`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
      data: data
    })
  }


}