import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import React from 'react';


function showMessage(type, content) {
  switch (type) {
    case 'success':
      message.success(content);
      break;
    case 'error':
      message.error(content);
      break;
    case 'warning':
      message.warning(content);
      break;
    case 'info':
      message.info(content);
      break;
    default:
      break;
  }
}
export default function UploadButton({ onUpload, disabled }) {
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
      // disabled= {disabled}
             ref={fileInput}
              type="file"
              value={file_x}
              // style={{ display: 'none' }}
              onChange={handleUploadFile}
              onClick={(e) => { 
                if(disabled){
                  // alert("Hệ thống hiện không cho phép thao tác này")
                  showMessage("error", "Hệ thống hiện không cho phép thao tác này")
                  e.preventDefault();
                }
               }}
            /></Button>
    </div>
  )
};