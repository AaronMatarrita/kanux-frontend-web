"use client";

import { Card, CardContent, CardHeader } from "./Card";
import { ProfileHeader } from "./ProfileHeader";
import { Tabs } from "./Tabs";
import { InfoItem } from "./InfoItem";
import { SkillsSection } from "./SkillsSection";
import { ChallengesSection } from "./ChallengesSection";
import { useEffect, useState } from "react";
import { profilesService } from "@/services";
import {
  Skill,
  TalentProfile,
  Catalogs,
  UpdateTalentProfileRequest,
} from "@/services/profiles.service";
import {
  ChallengeSubmissionsResponse,
  challengesService,
} from "@/services/challenges.service";
import { ButtonEdit } from "./ButtonEdit";

// user Information, about, basic info, skills
import { Modal } from "./Modal";
import { UserInfoFormModal } from "./UserInfoFormModal";
import { Contact } from "./DynamicContactList";
import { AboutFormModal } from "./AboutFormModal";
import { BasicInfoFormModal } from "./BasicInfoFormModal";
import { SkillsFormModal } from "./SkillsFormModal";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/error-alert";
import { toast, Toaster } from "sonner";

type ModalType = "none" | "userInfo" | "about" | "basicInfo" | "skills";

export function ProfilePage() {
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [catalogs, setCatalogs] = useState<Catalogs | null>(null);
  const [challenges, setChallenges] = useState<
    Array<ChallengeSubmissionsResponse[number]>
  >([]);

  //states
  const [openModal, setOpenModal] = useState<ModalType>("none");
  const [loading, setLoading] = useState(true);

  const loadProfileData = async function loadProfile() {
    try {
      setLoading(true);
      const [responseProfile, responseCatalogs, responseChallenges] =
        await Promise.all([
          profilesService.getMyProfile(),
          profilesService.getCatalogs(),
          challengesService.getMyChallengeHistory(),
        ]);
      setProfile(responseProfile);
      setCatalogs(responseCatalogs);
      setChallenges(responseChallenges);
      console.log(responseProfile);
    } catch (err) {
      toast.error("No se pudo cargar el perfil.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProfileData();
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
        image_profile: data.image_profile,
      };

      await profilesService.updateMyProfile(request);
      const resprofile: TalentProfile = await profilesService.getMyProfile();
      setProfile(resprofile);
      setOpenModal("none");
      toast.success("La informacion del perfil fue actualizada.");
    } catch (error) {
      toast.error("No se pudo actualizar el perfil.");
    }
  };

  //update about information
  const handleSaveAbout = async (data: any) => {
    try {
      const request: UpdateTalentProfileRequest = {
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        about: data.about,
      };
      await profilesService.updateMyProfile(request);
      const resprofile: TalentProfile = await profilesService.getMyProfile();
      setProfile(resprofile);
      setOpenModal("none");
      toast.success("La descripcion fue actualizada.");
    } catch (error) {
      toast.error("No se pudo actualizar el perfil.");
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
        learning_background_id: data.learningBackground,
      };
      const toCreate = data.localLanguages.filter((item: any) =>
        item.id.startsWith("temp-"),
      );
      const toDelete =
        profile?.languages_talent?.filter(
          (orig: any) =>
            !data.localLanguages.some((curr: any) => curr.id === orig.id),
        ) ?? [];
      const toUpdate = data.localLanguages.filter((curr: any) => {
        if (curr.id.startsWith("temp-")) return false;
        const original = profile?.languages_talent?.find(
          (orig: any) => orig.id === curr.id,
        );
        return (
          original &&
          (original.id_languages !== curr.id_languages ||
            original.level !== curr.level)
        );
      });
      // send data
      await Promise.all([
        // update profile
        profilesService.updateMyProfile(request),

        // create languages relation
        ...toCreate.map((lang: any) =>
          profilesService.addLanguage({
            language_id: lang.id_languages!,
            level: lang.level,
          }),
        ),

        // updates languages relation
        ...toUpdate.map((lang: any) =>
          profilesService.updateLanguage(lang.id, {
            language_id: lang.id_languages!,
            level: lang.level,
          }),
        ),

        //delete languages relation
        ...toDelete.map((lang: any) => profilesService.deleteLanguage(lang.id)),
      ]);
      const resprofile: TalentProfile = await profilesService.getMyProfile();
      setProfile(resprofile);
      setOpenModal("none");
      toast.success("La informacion basica fue actualizada.");
    } catch (error) {
      toast.error("No se pudo actualizar la informacion basica.");
    }
  };

  // save Skills information
  const handleSaveSkills = async (dataSkill: Skill[]) => {
    try {
      const toCreate = dataSkill.filter((item: any) =>
        item.id.startsWith("temp-"),
      );
      const toDelete =
        profile?.skills?.filter(
          (orig: any) => !dataSkill.some((curr: any) => curr.id === orig.id),
        ) ?? [];
      const toUpdate = dataSkill.filter((curr: any) => {
        if (curr.id.startsWith("temp-")) return false;
        const original = profile?.skills?.find(
          (orig: any) => orig.id === curr.id,
        );
        return (
          original &&
          (original.id_category !== curr.id_category ||
            original.level !== curr.level ||
            original.name !== curr.name)
        );
      });

      await Promise.all([
        ...toCreate.map((sk: Skill) =>
          profilesService.addSkill({
            category_id: sk.id_category ?? "",
            name: sk.name,
            level: sk.level,
          }),
        ),
        ...toUpdate.map((sk: Skill) =>
          profilesService.updateSkill(sk.id, {
            category_id: sk.id_category,
            name: sk.name,
            level: sk.level,
          }),
        ),
        ...toDelete.map((sk: Skill) => profilesService.deleteSkill(sk.id)),
      ]);
      const resprofile: TalentProfile = await profilesService.getMyProfile();
      setProfile(resprofile);
      setOpenModal("none");
      toast.success("Las habilidades fueron actualizadas.");
    } catch (error) {
      toast.error("No se pudieron actualizar las habilidades.");
    }
  };

  // Tab content components
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* About Section*/}
      <Card>
        <CardContent>
          <h3 className="text-base font-semibold text-foreground mb-3">
            Acerca de
          </h3>
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {" "}
              {profile?.about}
            </p>
            <ButtonEdit
              onExecute={() => setOpenModal("about")}
              label="Editar descripcion"
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Information  */}
      <Card>
        <CardContent>
          <h3 className="text-base font-semibold text-foreground mb-4">
            Informacion basica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ButtonEdit
              onExecute={() => setOpenModal("basicInfo")}
              label="Editar informacion basica"
            />
            <InfoItem
              label="Nivel de experiencia"
              value={`${profile?.experience_level ?? ""}`}
            />

            <div className="flex flex-col gap-2">
              <span className="text-base font-semibold text-foreground">
                Idiomas
              </span>
              {profile?.languages_talent?.map((language) => (
                <span
                  key={language.id}
                  className="text-sm text-muted-foreground"
                >
                  {language.languages?.name} ({language.level})
                </span>
              ))}
            </div>
            <InfoItem
              label="Formacion"
              value={`${profile?.learning_backgrounds?.name ?? ""}`}
            />
            <InfoItem
              label="Disponible para oportunidades"
              value={`${profile?.opportunity_statuses?.name ?? ""}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SkillsTab = () => {
    const skills = profile?.skills || [];
    const groupedSkills = skills.reduce(
      (acc, skill) => {
        if (!skill.id_category || !skill.category) return acc;

        if (!acc[skill.id_category]) {
          acc[skill.id_category] = {
            category: skill.category,
            skills: [],
          };
        }

        acc[skill.id_category].skills.push(skill);
        return acc;
      },
      {} as Record<
        string,
        { category: { id: string; name: string }; skills: Skill[] }
      >,
    );
    return (
      <div className="space-y-6">
        {/* Verified Skills */}
        <Card>
          <CardContent>
            <h3 className="text-base font-semibold text-foreground mb-4">
              Habilidades verificadas
            </h3>
            <div className="space-y-4">
              <ButtonEdit
                onExecute={() => setOpenModal("skills")}
                label="Editar habilidades"
              />
              {Object.values(groupedSkills).map(({ category, skills }) => (
                <SkillsSection
                  key={category.id}
                  title={category.name}
                  skills={skills}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const ActivityTab = () => {
    //example
    return (
      <div className="space-y-6">
        <Card>
          <CardContent>
            <ChallengesSection challenges={challenges} isLoading={loading} />
          </CardContent>
        </Card>
      </div>
    );
  };

  const tabs = [
    { label: "Resumen", content: <OverviewTab /> },
    { label: "Habilidades", content: <SkillsTab /> },
    { label: "Actividad", content: <ActivityTab /> },
  ];
  //loading spiner
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <LoadingSpinner
          size="md"
          message="Cargando perfil"
          className="profile"
        />
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="mx-auto space-y-10">
          {/* title profile */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Perfil</h1>
            <p className="text-muted-foreground mt-1">
              Administra y revisa tu perfil
            </p>
          </div>
          {/*if profile not load show alert else show header card  */}
          {!profile ? (
            <ErrorAlert
              message="Error al cargar el perfil. Intenta de nuevo."
              onRetry={loadProfileData}
            />
          ) : (
            <>
              <Card>
                <CardContent>
                  <ButtonEdit
                    onExecute={() => setOpenModal("userInfo")}
                    label="Editar perfil"
                  />
                  <ProfileHeader
                    name={`${profile?.first_name + " " + profile?.last_name}`}
                    title={`${profile?.title}`}
                    email="alex.11smith@example.com"
                    location={`${profile?.location}`}
                    contact={profile?.contact}
                    avatar={`${profile?.image_url}`}
                    progress={profile?.profile_completeness ?? 0}
                  />
                </CardContent>
              </Card>
              {/* Tabs*/}
              <Tabs tabs={tabs} defaultTab={0} />
            </>
          )}
        </div>
      </div>
      {/* Modals*/}
      <Modal
        isOpen={openModal === "userInfo"}
        onClose={() => setOpenModal("none")}
        title="Editar informacion de usuario"
        size="lg"
      >
        <UserInfoFormModal
          initialData={{
            first_name: `${profile?.first_name}`,
            last_name: `${profile?.last_name}`,
            title: profile?.title || "",
            location: profile?.location || "",
            contacts: backendContactsToArray(profile?.contact),
            currentAvatarUrl: profile?.image_url,
          }}
          onSubmit={handleSaveUserInfo}
          onCancel={() => setOpenModal("none")}
        />
      </Modal>

      <Modal
        isOpen={openModal === "about"}
        onClose={() => setOpenModal("none")}
        title="Editar descripcion"
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
        title="Editar informacion basica"
        size="lg"
      >
        <BasicInfoFormModal
          initialData={{
            experienceLevel: profile?.experience_level || "",
            learningBackground: profile?.learning_backgrounds?.id || "",
            openToOpportunities: profile?.opportunity_statuses?.id || "",
          }}
          initialLanguages={profile?.languages_talent || []}
          catalogs={catalogs}
          onSubmit={handleSaveBasicInfo}
          onCancel={() => setOpenModal("none")}
        />
      </Modal>

      <Modal
        isOpen={openModal === "skills"}
        onClose={() => setOpenModal("none")}
        title="Editar habilidades"
        size="md"
      >
        <SkillsFormModal
          initialData={profile?.skills}
          catalogs={catalogs}
          onSubmit={handleSaveSkills}
          onCancel={() => setOpenModal("none")}
        />
      </Modal>

      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={4000}
      />
    </>
  );
}

const backendContactsToArray = (
  contacts?: Record<string, any> | null,
): Contact[] => {
  if (!contacts) return [];

  return Object.entries(contacts).map(([type, value]) => ({
    id: crypto.randomUUID(),
    type,
    value: String(value),
  }));
};

const contactsArrayToBackend = (contacts: Contact[]) => {
  return contacts.reduce(
    (acc, c) => {
      if (c.type && c.value) acc[c.type] = c.value;
      return acc;
    },
    {} as Record<string, string>,
  );
};
