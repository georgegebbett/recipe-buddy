'use client'

import {Button} from "~/components/ui/button";
import {signIn} from "next-auth/react";

export const SignInButton = () =>  <Button onClick={() => signIn()}>Sign in</Button>
