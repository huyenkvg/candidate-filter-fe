import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateAPI from "../../apis/CandidateAPI";
import UploadButton from "../../components/input/UpLoadButton";
import AntTable from "../../components/table/AntTable";
import { setDanhSachCandidate } from "../../features/ThiSinh/candidateSlice";

export default function TuyenSinh() {
  // Khai báo
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const candidates = useSelector((state) => state.candidates);

  // Effect
  // useEffect(() => {
  //   // Lấy danh sách tất cả các hồ sơ xét tuyển

  // }, []);

  // Sự kiện
  const upFileHandler = (data) => {
    setLoading(true);
    CandidateAPI.getCandidatesFromXls(data).then((res) => {
      const { headerObject, wishList } = res.data;
      let rows = wishList.map((x, index) => ({ ...x, key: index }));
      let columns = Object.keys(headerObject).map((item) => ({
        title: headerObject[item],
        dataIndex: item,
        key: item,
      }))
      console.log('columns :>> ', columns);
      console.log('rows :>> ', rows);

      dispatch(setDanhSachCandidate({ rows, columns }));
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
    })
  }

  return (
    <div>
      <Spin spinning={loading} >
        <UploadButton onUpload={upFileHandler} />
        <AntTable columns={candidates.columns} rows={candidates.rows} />
      </Spin>
    </div>
  );
}