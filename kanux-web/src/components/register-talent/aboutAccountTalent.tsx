"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TalentAbout } from "@/config/talentAbout.config";
import { TextInput } from "./TextInput";
import { TextArea } from "./TextArea";
import { LanguageInput } from "./LanguageInput";
import { ExperienceInput } from "./ExperienceInput";

export function CreateAboutTalent() {
    
    const idUser = "get user";

    const [talentAbout, setTalentAbout] = useState<TalentAbout>({
        aboutMe: "",
        basicInformation: {
            professionalTitle: "",
            phoneNumber: "",
            location: "",
            languages: [],
            experienceBackground: {
                selfTaught: false,
                studentAcademic: false,
                bootcamp: false,
                earlyProfessional: false
            }
        }
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [languageInput, setLanguageInput] = useState("");
    const router = useRouter();

    // Handle about me change
    const handleAboutMeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTalentAbout({
            ...talentAbout,
            aboutMe: e.target.value
        });
    };

    // Handle basic information changes
    const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTalentAbout({
            ...talentAbout,
            basicInformation: {
                ...talentAbout.basicInformation,
                [name]: value
            }
        });
    };

    // Handle language addition
    const handleAddLanguage = () => {
        if (languageInput.trim()) {
            setTalentAbout({
                ...talentAbout,
                basicInformation: {
                    ...talentAbout.basicInformation,
                    languages: [...talentAbout.basicInformation.languages, languageInput.trim()]
                }
            });
            setLanguageInput("");
        }
    };

    // Handle language removal
    const handleRemoveLanguage = (index: number) => {
        setTalentAbout({
            ...talentAbout,
            basicInformation: {
                ...talentAbout.basicInformation,
                languages: talentAbout.basicInformation.languages.filter((_, i) => i !== index)
            }
        });
    };

    // Handle experience background change
    const handleExperienceChange = (key: keyof typeof talentAbout.basicInformation.experienceBackground) => {
        setTalentAbout({
            ...talentAbout,
            basicInformation: {
                ...talentAbout.basicInformation,
                experienceBackground: {
                    ...talentAbout.basicInformation.experienceBackground,
                    [key]: true,
                    selfTaught: key === "selfTaught" ? true : false,
                    studentAcademic: key === "studentAcademic" ? true : false,
                    bootcamp: key === "bootcamp" ? true : false,
                    earlyProfessional: key === "earlyProfessional" ? true : false
                }
            }
        });
    };

    // Validation
    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        
        if (!talentAbout.aboutMe.trim())
            newErrors.aboutMe = "Please tell us about yourself";

        if (!talentAbout.basicInformation.professionalTitle.trim())
            newErrors.professionalTitle = "Professional title is required";

        if (!talentAbout.basicInformation.phoneNumber.trim())
            newErrors.phoneNumber = "Phone number is required";
        else if (!/^\+?[1-9]\d{7,14}$/.test(talentAbout.basicInformation.phoneNumber.replace(/[\s\-()]/g, "")))
            newErrors.phoneNumber = "Invalid phone number format";

        if (!talentAbout.basicInformation.location.trim())
            newErrors.location = "Location is required";

        if (talentAbout.basicInformation.languages.length === 0)
            newErrors.languages = "Add at least one language";

        const hasExperience = Object.values(talentAbout.basicInformation.experienceBackground).some(v => v);
        if (!hasExperience)
            newErrors.experience = "Select your experience background";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            try {
                
                setSuccess(true);
                setTimeout(() => {
                    router.push("/talent/dashboard"); //send to talent dashboard
                }, 2000);

            } catch (error) {
                console.error("Error:", error);
                setErrors({ server: "There was an error updating your profile. Please try again." });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Title Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-blue-900 mb-2">Complete your profile</h1>
                <p className="text-gray-500">This helps companies understand your background.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* ABOUT ME Section */}
                <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">About me</h2>
                    <TextArea
                        label=""
                        name="aboutMe"
                        value={talentAbout.aboutMe}
                        onChange={handleAboutMeChange}
                        placeholder="Self-taught developer focused on frontend technologies."
                        helperText="A short description (2-3 lines)"
                        error={errors.aboutMe}
                        rows={3}
                    />
                </div>

                {/* BASIC INFORMATION Section */}
                <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Basic information</h2>
                    {/* professional title */}
                    <TextInput
                        label="Professional Title"
                        type="text"
                        name="professionalTitle"
                        value={talentAbout.basicInformation.professionalTitle}
                        onChange={handleBasicInfoChange}
                        placeholder="Developer"
                        error={errors.professionalTitle}
                    />
                    {/* phone number */}
                    <TextInput
                        label="Phone number"
                        type="tel"
                        name="phoneNumber"
                        value={talentAbout.basicInformation.phoneNumber}
                        onChange={handleBasicInfoChange}
                        placeholder="+506 0000-0000"
                        error={errors.phoneNumber}
                    />
                    {/* location */}
                    <TextInput
                        label="Location"
                        type="text"
                        name="location"
                        value={talentAbout.basicInformation.location}
                        onChange={handleBasicInfoChange}
                        placeholder="San Francisco, USA"
                        error={errors.location}
                    />
                    {/* languages */}
                    <LanguageInput
                        languages={talentAbout.basicInformation.languages}
                        error={errors.languages}
                        languageInput={languageInput}
                        onLanguageInputChange={setLanguageInput}
                        onAddLanguage={handleAddLanguage}
                        onRemoveLanguage={handleRemoveLanguage}
                    />
                    {/* experience background */}
                    <ExperienceInput
                        label="Experience / Learning Background"
                        options={[
                            { key: "selfTaught", label: "Self-Taught" },
                            { key: "studentAcademic", label: "Student/Academic" },
                            { key: "bootcamp", label: "Bootcamp" },
                            { key: "earlyProfessional", label: "Early Professional" }
                        ]}
                        selectedKey={
                            Object.entries(talentAbout.basicInformation.experienceBackground).find(
                                ([_, value]) => value
                            )?.[0] || null
                        }
                        onSelect={(key) =>
                            handleExperienceChange(key as keyof typeof talentAbout.basicInformation.experienceBackground)
                        }
                        error={errors.experience}
                    />
                </div>

                {/* Continue Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white p-3 rounded-lg font-medium text-base transition-colors mt-8"
                >
                    {isLoading ? "Register profile..." : "Continue"}
                </button>
            </form>

            {/* Sign in link */}
            <div className="text-center mt-6">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <a href="/auth/login" className="text-sm text-green-500 hover:text-green-600 font-medium">
                    Sign in
                </a>
            </div>
        </div>
    );
}

