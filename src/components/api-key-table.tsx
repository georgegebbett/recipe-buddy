"use client"

import { useState } from "react"
import { api } from "~/trpc/react"
import { Button } from "~/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Icons } from "~/components/icons"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"

interface ApiKeyTableProps {
  baseUrl: string
}

export function ApiKeyTable({ baseUrl }: ApiKeyTableProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  const utils = api.useUtils()
  const { data: apiKeys } = api.apiKeys.list.useQuery()

  const generateMutation = api.apiKeys.generate.useMutation({
    onSuccess: (data) => {
      setNewApiKey(data.key)
      setShowNewKeyDialog(true)
      setOpen(false)
      setName("")
      void utils.apiKeys.list.invalidate()
      toast.success("API key generated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const deleteMutation = api.apiKeys.delete.useMutation({
    onSuccess: () => {
      void utils.apiKeys.list.invalidate()
      toast.success("API key deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleGenerate = () => {
    if (!name.trim()) {
      toast.error("Please enter a name for the API key")
      return
    }
    generateMutation.mutate({ name })
  }

  const handleCopy = async () => {
    if (newApiKey) {
      await navigator.clipboard.writeText(newApiKey)
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
      toast.success("API key copied to clipboard")
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Never"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const maskApiKey = (key: string) => {
    return `${key.slice(0, 8)}...${key.slice(-4)}`
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold">API Keys</p>
          <p className="text-sm text-muted-foreground">
            Manage API keys for programmatic access to your recipes
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icons.add className="mr-2 size-4" />
              Generate API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to access your recipes programmatically.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Mobile App, CI/CD Pipeline"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleGenerate()
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  setName("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isLoading}
              >
                {generateMutation.isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                Generate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* New API Key Display Dialog */}
      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Generated</DialogTitle>
            <DialogDescription>
              Make sure to copy your API key now. You won&apos;t be able to see it
              again!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Your API Key</Label>
                  <div className="flex gap-2">
                <Input
                  readOnly
                  value={newApiKey || ""}
                  className="font-mono text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  title="Copy to clipboard"
                >
                  {copiedKey ? (
                    <Icons.check className="size-4" />
                  ) : (
                    <Icons.copy className="size-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="rounded-lg border bg-muted p-4">
              <p className="text-sm font-medium">Usage Example:</p>
              <code className="mt-2 block text-xs">
                curl -H &quot;X-API-Key: {newApiKey}&quot;{" "}
                {baseUrl}/api/trpc/recipe.list
              </code>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowNewKeyDialog(false)
                setNewApiKey(null)
                setCopiedKey(false)
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys && apiKeys.length > 0 ? (
              apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {maskApiKey(apiKey.key)}
                  </TableCell>
                  <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                  <TableCell>{formatDate(apiKey.lastUsedAt)}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deleteMutation.isLoading}
                        >
                          <Icons.trash className="size-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the API key &quot;
                            {apiKey.name}&quot;. Any applications using this key
                            will no longer be able to access your recipes.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              deleteMutation.mutate({ id: apiKey.id })
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No API keys yet. Generate one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
