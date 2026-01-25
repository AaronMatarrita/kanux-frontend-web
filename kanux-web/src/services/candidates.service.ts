import { httpClient } from "@/services/http";

export interface Candidate {
  id: string;
  name: string;
  skills: string[];
  background: string;
  location: string;
  match: number;
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

class CandidatesService {
  async getCandidates(filters?: CandidatesFilter): Promise<CandidatesResponse> {
    try {
      const response = await httpClient.get('/api/candidates', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
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
