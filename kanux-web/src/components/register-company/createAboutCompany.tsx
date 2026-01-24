"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "./formInput";
import { companiesService } from "@/services";
import { RegisterCompanyRequest } from "@/services/companies.service";
import { CompanyAbout } from "@/config/companyAbout.config";




export function CreateAboutCompany() {
    
    const idUser =  "get user "; //useAuthStore((state: any) => state.idUser);

    const [companyAbout, setCompanyAbout] = useState<CompanyAbout>({
        companyName: "",
        description: "",
        contact: "",
        location: "",
        goal: "hiring",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    //handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyAbout({ ...companyAbout, [e.target.name]: e.target.value });
    };

    const handleGoalChange = (goal: "hiring" | "challenges" | "both") => {
        setCompanyAbout({ ...companyAbout, goal });
    };
    //validation inputs
    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!companyAbout.companyName)
            newErrors.companyName = "El nombre de la compañía es requerido";

        if (!companyAbout.description)
            newErrors.description = "La descripción es requerida";

        if (!companyAbout.contact)
            newErrors.contact = "El número de contacto es requerido";

        else if (!/^\+?[1-9]\d{7,14}$/.test(companyAbout.contact))
            newErrors.contact = "Número de contacto inválido";

        if (!companyAbout.location)
            newErrors.location = "La ubicación es requerida";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // handle form submit 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            try {
                // parse to dto
                const registerRequest: RegisterCompanyRequest = {
                    name: companyAbout.companyName,
                    about: companyAbout.description,
                    location: companyAbout.location,
                    goal: companyAbout.goal,
                    contact: { phone: companyAbout.contact }
                };
                // request to service
                const response = await companiesService.registerCompany(
                    idUser,// user id
                    registerRequest
                );

                setSuccess(true);
                // here need show success message and redirect to dashboard
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);

            } catch (error) {
                console.error("Error en el registro:", error);
                setErrors({ server: "Hubo un error al registrar la empresa. Inténtalo de nuevo." });
            }finally{
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="w-full">
            {/* title */}
            <div className="mb-6">
                <h1 className="text-center text-3xl font-bold text-blue-800 mb-2">Tell us about your company</h1>
            </div>
            {/* details */}
            <div className="mb-8">
                <p className="text-left font-bold text-black text-sm">COMPANY DETAILS</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Company name */}
                <FormInput
                    label="Company name"
                    name="companyName"
                    isPassword={false}
                    placeholder="Your Company Inc."
                    value={companyAbout.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                />
                {/* company description */}
                <FormInput
                    label="Slogan / Short description"
                    name="description"
                    placeholder="Your company’s tagline"
                    value={companyAbout.description}
                    onChange={handleChange}
                    error={errors.description}
                    isPassword={false}
                />
                {/* contact */}
                <FormInput
                    label="Contact"
                    name="contact"
                    placeholder="+506 0000-0000"
                    isPassword={false}
                    helperText="At least 8 characters"
                    value={companyAbout.contact}
                    onChange={handleChange}
                    error={errors.contact}
                />
                {/* location */}
                <FormInput
                    label="Location"
                    name="location"
                    placeholder="San Francisco, USA"
                    isPassword={false}
                    value={companyAbout.location}
                    onChange={handleChange}
                    error={errors.location}
                />
                {/* company goals */}
                <div>
                    <div className="flex items-baseline gap-2 mb-4 ">
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Company Goal</h2>
                        <span className="text-xs text-gray-500">optional</span>
                    </div>

                    <div className="flex gap-3 flex-wrap m-2">
                        {/* hirint talent */}
                        <button
                            type="button"
                            onClick={() => handleGoalChange("hiring")}
                            className={`px-6 py-3 rounded-lg font-medium text-sm transition-colors  pb-5 pt-5 
                            ${companyAbout.goal === "hiring"
                                    ? "bg-green-100 text-green-700 border-2 border-none"
                                    : "border-1 border-gray-300 text-gray-700 hover:border-gray-400"
                                }`}
                        >
                            Hiring talent
                        </button>
                        {/*  running skills challenges */}
                        <button
                            type="button"
                            onClick={() => handleGoalChange("challenges")}
                            className={`px-6 py-3 rounded-lg font-medium text-sm transition-colors pb-5 pt-5  
                                ${companyAbout.goal === "challenges"
                                    ? "bg-green-100 text-green-700 border-2 border-none"
                                    : "border-1 border-gray-300 text-gray-700 hover:border-gray-400"
                                }`}
                        >
                            Running skill challenges
                        </button>
                        {/* both */}
                        <button
                            type="button"
                            onClick={() => handleGoalChange("both")}
                            className={`px-6 py-3 rounded-lg font-medium text-sm transition-colors  pb-5 pt-5
                            ${companyAbout.goal === "both"
                                    ? "bg-green-100 text-green-700 border-2 border-none"
                                    : "border-1 border-gray-300 text-gray-700 hover:border-gray-400"
                                }`}
                        >
                            Both
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-medium text-sm transition-colors mt-6"
                >
                    {isLoading ? "Registering company..." : "Finish setup"}
                </button>
            </form>

            {/* Sign in link */}
            <div className="text-center mt-4">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <a href="#" className="text-sm text-green-500 hover:text-green-600 font-medium">
                    Sign in
                </a>
            </div>

        </div>
    );
}

