import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:5000", // Substitua pelo endereço da sua API
});

export default api;
