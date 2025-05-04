import { auth } from "@/app/api/auth/[...nextauth]/auth-options";
import Shell from "./shell";

export const metadata = {
    title: "Create Project",
    description: "Create a new project",
}

const Page = async () => {

    const session = await auth();

    

    return (
       <Shell session={session} />
    );
}

export default Page;