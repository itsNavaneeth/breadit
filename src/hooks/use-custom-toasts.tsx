import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

export const useCustomToasts = () => {
  const loginToast = () => {
    toast.error("Uh-oh! Not so fast!", {
      description: "You need to be logged in to do that",
      duration: Infinity,
      cancel: (
        <Link
          onClick={() => {
            toast.dismiss();
          }}
          href="/sign-in"
          className={cn("", buttonVariants({ variant: "default" }), "")}>
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
};
