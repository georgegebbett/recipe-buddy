"use client"

import * as React from "react"
import { useState } from "react"
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ScrapeRecipe,
  ScrapeRecipeSchema,
} from "~/server/api/modules/recipes/procedures/scrapeRecipeSchema"
import { api } from "~/trpc/react"
import { useForm } from "react-hook-form"

import { cn } from "~/lib/utils"
import { Button, ButtonProps, buttonVariants } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Icons } from "~/components/icons"

interface NewRecipeDialogProps extends ButtonProps {}
export const NewRecipeDialog = ({
  className,
  variant,
  ...props
}: NewRecipeDialogProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm<ScrapeRecipe>({
    resolver: zodResolver(ScrapeRecipeSchema),
  })

  const utils = api.useContext()

  const { mutate, isLoading } = api.recipe.scrape.useMutation({
    onSuccess: () => {
      utils.recipe.list.invalidate()
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            buttonVariants({ variant }),
            {
              "cursor-not-allowed opacity-60": isLoading,
            },
            className
          )}
          disabled={isLoading}
          type="submit"
          {...props}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <Icons.add className="mr-2 size-4" />
          )}
          Add recipe
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Recipe</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Form {...form}>
            <form id="addRecipe" onSubmit={form.handleSubmit((a) => mutate(a))}>
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL of the recipe to scrape
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                name="url"
                control={form.control}
              />
            </form>
          </Form>
        </DialogBody>
        <DialogFooter>
          <Button disabled={isLoading} type="submit" form="addRecipe">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
