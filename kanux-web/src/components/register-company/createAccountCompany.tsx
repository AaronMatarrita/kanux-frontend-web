"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "./formInput";

interface FormData {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function CreateAccountCompany() {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.companyName) 
        newErrors.companyName = "El nombre de la compañía es requerido";

    if (!formData.email) 
        newErrors.email = "El email es requerido";

    else if (!/\S+@\S+\.\S+/.test(formData.email)) 
        newErrors.email = "Email inválido";

    if (!formData.password) 
        newErrors.password = "La contraseña es requerida";

    else if (formData.password.length < 8) 
        newErrors.password = "La contraseña debe tener al menos 8 caracteres";

    if (!formData.confirmPassword)
         newErrors.confirmPassword = "Confirma tu contraseña";

    else if (formData.password !== formData.confirmPassword) 
        newErrors.confirmPassword = "Las contraseñas no coinciden";


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // handle form submit 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/onboarding/register-company/about");
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">¡Cuenta creada exitosamente!</h2>
        <p>Redirigiendo al siguiente paso...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* title */}
      <div className="mb-6">
        <h1 className="text-center text-2xl font-bold text-blue-800 mb-2">Create your company account</h1>
        <p className="text-center text-gray-500 text-sm">Start your journey by creating your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Google Sign in */}
        <button
          type="button"
          className="w-full border border-gray-300 text-gray-700 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <text x="12" y="16" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#4285F4">
              G
            </text>
          </svg>
          <span className="text-sm font-medium">Google Sign in</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-xs text-gray-500 font-medium">OR SIGN UP WITH EMAIL</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        {/* Company name */}
        <FormInput 
        label="Company name"
          name="companyName"
          isPassword={false}
          placeholder="Your Company Inc."
          value={formData.companyName}
          onChange={handleChange}
          error={errors.companyName}
        />  
        {/* company email */}
        <FormInput
          label="Company email"
          type="email"
          name="email"
          placeholder="company@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}  
          isPassword={false}
        />
        {/* Password */}
        <FormInput
            label="Password"
            name="password"
            placeholder="Create a password"
            isPassword={true}
            helperText="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
        />
        {/* Confirm Password */}
        <FormInput
            label="Confirm password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            isPassword={true}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
        />
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-medium text-sm transition-colors mt-6"
        >
          Create account
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
