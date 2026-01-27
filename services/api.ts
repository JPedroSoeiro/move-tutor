import axios from "axios";
import { POKEAPI_BASE_URL } from "@/constants/api";

const api = axios.create({
  baseURL: POKEAPI_BASE_URL,
});

export default api;
