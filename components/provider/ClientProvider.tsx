"use client"

import React, { useState } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@material-tailwind/react"

interface Props {
  children: React.ReactNode
}

const ClientProvider = ({ children }: Props) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          staleTime: 60 * 1000 * 60,
        },
      },
    }),
  )
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default ClientProvider
