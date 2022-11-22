import { createSlice } from '@reduxjs/toolkit'


const dsttSlice = createSlice({
  name: 'ds_trung_tuyen',
  initialState: {
    data: {},
  },
  reducers: {
    setDanhSachTrungTuyen(state, action) {
      state.data = action.payload;
    },
  }
})

const { reducer, actions } = dsttSlice;
export const { setDanhSachTrungTuyen } = actions;
export default reducer;

