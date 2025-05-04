import { ClientPage } from "./client-page";
import { auth } from "@/app/api/auth/[...nextauth]/auth-options";

export const metadata = {
    title: "Create Workspace",
    description: "Create a new workspace",
}

const Page = async () => {

    const session = await auth();

    

    return (
       <ClientPage session={session} />
    );
}

export default Page;