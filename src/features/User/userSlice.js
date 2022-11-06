
import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
    name: 'userLogin',
    initialState: {
        isLoggedIn: false,
        // is_admin: true,
        // username: "",
        // user_id: "",
        // password: "",
        // profile: {},
        userInfo: {},
    },
    reducers: {
        setUserLoginn(state, action) {
            // state.username = action.payload.email;
            // state.user_id = action.payload.user_id;
            // state.is_admin = action.payload.is_admin;
            // state.profile = action.payload.profile;
            state.isLoggedIn = true;
            state.userInfo = action.payload.userInfo;
        },
        logout(state) {
            state.isLoggedIn = false;
            // state.is_admin = false;
            // state.username = "";
            // state.user_id = "";
            state.userInfo = {};
            // localStorage.removeItem('isLoggedIn');
        }
    }
})

const { reducer, actions } = userSlice;
export const { setUserLoginn, logout } = actions;
export default reducer;


// export const { addNhanVien } = UserSlice.actions
// export default UserSlice.reducer