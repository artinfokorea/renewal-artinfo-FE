"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
// import * as Sentry from "@sentry/nextjs";

const error = ({ error }: { error: Error & { digest?: string } }) => {
  const router = useRouter();

  useEffect(() => {
    console.log("error", error);
    // Sentry.captureException(error);
  }, []);

  return (
    <div className="w-full h-full flex justify-center flex-col items-center">
      <h2 className="my-[40px] text-2xl">페이지를 찾을수 없습니다.</h2>
      <div>
        <Button
          className="rounded-md md:inline-block text-lg text-error py-6 px-12"
          onClick={() => router.push("/")}
        >
          메인 페이지로 돌아가기
        </Button>
      </div>
    </div>
  );
};

export default error;
