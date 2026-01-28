export type CompanyProfile = {
  id: string; 
  name: string | null;
  about: string | null;
  id_user: string;
  location: string | null;
  contact: Record<string, unknown> | null; 
  url_logo: string | null;
  goal: string | null;
  created_at: string; 
};


export type TalentProfile = {
  id: string;          
  id_user: string;       
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  bio: string | null;
  location: string | null;
  skills: string[] | null; 
  photo_url: string | null;
  created_at: string;    
};


type CompanySession = {
  userType: "company";
  profile: CompanyProfile;
};

type TalentSession = {
  userType: "talent";
  profile: TalentProfile;
};

export type Session = {
  isAuthenticated: boolean;
  token: string;
  sessionId: string;
  user: {
    id: string;
    email: string;
  } & (CompanySession | TalentSession);
};



export type BackendLoginResponse = {
  token: string;
  sessionId: string;
  user: {
    id: string;
    email: string;
    userType: "company" | "talent";
    profile: CompanyProfile | TalentProfile;
  };
};