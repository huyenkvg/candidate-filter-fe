import { createSlice } from '@reduxjs/toolkit'


const userProfileSlice = createSlice({
    name: 'user_profiles',
    initialState: {
        list_profile: [],
        list_account: [],
    },
    reducers: {
        setDanhSachUserProfile(state, action) {
            state.list_profile = action.payload;
        },
        setDanhSachAccount(state, action) {
            state.list_account = action.payload;
        },
        addProfile(state, action) {
            state.list_profile.push(action.payload);
        },
        addAccount(state, action) {
            state.list_account.push(action.payload);
        },
        removeProfile(state, action) { // truyền index của NV trong list_profile
            state.list_profile.splice(action.payload);
        },
        removeAccount(state, action) { // truyền index của NV trong list_account
            state.list_account.splice(action.payload);
        },
    }
})

const { reducer, actions } = userProfileSlice;
export const { addProfile, removeProfile, setDanhSachUserProfile, addAccount, removeAccount, setDanhSachAccount } = actions;
export default reducer;

