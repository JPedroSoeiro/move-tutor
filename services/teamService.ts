
import { moveTutorApi } from "./moveTutorApi";

export const teamService = {
  async saveTeam(teamData: any) {
  // Tente esta variação para limpar qualquer erro de concatenação do Axios
  const response = await moveTutorApi.post("teams/save", teamData); 
  return response.data;
  },

  async getAllTeams() {
    // Mesma lógica para o feed
    const response = await moveTutorApi.get("/teams/feed");
    return response.data;
  },
};