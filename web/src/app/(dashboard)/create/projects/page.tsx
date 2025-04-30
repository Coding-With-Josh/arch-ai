import { ClientPage } from "./client-page";
import { auth } from "@/app/api/auth/[...nextauth]/auth-options";

export const metadata = {
    title: "Create Project",
    description: "Create a new project",
}

const Page = async () => {

    const session = await auth();

    

    return (
       <ClientPage session={session} />
    );
}

export default Page;