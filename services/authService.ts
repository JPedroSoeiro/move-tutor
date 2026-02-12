import moveTutorApi from './moveTutorApi';

export const authService = {
  async login(email: string, password: string) {
  const response = await moveTutorApi.post('/auth/login', { email, password });
  
  if (response.data.session) {
    console.log("Dados do usuário logado:", response.data.session.user);
    
    localStorage.setItem('@MoveTutor:token', response.data.session.access_token);
    localStorage.setItem("@MoveTutor:user", JSON.stringify({
      full_name: response.data.user.full_name,
      email: response.data.user.email
      }));
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
  }
};