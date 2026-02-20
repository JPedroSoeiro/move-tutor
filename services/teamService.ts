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
  let headers = {};
  try {
    const session = await getSession();
    if (session?.accessToken) {
      headers = { Authorization: `Bearer ${session.accessToken}` };
    }
  } catch (e) {
    console.log("Acesso como visitante");
  }

  const response = await moveTutorApi.get("/teams/feed", { headers });
  return response.data;
},

async deleteTeam(id: string) {
  const session = await getSession();
  
  const response = await moveTutorApi.delete(`/teams/${id}`, {
    headers: { 
      Authorization: `Bearer ${session?.accessToken}` 
    }
  });
  
  return response.status === 200 || response.status === 204;
},

  async getUserTeams(username: string) {
  const session = await getSession();
  const headers = session?.accessToken 
    ? { Authorization: `Bearer ${session.accessToken}` } 
    : {};

  // Usamos a instância moveTutorApi que já tem a baseURL correta
  const response = await moveTutorApi.get(`/teams/user/${username}`, { headers });
  return response.data; // Retorna { teams: [], count: 0 }
},

async createTeam(teamData: any) {
  const session = await getSession();
  
  if (!session?.accessToken) {
    throw new Error("Usuário não autenticado");
  }

  const response = await moveTutorApi.post("/teams/save", teamData, {
    headers: { Authorization: `Bearer ${session.accessToken}` }
  });
  return response.data;
}
};