import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Import shadcn UI components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'

// Define your validation schema using zod
const formSchema = z.object({
    workspaceName: z.string().min(1, { message: 'Workspace name is required' }),
    description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const Page = () => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            workspaceName: '',
            description: '',
        },
    })

    function onSubmit(data: FormData) {
        console.log(data)
        // Add your create workspace logic here
    }

    return (
        <div className="max-h-screen w-screen overflow-hidden flex flex-col items-center justify-center bg-zinc-900 p-4">
            <h1 className="text-4xl font-bold mb-6 text-zinc-100">
                Create a New Workspace
            </h1>
            <p className="mb-4 text-lg text-zinc-100">
                Join the fun! Create a workspace to collaborate with your team and
                manage your projects efficiently.
            </p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-zinc-800 p-6 rounded-lg shadow-md"
                >
                    <FormField
                        control={form.control}
                        name="workspaceName"
                        render={({ field }) => (
                            <FormItem className="mb-4">
                                <FormLabel>Workspace Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Workspace Name" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="mb-4">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Description"
                                        rows={3}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Create Workspace
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default Page