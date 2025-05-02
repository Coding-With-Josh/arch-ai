// app/workspaces/client-page.tsx
'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useTheme } from 'next-themes'
import { WorkspaceWithDetails } from '@/types/workspace'
import { Boxes, FolderOpen, MoreVertical, Option, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'


interface ClientPageProps {
  workspaces: WorkspaceWithDetails[]
  currentUserId: string
}

export default function ClientPage({ workspaces, currentUserId }: ClientPageProps) {
  const { theme } = useTheme()

  const getRoleBadge = (workspace: WorkspaceWithDetails) => {
    if (workspace.ownerId === currentUserId) {
      return <Badge className="text-xs px-2 py-[3px] rounded-full bg-zinc-200/70 border-zinc-200 text-zinc-700 dark:text-gray-300 cursor-pointer dark:hover:bg-zinc-900/40 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/30 gap-2"><span className="size-[0.45rem] bg-orange-500 rounded-full" />Owner</Badge>

    }

    const membership = workspace.memberships.find(m => m.userId === currentUserId)
    if (!membership) return null

    const variantMap = {
      ADMIN: 'bg-blue-600 hover:bg-blue-700',
      MEMBER: 'bg-zinc-600 hover:bg-zinc-700',
      DEVELOPER: 'bg-purple-600 hover:bg-purple-700',
      DESIGNER: 'bg-pink-600 hover:bg-pink-700',
      GUEST: 'bg-amber-600 hover:bg-amber-700'
    }

    return (
      <Badge className={variantMap[membership.role]}>
        {membership.role.toLowerCase()}
      </Badge>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Choose a workspace</h1>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Link href={`/${workspace.slug}`}>
              <Card key={workspace.id} className="hover:shadow-lg transition-all cursor-pointer relative rounded-2xl py-4 dark:hover:bg-zinc-900/30 border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/10 shadow-sm border hover:border-zinc-300 dark:hover:border-zinc-800">
                <div className="absolute top-4 right-4 " onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-3">
                    <CardTitle className="flex items-center gap-3.5">
                      <Avatar className="size-8 rounded-md">
                        <AvatarImage src={workspace.logo || ''} />
                        <AvatarFallback className='text-sm font-semibold rounded-md'>
                          {workspace.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-zinc-900 dark:text-zinc-100 text-lg font-semibold ">
                        {workspace.name}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-zinc-500 mt-2 dark:text-zinc-400">
                      {workspace.description || 'No description'}
                    </CardDescription>
                  </div>
                  {getRoleBadge(workspace)}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center">
                      <FolderOpen className="mr-1 h-4 w-4" />
                      {workspace._count.projects} projects
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {workspace._count.memberships} members
                    </div>
                  </div>

                  {workspace.invitations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                        Pending invitations
                      </p>
                      <div className="space-y-2">
                        {workspace.invitations.map((invitation) => (
                          <div key={invitation.id} className="flex items-center justify-between">
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">
                              {invitation.email}
                            </span>
                            <Badge variant="outline" className="capitalize">
                              {invitation.role.toLowerCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
          <Link href={`/~/create/workspace`}>
            <Card className='border-dashed flex items-center justify-center cursor-pointer hover:bg-zinc-300/70 dark:hover:bg-zinc-900/40 duration-300 dark:hover:border-zinc-500 transition-all py-8 rounded-xl'>
              <CardContent className='flex flex-col items-center justify-center w-full gap-5'>
                <Plus className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
                <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Create a new workspace</h2>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}