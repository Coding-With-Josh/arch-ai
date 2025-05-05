"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ProjectType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { launchEditor } from "../_actions/launch-editor"

const formSchema = z.object({
    name: z.string().min(1).max(50),
    description: z.string().min(1).max(300),
    slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, {
        message:
            "Slug can only contain lowercase letters, numbers, and dashes",
    }),
})

export function LaunchEditorForm({
    projectId,
    closeDialog,
}: {
    projectId: string
    closeDialog?: () => void
}) {
    const router = useRouter()
    const params = useParams()
    const { workspaceSlug, projectSlug } = params
    const [loading, setLoading] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
        },
    })

    const slugify = (value: string) =>
        value.toLowerCase().replace(/[^a-z0-9-]/g, "-")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const data = { ...values, projectId }
        try {
            setLoading(true)
            launchEditor(data)
            router.refresh()
            closeDialog?.()
            router.push(`/${workspaceSlug}/${projectSlug}/editors/${data.slug}`)
        } catch (error) {
            console.error("Failed to launch editor:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 pt-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Untitled 1"
                                    {...field}
                                    className="border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600"
                                    onChange={(e) => {
                                        // update name value
                                        field.onChange(e)
                                        // update slug synchronously
                                        const slug = slugify(e.target.value)
                                        form.setValue("slug", slug)
                                    }}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">
                                Slug
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="untitled-1"
                                    {...field}
                                    className="border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600"
                                    onChange={(e) => {
                                        const value = e.target.value
                                            .toLowerCase()
                                            .replace(/[^a-z0-9-]/g, "-")
                                        field.onChange(value)
                                    }}
                                />
                            </FormControl>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                This will be used in the URL: /editors/
                                <span className="text-gray-600 dark:text-gray-300">
                                    {field.value || "slug"}
                                </span>
                            </p>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">
                                Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={4}
                                    placeholder="Untitled 1"
                                    {...field}
                                    className="border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                {/* Additional select field code commented out for reference */}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Setting up..." : "Launch Editor"}
                </Button>
            </form>
        </Form>
    )
}
