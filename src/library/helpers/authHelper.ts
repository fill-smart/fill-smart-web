import jwtDecode from "jwt-decode";
import SuperFetch from "./superFetch";

class AuthHelper {
    login = async (userInfo: any) => {
        if (!userInfo.username || !userInfo.password) {
            return { error: "please fill in the input" };
        }
        return await SuperFetch.post("login", userInfo).then(
            (response: any) => {
                return this.checkExpirity(response.token);
            }
        );
    };
    async checkDemoPage(token: string) {
        if (this.checkExpirity(token).error) {
            return { error: "Token expired" };
        }
        return await SuperFetch.get("secret/test", { token })
            .then(() => ({
                status: "200",
                message: "Success"
            }))
            .catch((error: any) => ({ error: JSON.stringify(error) }));
    }
    checkExpirity = (token: string) => {
        if (!token) {
            return {
                error: "not matched"
            };
        }
        try {
            const profile: any = jwtDecode(token);

            const expiredAt = profile.expiredAt || profile.exp * 1000;

            if (expiredAt > new Date().getTime()) {
                return {
                    ...profile,
                    token,
                    expiredAt: new Date(expiredAt)
                };
            } else {
                return { error: "Token expired" };
            }
        } catch (e) {
            console.log(e);

            return { error: "Server Error" };
        }
    };
}
export default new AuthHelper();
