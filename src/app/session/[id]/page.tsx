"use client"

import { use } from "react"
import { redirect } from "next/navigation"

export default function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  // Redirect to the new session flow
  redirect(`/session/${id}/pre-session`)
}
