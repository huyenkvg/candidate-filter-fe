import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from 'react';
import axios from 'axios';
import { Config } from '../../config';
import { useDispatch } from 'react-redux';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { setUserLoginn } from '../../features/User/userSlice';
import jwt_decode from "jwt-decode";
import './Login.css'
import { useNavigate } from 'react-router-dom';

const Prepare = () => {
  return (
    <div id="load">
      <div>G</div>
      <div>N</div>
      <div>I</div>
      <div>D</div>
      <div>A</div>
      <div>O</div>
      <div>L</div>
    </div>
  )

}

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
};
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
const LoginForm = (props) => {


  // const [formValues, setFormValues] = useState({ email: "tex@gmail.com", password: "tex@gmail.com" })
  const dispatch = useDispatch();
  const [preparing, setPreparing] = useState(false);
  // const API_URL = "${Config.Host}";

  let navigate = useNavigate();



  const mailInput = useRef();
  const passInput = useRef();
  const focusMailInput = () => mailInput.current.focus();
  const focusPassInput = () => passInput.current.focus();

  async function loginHandler(formValues) {

    const dataLogin = { username: formValues.email, password: formValues.password }
    axios({
      method: "POST",
      url: `${Config.Host}/auth/login`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }, data: formValues
    }).then(restoken => {
      preparation();
      let data = restoken.data;
      const { access_token, } = data;

      // dispatch(setUserLoginn({ profile: formValues, isLoggedIn: true }));
      console.log('jwt_decode :>> ', jwt_decode(access_token));
      let profile = jwt_decode(access_token);
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('token', access_token);
      localStorage.setItem('userInfo', JSON.stringify(profile));
      dispatch(setUserLoginn({ userInfo: profile, isLoggedIn: true }));


    }).catch(errLogin => {
      console.log('errLogin :>> ', errLogin);
      showMessage('error', errLogin.response.data.message);
      showMessage('error', 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập');
    })



  }
  const onFinishFailed = (data) => {
    showMessage('error', 'Vui lòng nhập đầy đủ thông tin đăng nhập');
  }

  const submitHandler = (data) => {
    console.log('formValues :>> ', data);
    loginHandler(data)
  }

  const preparation = async () => {
    setPreparing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setPreparing(false);


  };


  return (
    preparing ?
      <Prepare />
      :
      <Row style={{ maxWidth: '100vw' }}>
        <Col span={12} className="col-login-image" style={{ height: '100vh', alignItems: 'center' }}>
          <img src={require('../../assets/images/img-login.png')} alt="img-login" className='image' />
        </Col>
        <Col span={12}  >
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            className="form-login"
            onFinish={submitHandler}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
        {/* <CustomSnackbar data={snackBar} handleClose={handleClose} handleCloseSnackbar={handleClose} /> */}

      </Row>



  )
};

export default LoginForm;
