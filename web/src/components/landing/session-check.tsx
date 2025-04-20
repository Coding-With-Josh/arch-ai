import React from 'react'
import { UserDropdown } from '../navbar/user-dropdown'
import { auth } from '@/app/api/auth/[...nextauth]/auth-options'
import Particles from './particles'

export const SessionCheck = async () => {
    const session = await auth()
    return (
          session ? <UserDropdown session={session} /> : (
             <a
                        href={"/auth"}
                        className="font-display2 rounded-2xl text-md mt-5 px-6 py-3 mx-10 border-2 bg-gradient-to-tr from-zinc-600/40 via-transparent to-transparent text-zinc-200/40 flex justify-center items-center border-zinc-900/20"
                      >
                        <span className="relative flex items-center">
                          <Particles
                            className="absolute inset-0 -z-10 animate-fade-in"
                            quantity={100}
                          />
                          Auth
                        </span>
                      </a>
          )
    )
}
