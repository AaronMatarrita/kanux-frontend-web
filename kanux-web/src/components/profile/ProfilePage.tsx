"use client";

import { Card, CardContent, CardHeader } from "./Card";
import { ProfileHeader } from "./ProfileHeader";
import { Tabs } from "./Tabs";
import { InfoItem } from "./InfoItem";
import { SkillsSection } from "./SkillsSection";
import { SkillsSectionSkeleton } from "./SkillsSectionSkeleton";
import { ChallengesSection } from "./ChallengesSection";
import { InfoItemSkeleton } from "./InfoItemSkeleton";
import { useEffect, useState } from "react";
import { profilesService } from "@/services";
import { TalentProfile } from "@/services/profiles.service";
import { ProfileHeaderSkeleton } from "./ProfileHeaderSkeleton";
import { ButtonEdit } from "./ButtonEdit";

// user Information, about, basic info, skills
import { Modal } from "./Modal";
import { UserInfoFormModal } from "./UserInfoFormModal";
import { Contact } from "./DynamicContactList";
import { AboutFormModal } from "./AboutFormModal";
import { BasicInfoFormModal } from "./BasicInfoFormModal";
import { SkillsFormModal } from "./SkillsFormModal";

import { UpdateTalentProfileRequest } from "@/services/profiles.service";

type ModalType = "none" | "userInfo" | "about" | "basicInfo" | "skills";

export function ProfilePage() {

  const [openModal, setOpenModal] = useState<ModalType>("none");
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data: TalentProfile = await profilesService.getMyProfile();
        setProfile(data);
      } catch (err) {
        setError("The profile could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  //update basic information
  const handleSaveUserInfo = async (data: any) => {
    try {
      const request: UpdateTalentProfileRequest = {
        first_name: data.first_name,
        last_name: data.last_name,
        title: data.title,
        location: data.location,
        contact: contactsArrayToBackend(data.contacts),
        image_profile: data.image_profile
      }
       await profilesService.updateMyProfile(request);
      const resprofile: TalentProfile = await profilesService.getMyProfile();
      setProfile(resprofile);
      setOpenModal("none");
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };
  //update about information
  const handleSaveAbout = async (data: any) => {
    try {
      const request: UpdateTalentProfileRequest = {
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        about: data.about
      }
      await profilesService.updateMyProfile(request);
      const resprofile: TalentProfile = await profilesService.getMyProfile();
      setProfile(resprofile);
      setOpenModal("none");
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };
  //update basic information
  const handleSaveBasicInfo = async (data: any) => {
    try {
      const request: UpdateTalentProfileRequest = {
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        experience_level: data.experienceLevel,
        opportunity_status_id: data.openToOpportunities,
        learning_background_id: data.learningBackground
      }
      await profilesService.updateMyProfile(request);
      const resprofile: TalentProfile = await profilesService.getMyProfile();
      setProfile(resprofile);
      setOpenModal("none");
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  // save Skills information
  const handleSaveSkills = async (data: any) => {
    setOpenModal("none");
  };

  // Tab content components
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* About Section*/}
      <Card>
        <CardContent>
          <h3 className="text-base font-semibold text-gray-900 mb-3">About</h3>
          {/* skeleton */}

          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
          ) : (
            <div>
              <p className="text-gray-600 leading-relaxed"> {profile?.about}</p>
              <ButtonEdit
                onExecute={() => setOpenModal("about")}
                label="Edit About"
              />
            </div>

          )}
        </CardContent>
      </Card>

      {/* Basic Information  */}
      <Card>
        <CardContent>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Basic Information</h3>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItemSkeleton />
              <InfoItemSkeleton />
              <InfoItemSkeleton />
              <InfoItemSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ButtonEdit
                onExecute={() => setOpenModal("basicInfo")}
                label="Edit Basic Info"
              />
              <InfoItem label="Experience Level" value={`${profile?.experience_level}`} />

              <div className="flex flex-col gap-2">
                <span className="text-base font-semibold text-gray-900">Lenguages</span>
                {profile?.languages_talent?.map((language) => (
                  <span key={language.id} className="text-sm text-gray-600">
                    {language.languages?.name} ({language.level})
                  </span>
                ))}
              </div>

              <InfoItem label="Learning Background" value={`${profile?.learning_backgrounds?.name}`} />
              <InfoItem label="Open to Opportunities" value={`${profile?.opportunity_statuses?.name}`} />
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );

  const SkillsTab = () => {
    const skills = profile?.skills || [];
    const categories = Array.from(new Set(skills.map(s => s.category?.name).filter(Boolean)));
    return (
      <div className="space-y-6">
        {/* Verified Skills */}
        <Card>
          <CardContent>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Verified Skills</h3>
            {/* skeleton */}
            {loading ? (
              <div className="space-y-4">
                <SkillsSectionSkeleton />
                <SkillsSectionSkeleton />
                <SkillsSectionSkeleton />
              </div>
            ) : (
              <div className="space-y-4">
                <ButtonEdit
                  onExecute={() => setOpenModal("skills")}
                  label="Edit Skills"
                />
                {categories.map((catName) => (
                  <SkillsSection
                    title={catName!}
                    skills={skills.filter(s => s.category?.name === catName).map(s => s.name)}
                  />))
                }
              </div>
            )}
          </CardContent>
        </Card>
      </div>);
  };

  const ActivityTab = () => {
    //example
    const challenges = [
      {
        title: "Full-Stack API Challenge",
        timeAgo: "2 days ago",
        difficulty: "Advanced",
        percentage: 92
      },
      {
        title: "React components",
        timeAgo: "1 week ago",
        difficulty: "Intermediate",
        percentage: 88
      }
    ];

    return (
      <div className="space-y-6">
        {/* challenges */}

        <Card>
          <CardContent>
            <ChallengesSection challenges={challenges} isLoading={loading} />
          </CardContent>
        </Card>
      </div>
    );
  };

  const tabs = [
    { label: "Overview", content: <OverviewTab /> },
    { label: "Skills", content: <SkillsTab /> },
    { label: "Activity", content: <ActivityTab /> }
  ];

  return (
    <>
      <div className=" bg-gray-50 p-6">
        <div className="mx-auto space-y-10">
          {/* title profile */}
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          {/* header card */}
          <Card>
            {loading ? (
              <CardContent>
                <ProfileHeaderSkeleton />
              </CardContent>
            ) : (
              <CardContent>
                <ButtonEdit
                  onExecute={() => setOpenModal("userInfo")}
                  label="Edit Profile"
                />
                <ProfileHeader
                  name={`${profile?.first_name + " " + profile?.last_name}`}
                  title={`${profile?.title}`}
                  email="alex.11smith@example.com"
                  location={`${profile?.location}`}
                  contact={profile?.contact}
                  avatar={`${profile?.image_url}`}
                />
              </CardContent>
            )}
          </Card>
          {/* Tabs*/}
          <Tabs tabs={tabs} defaultTab={0} />
        </div>
      </div>

      {/* Modals*/}
      <Modal
        isOpen={openModal === "userInfo"}
        onClose={() => setOpenModal("none")}
        title="Edit User Information"
        size="lg"
      >
        <UserInfoFormModal
          initialData={{
            first_name: `${profile?.first_name}`,
            last_name: `${profile?.last_name}`,
            title: profile?.title || "",
            location: profile?.location || "",
            contacts: backendContactsToArray(profile?.contact),
            currentAvatarUrl: profile?.image_url
          }}
          onSubmit={handleSaveUserInfo}
          onCancel={() => setOpenModal("none")}
        />
      </Modal>

      <Modal
        isOpen={openModal === "about"}
        onClose={() => setOpenModal("none")}
        title="Edit Description"
        size="md"
      >
        <AboutFormModal
          initialData={{ about: profile?.about || "" }}
          onSubmit={handleSaveAbout}
          onCancel={() => setOpenModal("none")}
        />
      </Modal>

      <Modal
        isOpen={openModal === "basicInfo"}
        onClose={() => setOpenModal("none")}
        title="Edit Basic Information"
        size="lg"
      >
        <BasicInfoFormModal
          initialData={{
            experienceLevel: profile?.experience_level || "",
            learningBackground: profile?.learning_backgrounds?.id || "",
            openToOpportunities: profile?.opportunity_statuses?.id || ""
          }}

          initialLanguages={profile?.languages_talent || []}

          onSubmit={handleSaveBasicInfo}
          onCancel={() => setOpenModal("none")}
        />
      </Modal>
    </>
  );
}


const backendContactsToArray = (
  contacts?: Record<string, any> | null
): Contact[] => {
  if (!contacts) return [];

  return Object.entries(contacts).map(([type, value]) => ({
    id: crypto.randomUUID(),
    type,
    value: String(value),
  }));
};

const contactsArrayToBackend = (contacts: Contact[]) => {
  return contacts.reduce((acc, c) => {
    if (c.type && c.value) acc[c.type] = c.value;
    return acc;
  }, {} as Record<string, string>);
};



