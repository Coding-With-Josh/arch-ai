const Page = async ({ params}: { params: { projectSlug: string }}) => {
    const {projectSlug} = await params
    return (
        <div>
            <h1>{projectSlug}</h1>
        </div>
    );
};

export default Page;