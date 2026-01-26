"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TalentAbout } from "@/config/talentAbout.config";
import { TextInput } from "./TextInput";
import { TextArea } from "./TextArea";
import { ExperienceInput } from "./ExperienceInput";

export function CreateAboutTalent() {

    const idUser = "get user";

    const [talentAbout, setTalentAbout] = useState<TalentAbout>({
        first_name: "",
        last_name: "",
        title: "",
        location: "",
        experience_level: "",
        education: "",
        about: "",
        contact: {}
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTalentAbout({...talentAbout, [name]: value});
    };

    // Validation
    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!talentAbout.first_name?.trim())
            newErrors.first_name = "First name is required";

        if (!talentAbout.last_name?.trim())
            newErrors.last_name = "Last name is required";

        if (!talentAbout.title?.trim())
            newErrors.title = "Professional title is required";

        if (!talentAbout.location?.trim())
            newErrors.location = "Location is required";

        if (!talentAbout.experience_level?.trim())
            newErrors.experience_level = "Experience level is required";

        if (!talentAbout.education?.trim())
            newErrors.education = "Education is required";

        if (!talentAbout.about?.trim())
            newErrors.about = "Please tell us about yourself";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            try {
                // TODO: Submit talentAbout data to API
                console.log("Talent profile data:", talentAbout);
                
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
                <h1 className="text-center text-3xl font-bold text-blue-900 mb-2">Complete your profile</h1>
                <p className="text-center text-gray-500">This helps companies understand your background.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* PERSONAL INFORMATION Section */}
                <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6">Personal information</h2>
                    
                    {/* First Name */}
                    <TextInput
                        label="First Name"
                        type="text"
                        name="first_name"
                        value={talentAbout.first_name}
                        onChange={handleInputChange}
                        placeholder="John"
                        error={errors.first_name}
                    />
                    
                    {/* Last Name */}
                    <TextInput
                        label="Last Name"
                        type="text"
                        name="last_name"
                        value={talentAbout.last_name}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        error={errors.last_name}
                    />

                    {/* Professional Title */}
                    <TextInput
                        label="Professional Title"
                        type="text"
                        name="title"
                        value={talentAbout.title}
                        onChange={handleInputChange}
                        placeholder="Software Developer"
                        error={errors.title}
                    />

                    {/* Location */}
                    <TextInput
                        label="Location"
                        type="text"
                        name="location"
                        value={talentAbout.location}
                        onChange={handleInputChange}
                        placeholder="San Francisco, USA"
                        error={errors.location}
                    />

                    {/* Experience Level */}
                    <TextInput
                        label="Experience Level"
                        type="text"
                        name="experience_level"
                        value={talentAbout.experience_level}
                        onChange={handleInputChange}
                        placeholder="5 years"
                        error={errors.experience_level}
                    />

                    {/* Education */}
                    <TextInput
                        label="Education"
                        type="text"
                        name="education"
                        value={talentAbout.education}
                        onChange={handleInputChange}
                        placeholder="Bachelor in Computer Science"
                        error={errors.education}
                    />
                </div>

                {/* ABOUT ME Section */}
                <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">About me</h2>
                    <TextArea
                        label=""
                        name="about"
                        value={talentAbout.about}
                        onChange={handleInputChange}
                        placeholder="Self-taught developer focused on frontend technologies."
                        helperText="A short description (2-3 lines)"
                        error={errors.about}
                        rows={3}
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

