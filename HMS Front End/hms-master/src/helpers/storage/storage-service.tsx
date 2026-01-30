class StorageService {

    public static clear = () => {
        window.localStorage.clear();
        window.sessionStorage.clear();
    }

    public static saveUserData(user: any): void {
        window.localStorage.setItem("user", JSON.stringify(user));
    }

    public static getUserData(): any {
        let user: any = window.localStorage.getItem("user");
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    public static getUserName = () => {
        let user = this.getUserData();
        if (user && user['userName']) {
            return user['userName'];
        }
        return null;
    }

    public static getRole = () => {
        let role = this.getUserData();
        if (role) {
            return role['role'];
        }
    }

    public static getDoctorName = () => {
        let user = this.getUserData();
        if (user && user['name']) {
            return user['name'];
        }
        return null;
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
        const token = this.getToken();
        return token !== null && token !== undefined && token !== '';
    }

    public static getUserDataFromSessionStorage(): any {
        let user: any = sessionStorage.getItem('userData');
        if (user) {
            return JSON.parse(user);
        }
    }
}

export default StorageService;