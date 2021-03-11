import jwtConfig from "../../config/jwt.config";

const customHeader = () => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("id_token") || undefined
});

const base = (method: string, url: string, data: any = {}) => {
    return fetch(`${jwtConfig.fetchUrl}${url}`, <any>{
        method,
        headers: customHeader(),
        body: JSON.stringify(data)
    })
        .then((response: any) => response.json())
        .catch(error => ({ error: "Server Error" }));
};

const SuperFetch: { [method: string]: any } = {};
["get", "post", "put", "delete"].forEach(method => {
    SuperFetch[method] = base.bind(null, method);
});
export default SuperFetch;
