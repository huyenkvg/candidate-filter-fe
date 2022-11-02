import { createSlice } from '@reduxjs/toolkit'


const candidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    rows: [],
    columns: [],
    headerObject: {},
    chiTieuNganh: null,
    groupByMaNganh: {},
    groupBySoBaoDanh: {},
  },
  reducers: {
    setDanhSachCandidate(state, action) {
      state.rows = action.payload.rows;
      state.columns = action.payload.columns;
      state.headerObject = action.payload.headerObject;
      state.chiTieuNganh = action.payload.chiTieuNganh;
      state.groupByMaNganh = action.payload.groupByMaNganh;
      state.groupBySoBaoDanh = action.payload.groupBySoBaoDanh;

    },
    setChiTieuNganh(state, action) {
      state.chiTieuNganh = action.payload;
    },
    addCandidate(state, action) {
      state.rows.push(action.payload);
    },
    removeCandidate(state, action) {
      state.rows.splice(action.payload);
    },
  }
})

const { reducer, actions } = candidateSlice;
export const { addCandidate, setChiTieuNganh, removeCandidate, setDanhSachCandidate, } = actions;
export default reducer;

