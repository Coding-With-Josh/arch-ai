import { auth } from "@/app/api/auth/[...nextauth]/auth-options";
import ClientPage from "./client-page";
import prisma from "@/lib/prisma";

const Page = async ({ params }: { params: { workspaceSlug: string, projectSlug: string } }) => {

    const session = await auth()
    const { workspaceSlug, projectSlug } = await params;
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
    const currentProject = await prisma.project.findFirst({
        where: {
            slug: projectSlug,
        },
        include: {
            _count: {
                select: {
                    editors: true,
                    studios: true,
                    milestones: true
                }
            },
            editors: true,
            studios: true,
        }

    })


    const currentMembership = await prisma.workspaceMembership.findFirst({
        where: {
            workspaceId: currentWorkspace?.id,
            userId: session?.user.id,
        },
    });


    return (
        <ClientPage params={params} currentWorkspace={currentWorkspace} session={session} currentMembership={currentMembership} currentProject={currentProject} />
    );
};

export default Page;