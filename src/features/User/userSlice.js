
import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
    name: 'userLogin',
    initialState: {
        isLogin: false,
        is_admin: true,
        username: "",
        user_id: "",
        password: "",
    },
    reducers: {
        setUserLoginn(state, action) {
            state.username = action.payload.email;
            state.user_id = action.payload.user_id;
            state.is_admin = action.payload.is_admin;
            state.isLogin = true;
        },
        logout(state) {
            state.isLogin = false;
            state.is_admin = false;
            state.username = "";
            state.user_id = "";
            // localStorage.removeItem('isLoggedIn');
        }
    }
})

const { reducer, actions } = userSlice;
export const { setUserLoginn, logout } = actions;
export default reducer;


// export const { addNhanVien } = UserSlice.actions
// export default UserSlice.reducer