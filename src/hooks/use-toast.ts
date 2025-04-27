
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Updated toast function that handles both the string format and the object format
export function toast(titleOrProps: string | ToastProps, props?: ToastProps) {
  if (typeof titleOrProps === "string") {
    // New format: toast("Title", { description: "Description" })
    sonnerToast(titleOrProps, props);
  } else {
    // Old format: toast({ title: "Title", description: "Description" })
    sonnerToast(titleOrProps.title || "", {
      description: titleOrProps.description,
      // Forward any other properties from the original object
      ...titleOrProps,
    });
  }
}

// For compatibility with components expecting the older useToast format
export const useToast = () => {
  return {
    toast,
    // This is needed for the Toaster component
    toasts: [], // Empty array to satisfy the type
  };
};
