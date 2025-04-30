import { auth } from "@/app/api/auth/[...nextauth]/auth-options";
import ClientPage from "./client-page";
import prisma from "@/lib/prisma";

const Page = async ({ params }: { params: { workspaceSlug: string } }) => {

    const session = await auth()
    const { workspaceSlug } = await params;
    const currentWorkspace = await prisma.workspace.findFirst({
        where: {
            slug: workspaceSlug,
        },
        include: {
            _count: {
                select: {
                    projects: true,
                },
            },
            projects: true,

        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const currentMembership = await prisma.workspaceMembership.findFirst({
        where: {
            workspaceId: currentWorkspace?.id,
            userId: session?.user.id,
        },
    });

    return (
        <ClientPage params={params} currentWorkspace={currentWorkspace} session={session} currentMembership={currentMembership} />
    );
};

export default Page;