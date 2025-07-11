import axios from "axios";
import { environment } from "../../../environment";
import { errorInterceptor, responseInterceptor } from "./interceptors";

const Api = axios.create({
    baseURL: environment.apiUrl,
});

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error)
);
export { Api };