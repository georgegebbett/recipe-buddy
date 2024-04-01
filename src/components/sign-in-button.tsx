"use client"

import { signIn } from "next-auth/react"

import { Button } from "~/components/ui/button"

export const SignInButton = () => (
  <Button onClick={() => signIn()}>Sign in</Button>
)
