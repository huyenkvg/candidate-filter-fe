
import userProfileSlice from '../features/NhanVien/userProfileSlice';
import userSlice from '../features/User/userSlice';
import tuyenSinhSlice from '../features/QuanLyTuyenSinh/tuyenSinhSlice';
import candidateSlice from '../features/ThiSinh/candidateSlice';
import dsttSlice from '../features/DSST/dsttSlice';
import { configureStore } from '@reduxjs/toolkit'

const rootReducer = {
   listProfile: userProfileSlice,
   tuyenSinh: tuyenSinhSlice,
   userSlice: userSlice,
   candidates: candidateSlice,
   dsttSlice: dsttSlice,
}

const store = configureStore({
    reducer: rootReducer,
    // reducer:{
    //     nhanviens: nhanvienSlice,
    // }
})
export default store;