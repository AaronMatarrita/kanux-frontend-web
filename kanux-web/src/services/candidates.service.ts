import { httpClient } from "@/services/http";

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  education: string;
  skills: string[];
  match: number;
}
export interface CandidateProfile {
  id: string;
  about: string;
  title: string | null;
  email: string | null;
  contact: {
    phone?: string;
  };
  user_id: string;
  location: string | null;
  education: string | null;
  first_name: string;
  last_name: string;
  experience_level: string | null;
  profile_completeness: number;
  opportunity_status_id: string | null;
  learning_background_id: string | null;
  created_at: string;
}


export interface CandidatesResponse {
  candidates: Candidate[];
  total: number;
}

export interface CandidatesFilter {
  skills?: string[];
  background?: string;
  location?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

interface CandidateRawApiResponse {
  talent_id: string;
  talent_profile: CandidateProfile;
  skills: string[];
}

export interface CandidateListItem {
  talent_id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  education: string | null;
  skills: string[];
  profile: CandidateProfile; 
}


class CandidatesService {
  
async getCandidates(token: string): Promise<CandidateListItem[]> {
  const res = await httpClient.get<{ data: CandidateRawApiResponse[] }>(
    "/companies/company/candidates",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data.data.map((c) => ({
    talent_id: c.talent_id,
    first_name: c.talent_profile.first_name,
    last_name: c.talent_profile.last_name,
    title: c.talent_profile.title,
    education: c.talent_profile.education,
    skills: c.skills ?? [],
    profile: c.talent_profile, 
  }));
}







  async getCandidateById(id: string): Promise<Candidate> {
    try {
      const response = await httpClient.get(`/api/candidates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }
  }

  private convertToString(item: unknown): string {
    if (typeof item === 'string') {
      return item;
    }
    
    if (typeof item === 'object' && item !== null && 'name' in item) {
      const obj = item as Record<string, unknown>;
      return String(obj.name);
    }
    
    return String(item);
  }

  async getSkillFilters(): Promise<string[]> {
    try {
      const response = await httpClient.get('/profiles/skills/all-skills');
      const data = response.data;
      
      if (Array.isArray(data)) {
        return data.map(item => this.convertToString(item));
      }
      
      const dataObj = data as Record<string, unknown>;
      if (dataObj.skills && Array.isArray(dataObj.skills)) {
        return dataObj.skills.map(item => this.convertToString(item));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching skill filters:', error);
      throw error;
    }
  }

  async getBackgroundFilters(): Promise<string[]> {
    try {
      const response = await httpClient.get('/api/candidates/filters/background');
      return response.data;
    } catch (error) {
      console.error('Error fetching background filters:', error);
      throw error;
    }
  }

  async getLocationFilters(): Promise<string[]> {
    try {
      const response = await httpClient.get('/api/candidates/filters/location');
      return response.data;
    } catch (error) {
      console.error('Error fetching location filters:', error);
      throw error;
    }
  }
}

export const candidatesService = new CandidatesService();
