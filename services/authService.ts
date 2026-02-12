import { moveTutorApi } from "./moveTutorApi";

export const authService = {
  async login(email: string, password: string) {
    const response = await moveTutorApi.post('/auth/login', { email, password });
    
    const { session, user } = response.data;

    if (session && user) {
      localStorage.setItem('@MoveTutor:token', session.access_token);
      
      localStorage.setItem("@MoveTutor:user", JSON.stringify({
        full_name: user.full_name,
        email: user.email,
        id: user.id
      }));

      console.log("Sessão iniciada: ", user.full_name);
    }
    
    return response.data;
  },

  async signUp(email: string, password: string, fullName: string) {
    const response = await moveTutorApi.post('/auth/signup', { 
      email, 
      password, 
      fullName 
    });
    return response.data;
  }, 


  logout() {
    localStorage.removeItem('@MoveTutor:token');
    localStorage.removeItem('@MoveTutor:user');
    
    window.location.href = '/login';
  }
};