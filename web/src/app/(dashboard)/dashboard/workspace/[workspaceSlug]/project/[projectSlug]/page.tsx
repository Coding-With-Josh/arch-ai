const Page = ({ params: { projectSlug } }: { params: { projectSlug: string }}) => {
    return (
        <div>
            <h1>{projectSlug}</h1>
        </div>
    );
};

export default Page;