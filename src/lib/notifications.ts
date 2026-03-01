import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Sanitize error messages so raw technical errors never reach the user.
 * Maps known technical patterns to friendly, human-readable messages.
 */
const sanitizeErrorMessage = (message: string): string => {
  if (!message || typeof message !== "string") {
    return "Something went wrong. Please try again.";
  }

  const raw = message.trim();

  // ── HTML / DOCTYPE responses (server returned HTML instead of JSON) ──
  if (
    raw.includes("<!DOCTYPE") ||
    raw.includes("<html") ||
    raw.includes("Unexpected token '<'") ||
    raw.includes("is not valid JSON")
  ) {
    return "Unable to connect to the server. Please try again later.";
  }

  // ── Network / Connectivity errors ──
  if (
    raw.includes("Failed to fetch") ||
    raw.includes("NetworkError") ||
    raw.includes("ERR_CONNECTION") ||
    raw.includes("net::") ||
    raw.includes("ECONNREFUSED")
  ) {
    return "Network error. Please check your internet connection.";
  }

  // ── Timeout errors ──
  if (raw.includes("timeout") || raw.includes("Timeout")) {
    return "The request took too long. Please try again.";
  }

  // ── JavaScript runtime errors that should never reach users ──
  if (
    raw.startsWith("SyntaxError") ||
    raw.startsWith("TypeError") ||
    raw.startsWith("ReferenceError") ||
    raw.startsWith("RangeError")
  ) {
    return "Something went wrong. Please try again or contact support.";
  }

  // ── Server error codes ──
  if (raw.includes("500") || raw.includes("Internal Server Error")) {
    return "A server error occurred. Please try again later.";
  }
  if (raw.includes("502") || raw.includes("Bad Gateway")) {
    return "The server is temporarily unavailable. Please try again later.";
  }
  if (raw.includes("503") || raw.includes("Service Unavailable")) {
    return "The service is temporarily unavailable. Please try again later.";
  }
  if (raw.includes("401") || raw.includes("Unauthorized")) {
    return "Your session has expired. Please log in again.";
  }
  if (raw.includes("403") || raw.includes("Forbidden")) {
    return "You do not have permission to perform this action.";
  }
  if (raw.includes("404") || raw.includes("Not Found")) {
    return "The requested resource could not be found.";
  }
  if (raw.includes("409") || raw.includes("Conflict")) {
    return "This record conflicts with an existing entry. Please review and try again.";
  }
  if (raw.includes("422") || raw.includes("Unprocessable")) {
    return "The submitted data is invalid. Please check your inputs.";
  }
  if (raw.includes("429") || raw.includes("Too Many Requests")) {
    return "Too many requests. Please wait a moment before trying again.";
  }

  // ── Very long error messages (likely stack traces or raw dumps) ──
  if (raw.length > 200) {
    return "An unexpected error occurred. Please try again or contact support.";
  }

  // If the message is already clean/short, pass it through
  return raw;
};

export const notify = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options?: ToastOptions) => {
    console.error("Notification Error:", message);
    const userMessage = sanitizeErrorMessage(message);
    toast.error(userMessage, { ...defaultOptions, ...options });
  },
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },
  warning: (message: string, options?: ToastOptions) => {
    toast.warn(message, { ...defaultOptions, ...options });
  },
};
