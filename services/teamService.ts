import { moveTutorApi } from "./moveTutorApi";
import { getSession } from "next-auth/react";

export const teamService = {
  async saveTeam(teamData: any) {
    const session = await getSession();
    const response = await moveTutorApi.post("/teams/save", teamData, {
      headers: { Authorization: `Bearer ${session?.accessToken}` }
    });
    return response.data;
  },

  async getAllTeams() {
    const session = await getSession();
    const response = await moveTutorApi.get("/teams/feed", {
      headers: { Authorization: `Bearer ${session?.accessToken}` }
    });
    return response.data;
  },

  // Nova função para deletar posts
  async deleteTeam(teamId: string) {
    const session = await getSession();
    const response = await moveTutorApi.delete(`/teams/${teamId}`, {
      headers: { Authorization: `Bearer ${session?.accessToken}` }
    });
    return response.data;
  }
};