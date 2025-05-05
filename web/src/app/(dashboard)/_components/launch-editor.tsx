"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LaunchEditorForm } from "./launch-editor-form"
import { Card, CardContent } from "@/components/ui/card"

export function EditorDialog({
  projectId,
  isEmptyState,
}: {
  isEmptyState?: boolean;
  projectId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {isEmptyState ? (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Launch Editor
          </Button>
        ) : (
          <Card className='border-dashed w-32 flex items-center justify-center cursor-pointer hover:bg-zinc-300/70 dark:hover:bg-zinc-900/40 duration-300 dark:hover:border-zinc-500 transition-all py-8 rounded-xl'>
            <CardContent className='flex flex-col items-center justify-center w-full gap-5'>
              <Plus className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
              <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Launch a new editor</h2>
            </CardContent>
          </Card>
        )}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] border-zinc-800 bg-zinc-900/90 backdrop-blur-sm"
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-zinc-100">Launch New Editor</DialogTitle>
          <p className="text-sm text-zinc-400">
            Set up a new editor to start building your decentralized applications.
          </p>
        </DialogHeader>
        <LaunchEditorForm
          projectId={projectId}
          // ={organizationId}
          // organizationSlug={organizationSlug}
          closeDialog={() => {
            const dialogClose = document.getElementById('close-dialog')
            if (dialogClose instanceof HTMLButtonElement) {
              dialogClose.click()
            }
          }}
        />
        <button id="close-dialog" className="hidden" />
      </DialogContent>
    </Dialog>
  )
}
