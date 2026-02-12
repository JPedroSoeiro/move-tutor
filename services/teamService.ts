import moveTutorApi from "./moveTutorApi";

export const teamService = {
  async saveTeam(teamData: any) {
    const response = await moveTutorApi.post("/teams", teamData);
    return response.data;
  },

  async getAllTeams() {
    const response = await moveTutorApi.get("/teams");
    return response.data; 
  }
};