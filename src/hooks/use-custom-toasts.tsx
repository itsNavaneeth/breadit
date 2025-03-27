import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "./use-toast";

export const useCustomToasts = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Uh-oh! Not so fast!",
      description: "You need to be logged in to do that",
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}
          onClick={() => {
            dismiss();
          }}
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
};
