import { moveTutorApi } from "./moveTutorApi";
import { getSession } from "next-auth/react";

interface Team {
  id?: string;
  team_name: string;
  author_name?: string;
  pokemons?: any[];
  [key: string]: any;
}

interface UserTeamsResponse {
  teams: Team[];
  count: number;
  username: string;
}

export const teamService = {
  async saveTeam(teamData: Team): Promise<Team> {
    const session = await getSession();
    const headers = { Authorization: `Bearer ${session?.accessToken}` };
    const response = await moveTutorApi.post<Team>("/teams/save", teamData, { headers });
    return response.data;
  },

  async getAllTeams(): Promise<Team[]> {
    let headers: Record<string, string> = {};
    try {
      const session = await getSession();
      if (session?.accessToken) {
        headers = { Authorization: `Bearer ${session.accessToken}` };
      }
    } catch (e) {
      // Acesso como visitante
    }

    const response = await moveTutorApi.get<Team[]>("/teams/feed", { headers });
    return response.data;
  },

  async deleteTeam(id: string): Promise<boolean> {
    const session = await getSession();
    const headers = { Authorization: `Bearer ${session?.accessToken}` };
    const response = await moveTutorApi.delete(`/teams/${id}`, { headers });
    return response.status === 200 || response.status === 204;
  },

  async getUserTeams(username: string): Promise<UserTeamsResponse> {
    const session = await getSession();
    const headers = session?.accessToken
      ? { Authorization: `Bearer ${session.accessToken}` }
      : {};

    const response = await moveTutorApi.get<UserTeamsResponse>(`/teams/user/${username}`, { headers });
    return response.data;
  },

  async createTeam(teamData: Team): Promise<Team> {
    const session = await getSession();

    if (!session?.accessToken) {
      throw new Error("Usuário não autenticado");
    }

    return this.saveTeam(teamData);
  },
};