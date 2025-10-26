import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.PY_BACKEND_URL
})

export default api;