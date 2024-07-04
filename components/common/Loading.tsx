import React from "react"

interface Props {
  className?: string
}

export const Spinner = ({ className }: Props) => {
  return <span className={`loader ${className}`} />
}

export const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Spinner className="h-12 w-12" />
    </div>
  )
}
