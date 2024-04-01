"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CreateUser,
  CreateUserSchema,
} from "~/server/api/modules/users/procedures/createUserSchema"
import { api } from "~/trpc/react"
import { useForm } from "react-hook-form"

import { ROUTES } from "~/lib/routes"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
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

export default function Page() {
  const form = useForm<CreateUser>({
    resolver: zodResolver(CreateUserSchema),
  })

  const utils = api.useContext()

  const { mutate, isLoading } = api.users.setupUser.useMutation({
    onSuccess: () => {
      utils.users.checkIsSetup.invalidate()
    },
  })

  const { data } = api.users.checkIsSetup.useQuery()

  const { push } = useRouter()

  useEffect(() => {
    if (data) {
      push(ROUTES.recipes.root)
    }
  }, [data])

  return (
    <div className="flex flex-row items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Setup User</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="setupUser" onSubmit={form.handleSubmit((a) => mutate(a))}>
              <FormField
                render={({ field, fieldState, formState }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" {...field} />
                    </FormControl>
                    <FormDescription>The user&apos;s full name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                name="name"
                control={form.control}
              />
              <FormField
                render={({ field, fieldState, formState }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" {...field} />
                    </FormControl>
                    <FormDescription>
                      The username that will be used to log in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                name="username"
                control={form.control}
              />
              <FormField
                render={({ field, fieldState, formState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>The user&apos;s password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                name="password"
                control={form.control}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="setupUser" disabled={isLoading}>
            Create User
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
