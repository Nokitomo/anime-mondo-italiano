
import { toast as sonnerToast } from "sonner";

// Export the toast function from sonner
export const toast = sonnerToast;

// For backwards compatibility with existing code
export const useToast = () => {
  return {
    toast: sonnerToast,
  };
};
