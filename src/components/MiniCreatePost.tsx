"use client";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost = ({ session }: MiniCreatePostProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return <div>MiniCreatePost</div>;
};

export default MiniCreatePost;
