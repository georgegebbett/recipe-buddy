"use client"

import { cn } from "~/lib/utils"
import { Input, InputProps } from "~/components/ui/input"

interface RecipeTitleInputProps extends InputProps {}

export function RecipeTitleInput({
  className,
  ...props
}: RecipeTitleInputProps) {
  return (
    <Input className={cn("py-6 text-3xl md:text-4xl", className)} {...props} />
  )
}
