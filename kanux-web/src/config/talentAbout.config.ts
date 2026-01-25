export interface TalentAbout {
  // ABOUT ME Section
  aboutMe: string;
  
  // BASIC INFORMATION Section
  basicInformation: {
    professionalTitle: string;
    phoneNumber: string;
    location: string;
    languages: string[];
    experienceBackground: {
      selfTaught: boolean;
      studentAcademic: boolean;
      bootcamp: boolean;
      earlyProfessional: boolean;
    };
  };
}

