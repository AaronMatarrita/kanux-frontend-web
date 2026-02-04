import { httpClient } from "@/services/http";

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  education: string;
  skills: string[];
  match: number;
  image_url: string | null;
}
export interface CandidateProfile {
  id: string;
  about: string;
  title: string | null;
  email: string | null;
  contact: {
    phone?: string;
    website?: string;
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
  image_url: string | null;
  created_at: string;
}

export interface CandidatesResponse {
  candidates: Candidate[];
  total: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
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
  skills: Skill[];
  avg_score: number; 
}


export interface CandidateListItem {
  talent_id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  education: string | null;
  skills: Skill[];
  profile: CandidateProfile;
  avg_score: number;
}


export type Skill = {
  id: string;
  name: string;
  level: string;
  category_id: string;
};

interface CandidateRawApiDash {
  talent_id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  education: string | null;
  skills: Skill[];
}

interface CandidatesApiResponse {
  data: CandidateRawApiResponse[];
  pagination: PaginationMeta;
}

export interface LearningBackground {
  id: string;
  name: string;
}

interface LearningBackgroundsApiResponse {
  data: LearningBackground[];
}

class CandidatesService {


  async getCandidatesFiltered(
  token: string,
  filters: {
    searchText?: string;
    skill?: string;
    learningBackgroundId?: string;
  },
  page: number = 1,
  pageSize: number = 10
): Promise<{
  candidates: CandidateListItem[];
  pagination: PaginationMeta;
}> {
  const res = await httpClient.get<CandidatesApiResponse>(
    "/companies/company/candidates/filter",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        pageSize,
        search: filters.searchText || undefined,
        skill: filters.skill || undefined,
        learningBackgroundId : filters.learningBackgroundId || undefined,
      },
    }
  );

  return {
    candidates: res.data.data.map((c) => ({
      talent_id: c.talent_id,
      first_name: c.talent_profile.first_name,
      last_name: c.talent_profile.last_name,
      title: c.talent_profile.title,
      education: c.talent_profile.education,
      skills: c.skills ?? [],
      profile: c.talent_profile,
      avg_score: c.avg_score,
    })),
    pagination: res.data.pagination,
  };
}

async getTalentProfileSummary(
  token: string,
  compId: string,
  talentProfileId: string
): Promise<{
  candidates: CandidateListItem[];
}> {
  const res = await httpClient.get(
    `/companies/company/${compId}/${talentProfileId}/summary`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const c = res.data;

  return {
    candidates: [
      {
        talent_id: c.talent_id,
        first_name: c.talent_profile.first_name,
        last_name: c.talent_profile.last_name,
        title: c.talent_profile.title,
        education: c.talent_profile.education,
        skills: c.skills ?? [],
        profile: c.talent_profile,
        avg_score: c.avg_score,
      },
    ],
  };
}


async  getLearningBackgrounds(token: string): Promise<LearningBackground[]> {
  const res = await httpClient.get<LearningBackgroundsApiResponse>(
    "/companies/company/candidates/learning-backgrounds",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data;
}


  async getCandidatesDash(token: string): Promise<CandidateListItem[]> {
    const res = await httpClient.get<{ data: CandidateRawApiDash[] }>(
      "/companies/company/dashboard/candidates",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data.data.map((c) => ({
      talent_id: c.talent_id,
      first_name: c.first_name,
      last_name: c.last_name,
      title: c.title,
      education: c.education,
      skills: c.skills ?? [],
      profile: null as unknown as CandidateProfile,
      avg_score: 0,
    }));
  }

  async getCandidateById(id: string): Promise<Candidate> {
    try {
      const response = await httpClient.get(`/api/candidates/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching candidate:", error);
      throw error;
    }
  }

  private convertToString(item: unknown): string {
    if (typeof item === "string") {
      return item;
    }

    if (typeof item === "object" && item !== null && "name" in item) {
      const obj = item as Record<string, unknown>;
      return String(obj.name);
    }

    return String(item);
  }

  async getSkillFilters(): Promise<string[]> {
    try {
      const response = await httpClient.get("/profiles/skills/all-skills");
      const data = response.data;

      if (Array.isArray(data)) {
        return data.map((item) => this.convertToString(item));
      }

      const dataObj = data as Record<string, unknown>;
      if (dataObj.skills && Array.isArray(dataObj.skills)) {
        return dataObj.skills.map((item) => this.convertToString(item));
      }

      return [];
    } catch (error) {
      console.error("Error fetching skill filters:", error);
      throw error;
    }
  }

  async getBackgroundFilters(): Promise<string[]> {
    try {
      const response = await httpClient.get(
        "/api/candidates/filters/background",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching background filters:", error);
      throw error;
    }
  }

  async getLocationFilters(): Promise<string[]> {
    try {
      const response = await httpClient.get("/api/candidates/filters/location");
      return response.data;
    } catch (error) {
      console.error("Error fetching location filters:", error);
      throw error;
    }
  }
}

export const candidatesService = new CandidatesService();
