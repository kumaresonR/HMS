import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';

// Mock user data
const users = [
    { name: "Admin", userName: "admin@gmail.com", password: "admin123", role: "admin", profileImage: "/login-user/admin.png" },
    { name: "Super Admin", userName: "superadmin@gmail.com", password: "superadmin123", role: "super_admin", profileImage: "/login-user/super-admin.jpg" },
    { name: "Nurse", userName: "nurse@gmail.com", password: "nurse123", role: "nurse", profileImage: "/login-user/nurse-img.jpg" },
    { name: "Doctor", userName: "doctor@gmail.com", password: "doctor123", role: "doctor", profileImage: "/login-user/doctor.jpeg" },
    { name: "Receptionist", userName: "receptionist@gmail.com", password: "receptionist123", role: "receptionist", profileImage: "/login-user/receptionist.jpeg" },
];

export const loginUser = (user: { email: string, password: string }, history: any) => async (dispatch: any) => {
    try {
        const foundUser = users.find((u) => u.userName === user.email && u.password === user.password);

        if (foundUser) {
            const response = { ...foundUser, email: foundUser.userName };
            sessionStorage.setItem("authUser", JSON.stringify(response));
            dispatch(loginSuccess(response));
            history('/dashboard');
        } else {
            dispatch(apiError({ message: "Invalid email or password" }));
        }
    } catch (error) {
        dispatch(apiError(error));
    }
};

export const logoutUser = () => async (dispatch: any) => {
    try {
        sessionStorage.removeItem("authUser");
        dispatch(logoutUserSuccess());
    } catch (error) {
        dispatch(apiError(error));
    }
};

export const resetLoginFlag = () => async (dispatch: any) => {
    dispatch(reset_login_flag());
};
