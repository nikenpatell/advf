import toast from "react-hot-toast";

/**
 * Extracts a user-friendly error message from any error object.
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return (
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong. Please try again."
    );
  }

  return "An unexpected error occurred.";
}

/**
 * Shows a toast and logs the error globally.
 * Use this in catch blocks.
 */
export function handleError(error: unknown, silent = false): string {
  const message = getErrorMessage(error);
  if (!silent) {
    toast.error(message);
  }
  console.error("[Error]", error);
  return message;
}
