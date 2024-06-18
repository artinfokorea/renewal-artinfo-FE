"use client";

import Loading from "@/components/common/Loading";
import React from "react";

const loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Loading className="w-10 h-10" />
    </div>
  );
};

export default loading;
