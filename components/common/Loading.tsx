import React from "react";

interface Props {
  className?: string;
}

const Loading = ({ className }: Props) => {
  return <span className={`loader ${className}`} />;
};

export default Loading;
