
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  description?: string;
  variant?: "default" | "destructive";
};

export function toast(title: string, props?: ToastProps) {
  sonnerToast(title, {
    description: props?.description,
  });
}

// For compatibility
export const useToast = () => {
  return {
    toast,
  };
};
