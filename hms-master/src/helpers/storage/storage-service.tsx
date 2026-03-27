const userData ={
    
        name: "Deepika",
        code: "receptionist",
        userName: "cmVjZXB0aW9uaXN0",
        password: "cGFzc3dvcmQ=",
        role: "RECEPTIONIST",
        icon: ""

};

class StorageService {

    public static clear = () => {
        window.localStorage.clear();
    }

    public static saveUserData(user: any): void {
        window.localStorage.setItem("user", JSON.stringify(user));
    }

    public static getUserData(): any {
        let user: any = window.localStorage.getItem("user");
        if (user) {
            return JSON.parse(user);
        }else{
            return userData;
        }
    }

    public static getUserName = () => {
        let user = this.getUserData();
        if (user) {
            return user['userName'];
        }else{
            return "Gift";
        }
    }

    public static getRole = () => {
        let role = this.getUserData();
        if (role) {
            return role['role'];
        }
    }

    public static getDoctorName = () => {
        let user = this.getUserData();
        if (user) {
            return user['name'];
        }else{
            return "Gift";
        }
    }

    public static setToken(token: string) {
        if (!token) {
            return;
        }
        window.localStorage.setItem('token', token);
    }

    public static getToken() {
        return window.localStorage.getItem('token');
    }

    public static isLoggedIn() {
        if (this.getToken() || this.getToken() != null) {
            return true;
        } else {
            return false;
        }
    }

    public static getUserDataFromSessionStorage(): any {
        let user: any = sessionStorage.getItem('userData');
        if (user) {
            return JSON.parse(user);
        }
    }
}

export default StorageService;