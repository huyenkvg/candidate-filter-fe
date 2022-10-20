import { createSlice } from '@reduxjs/toolkit'


const candidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    rows: [],
    columns: [],
  },
  reducers: {
    setDanhSachCandidate(state, action) {
      state.rows = action.payload.rows;
      state.columns = action.payload.columns;
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
export const { addCandidate, removeCandidate, setDanhSachCandidate, } = actions;
export default reducer;

