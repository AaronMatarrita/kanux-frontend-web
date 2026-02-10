"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "./formInput";
import { authService } from "@/services";
import { PreRegisterRequest } from "@/services/auth.service";
import { getDeviceId } from "@/lib/device";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function CreateAccountCompany() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido";

    if (!formData.password) newErrors.password = "La contraseña es requerida";
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setServerError(null);

    if (validate()) {
      setIsLoading(true);
      try {
        const registerData: PreRegisterRequest = {
          userType: "company",
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          deviceId: getDeviceId(),
        };

        const response = await authService.preRegister(registerData);
        console.log("Registration successful:", response);
        //save data in local storage
        localStorage.setItem("kanux_token", response.token);
        localStorage.setItem("kanux_session", response.sessionId);
        localStorage.setItem("kanux_user_id", response.user);

        setSuccess(true);
        setTimeout(() => {
          router.push("/onboarding/register-company/about");
        }, 1500);
      } catch (error: any) {
        setServerError(
          error.response?.data?.message ||
            "Ocurrió un error al registrar la cuenta.",
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full">
      {/* title */}
      <div className="mb-6">
        <h1 className="text-center text-2xl font-bold text-foreground mb-2">
          Crea tu cuenta de empresa
        </h1>
        <p className="text-center text-muted-foreground text-sm">
          Empieza tu camino creando tu cuenta.
        </p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
          {serverError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Divider */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs text-muted-foreground font-medium"></span>
          <div className="flex-1 h-px bg-border"></div>
        </div>
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
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-medium text-sm transition-colors mt-6"
        >
          {isLoading ? "Registering..." : "Create Account"}
        </button>
      </form>

      {/* Sign in link */}
      <div className="text-center mt-4">
        <span className="text-sm text-muted-foreground">
          Ya tienes una cuenta?{" "}
        </span>
        <a
          href="#"
          className="text-sm text-green-500 hover:text-green-600 font-medium"
        >
          Inicia sesión
        </a>
      </div>
    </div>
  );
}
