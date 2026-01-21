import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export const handleHttpError = (error: AxiosError): void => {
  if (!error.response) {
    console.error("[HTTP] Network error or no response received from server.");
    return;
  }

  const { status, data } = error.response;
  const apiError = data as ApiErrorResponse;

  switch (status) {
    case 400:
      console.warn("[HTTP] Bad Request:", apiError.message || apiError.error);
      break;

    case 401:
      console.warn("[HTTP] Unauthorized. Token invalid or expired.");
      break;

    case 403:
      console.warn("[HTTP] Forbidden. No permission for this action.");
      break;

    case 404:
      console.warn("[HTTP] Resource not found.");
      break;

    case 500:
      console.error("[HTTP] Internal server error.");
      break;

    case 503:
      console.error("[HTTP] Service unavailable.");
      break;

    default:
      console.error(`[HTTP] Unexpected error (${status}):`, apiError);
  }
};
