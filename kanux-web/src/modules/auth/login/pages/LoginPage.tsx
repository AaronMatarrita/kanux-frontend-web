"use client";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "../components";
import { authService } from "@/services";
import styles from "../styles/login.module.css";
import type { LoginFormData } from "../types";

/**
 * Login Page
 * Main entry point for user authentication
 *
 * Specifications:
 * - Email field
 * - Password field
 * - Login button
 * - "Don't have an account? Sign up" link
 */
export const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setSubmitError(undefined);

    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("kanux_token", response.token);
      localStorage.setItem("kanux_session", response.sessionId);
      localStorage.setItem("kanux_user", JSON.stringify(response.user));

      console.log("Login successful:", response.user);

      router.push("/dashboard");
    } catch (error) {
      let errorMessage = "Error al iniciar sesión";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message ?? "Correo o contraseña inválidos";
      }

      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Branding Side */}
      <div className={styles.brandingSide}>
        <div className={styles.brandingHeader}>
          <svg
            width="400"
            height="400"
            viewBox="70.5 10 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: "60px",
              height: "60px",
              flexShrink: 0,
              border: "2px solid white",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "8px",
            }}
          >
            <g clipPath="url(#clip0_215_5913)">
              <path
                d="M72.2888 22.6929V30.6725H77.2716V23.6521C77.2518 23.6529 77.232 23.6537 77.2122 23.6545C76.6922 23.6332 76.1737 23.5866 75.6584 23.515V29.0744H73.9114V23.1825C73.3622 23.048 72.8205 22.8846 72.2888 22.6929Z"
                fill="#284B8C"
              />
              <path
                d="M72.2888 11.4819V19.1251C72.8142 19.3742 73.3564 19.5868 73.9114 19.7614V13.0725H75.6584V19.2954L77.2716 17.6386V11.4819H72.2888Z"
                fill="#284B8C"
              />
              <path
                d="M72.2888 20.0039V21.6512C72.819 21.8587 73.3608 22.0359 73.9114 22.182C74.486 22.3364 75.0693 22.4565 75.6584 22.5419C75.8908 22.575 76.1239 22.6027 76.3576 22.625L74.5539 20.7725C74.3383 20.72 74.1241 20.6621 73.9114 20.5989C73.3582 20.4355 72.8162 20.2367 72.2888 20.0039Z"
                fill="#2EAA50"
              />
              <path
                d="M82.56 11.4814L77.2969 17.6386L78.4144 18.7862L83.2711 13.1046H85.5329L79.6188 20.0233L79.7453 20.1532C80.5508 20.0224 81.3416 19.8141 82.1064 19.5313L88.9873 11.4814H82.56Z"
                fill="#284B8C"
              />
              <path
                d="M83.2218 22.6289C82.8684 22.7762 82.5099 22.9108 82.1468 23.0324C81.9767 23.0703 81.8059 23.1055 81.6347 23.1379L86.5287 29.0428H84.2954L79.7364 23.5291C79.7256 23.5313 79.7149 23.5336 79.7041 23.5358C79.0597 23.6057 78.4116 23.6366 77.7634 23.6281L83.6191 30.6707H89.9174L83.2218 22.6289Z"
                fill="#284B8C"
              />
              <path
                d="M75.2815 20.6014L77.2842 22.6582L79.2869 20.6014L77.2842 18.5445L75.2815 20.6014Z"
                fill="#2EAA50"
              />
              <path
                d="M91.8472 10.7227L91.6947 10.8341L89.956 12.1055L88.043 13.5042L89.5344 13.671L89.7072 13.6903C89.6223 13.8894 89.5326 14.0865 89.438 14.2813C89.1 14.8906 88.7143 15.4727 88.2844 16.0222C87.8546 16.5717 87.3819 17.0868 86.8707 17.5629C86.3596 18.0391 85.8115 18.4747 85.2317 18.8657C84.6518 19.2568 84.0419 19.6021 83.4076 19.8984C82.7732 20.1948 82.1164 20.4413 81.4431 20.6357C80.9105 20.78 80.3694 20.8915 79.8229 20.9696L78.187 22.6497C78.5816 22.6492 78.9761 22.6332 79.3694 22.6018C80.0757 22.5229 80.7754 22.3941 81.4632 22.2164C82.151 22.0388 82.8251 21.8127 83.4805 21.5398C84.1358 21.267 84.7707 20.9481 85.3803 20.5856C85.9899 20.2232 86.5726 19.818 87.124 19.3732C87.6755 18.9285 88.1943 18.4453 88.6764 17.9273C89.1585 17.4094 89.6027 16.8579 90.0057 16.2772C90.4086 15.6965 90.7693 15.088 91.085 14.4564C91.107 14.4039 91.1288 14.3512 91.1502 14.2985L92.4164 15.3427L91.8472 10.7227Z"
                fill="#2EAA50"
              />
            </g>
            <defs>
              <clipPath id="clip0_215_5913">
                <rect
                  width="22"
                  height="22"
                  fill="currentColor"
                  transform="translate(70.5 10)"
                />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.brandingText}>Kánux</div>
        </div>

        <div className={styles.brandingContent}>
          <h1 className={styles.brandingTitle}>
            Build skills.
            <br />
            Discover talent. Grow
            <br />
            together.
          </h1>
          <p className={styles.brandingDescription}>
            Kánux connects professionals and companies through real challenges
            and verified skills.
          </p>
        </div>

        <div style={{ height: "40px" }} />
      </div>

      <div className={styles.formSide}>
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          submitError={submitError}
        />
      </div>
    </div>
  );
};

export default LoginPage;
