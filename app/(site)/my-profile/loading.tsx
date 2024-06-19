import Loading from "@/components/common/Loading";
import React from "react";

const loading = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loading className="h-12 w-12" />
    </div>
  );
};

export default loading;
