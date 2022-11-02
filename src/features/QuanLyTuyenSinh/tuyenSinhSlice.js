import { createSlice } from '@reduxjs/toolkit'


const tuyenSinhSlice = createSlice({
    name: 'khoa_tuyen_sinh',
    initialState: {
        list_khoa_ts: [],
        list_dot_ts: {},
    },
    reducers: {
        setDanhSachKhoaTuyenSinh(state, action) {
            state.list_khoa_ts = action.payload;
        },
        setDotTuyenSinh(state, action) {
            state.dot_ts = action.payload;
        },
        addDotTuyenSinh(state, action) {
            state.list_dot_ts.push(action.payload);
        },
        addKhoaTuyenSinh(state, action) {
            state.list_khoa_ts.push(action.payload);
        },
        removeDotTuyenSinh(state, action) { // truyền index của NV trong list_dot_ts
            state.list_dot_ts.splice(action.payload);
        },
        removeKhoaTuyenSinh(state, action) { // truyền index trong list
            state.list_khoa_ts.splice(action.payload);
        },
    }
})

const { reducer, actions } = tuyenSinhSlice;
export const { setDanhSachKhoaTuyenSinh, setDotTuyenSinh, addDotTuyenSinh, addKhoaTuyenSinh, removeDotTuyenSinh, removeKhoaTuyenSinh} = actions;
export default reducer;

