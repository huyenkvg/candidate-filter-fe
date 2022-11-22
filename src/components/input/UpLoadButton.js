import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import React from 'react';


export default function UploadButton({ onUpload }) {
  const [file_x, setFile] = React.useState(null);
  // const props = {
  //   beforeUpload: (file) => {
  //     const isPNG = true;
  //     // const isPNG = file.type === 'image/png';
  //     if (!isPNG) {
  //       message.error(`${file.name} is not a png file`);
  //     }
  //     return isPNG || Upload.LIST_IGNORE;
  //   },
  //   onChange: (info) => {
  //     console.log("hihihih", info.fileList);
  //     if (info.fileList.length > 0) {
  //       console.log("upfileee", info.fileList[0]);

  //       let formData = new FormData();
  //       formData.append('file', info.fileList[0]);
  //       onUpload(formData);
  //     }
  //   },
  // };
  // return (
  //   <Upload {...props} maxCount={1}>
  //     <Button style={{ marginBottom: '10px' }} icon={<UploadOutlined />}>Upload (.xls file)</Button>
  //   </Upload>
  // )
  const handleUploadFile = (e) => {
    console.log("upfileee", e.target.files[0]);

    let formData = new FormData();
    formData.append('file', e.target.files[0]);

    setFile(null)
    onUpload(formData);
    // console.log("formdata", formData.get('file'));
  };
  
  const fileInput = React.useRef();
  return (
    <div 
    // onClick={() => fileInput.current.click()}
    >
      {/* <UploadOutlined/>  */}
      {/* <input type='file' id="getFile" style="display:none"> */}
      <Button type='text'>
      <input
             ref={fileInput}
              type="file"
              value={file_x}
              // style={{ display: 'none' }}
              onChange={handleUploadFile}
            /></Button>
    </div>
  )
};