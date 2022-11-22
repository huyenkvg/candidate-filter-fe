import { createSlice } from '@reduxjs/toolkit'


const tuyenSinhSlice = createSlice({
    name: 'khoa_tuyen_sinh',
    initialState: {
        list_khoa_ts: [],
        list_dot_ts: [],
    },
    reducers: {
        setDanhSachKhoaTuyenSinh(state, action) {
            state.list_khoa_ts = action.payload;
        },
        addKhoaTuyenSinh(state, action) {
            state.list_khoa_ts.push(action.payload);
        },
        removeKhoaTuyenSinh(state, action) {
            state.list_khoa_ts = state.list_khoa_ts.filter((khoa_ts) => khoa_ts.maKhoa !== action.payload.maKhoa);
        },
        updateKhoaTuyenSinh(state, action) {
            const index = state.list_khoa_ts.findIndex((item) => item.maKhoa === action.payload.maKhoa);
            if (index !== -1) {
                state.list_khoa_ts[index] = action.payload;
            }
        },
        setDotTuyenSinh(state, action) {
            state.list_dot_ts = action.payload;
        },
        addDotTuyenSinh(state, action) {
            const index = state.list_khoa_ts.findIndex((item) => item.maKhoa === action.payload.maKhoaTuyenSinh);
            if (index !== -1) {
                state.list_khoa_ts[index].danh_sach_dot_tuyen.push(action.payload);
            }
            state.list_dot_ts.push(action.payload);

        },
        updateDotTuyenSinh(state, action) {
            const index = state.list_khoa_ts.findIndex((item) => item.maKhoa === action.payload.maKhoaTuyenSinh);
            if (index !== -1) {
                const index_dot = state.list_khoa_ts[index].danh_sach_dot_tuyen.findIndex((item) => item.maDotTuyenSinh === action.payload.maDotTuyenSinh);
                if (index_dot !== -1) {
                    state.list_khoa_ts[index].danh_sach_dot_tuyen[index_dot] = action.payload;
                }
            }
            const index_dot = state.list_dot_ts.findIndex((item) => item.maDotTuyenSinh === action.payload.maDotTuyenSinh);
            if (index_dot !== -1) {
                state.list_dot_ts[index_dot] = action.payload;
            }
        },
        removeDotTuyenSinh(state, action) {
                const index = state.list_dot_ts.filter((item) => item.maDotTuyenSinh !== action.payload.maDotTuyenSinh);
                const index_khoa = state.list_khoa_ts.findIndex((item) => item.maKhoa === action.payload.maKhoaTuyenSinh);
                if (index_khoa !== -1) {
                    state.list_khoa_ts[index_khoa].danh_sach_dot_tuyen = state.list_khoa_ts[index_khoa].danh_sach_dot_tuyen.filter((item) => item.maDotTuyenSinh !== action.payload.maDotTuyenSinh);

                }
        },
    }
})

const { reducer, actions } = tuyenSinhSlice;
export const { setDanhSachKhoaTuyenSinh, setDotTuyenSinh, addDotTuyenSinh, addKhoaTuyenSinh, removeDotTuyenSinh, removeKhoaTuyenSinh, updateDotTuyenSinh, updateKhoaTuyenSinh } = actions;
export default reducer;

