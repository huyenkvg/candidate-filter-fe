import axios from "axios";
import { Config } from "../config";

export default class FileAPI {
  static upload_DSChiTieu = (data, save, maDotTuyenSinh) => {
    return axios({
      method: "POST",
      url: `http://localhost:3000/file-handler/upload-chi-tieu${save ? ("?save=true" + "&maDotTuyenSinh=" + maDotTuyenSinh) : ""}`,
      data: data
    })
  }
}