"use client"

import { Session } from "next-auth";
import { ClientPage } from "./client-page";
import { auth } from "@/app/api/auth/[...nextauth]/auth-options";
import { useParams } from "next/navigation";

const Shell = ({session}: {session: Session | null}) => {

    const params = useParams()
    
    return (
       <ClientPage session={session} params={params} />
    );
}

export default Shell;