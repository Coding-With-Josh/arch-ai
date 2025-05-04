import { redirect } from "next/navigation";

const Page = async ({ params}: { params: { projectSlug: string, workspaceSlug: string}}) => {
    const {workspaceSlug, projectSlug} = await params
    return redirect(`/${workspaceSlug}/${projectSlug}/overview`);
};

export default Page;