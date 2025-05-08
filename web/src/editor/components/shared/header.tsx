import { Clock } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import archLogo from "@/assets/images/brand/arch_logo-transparent-bg.png"
import ViewSwitch from './view-switch'
import { Button } from '@/components/ui/button'
import { Editor, EditorState } from '@/editor/types'

type Header = {
    editor: Editor
    state: EditorState
}

const Header = ({ state, editor }: Header) => {
    return (
        <header className="relative top-0 min-h-fit py-2 border-b border-muted/75">
            <div className=" w-full px-5 h-full flex items-center justify-between">
                <div className="absolute left-0 border-r border-r-muted/75 h-full w-fit px-3 flex items-center justify-center hover:bg-muted transition-all cursor-pointer">
                <Image
                    src={archLogo}
                    width={100}
                    height={100}
                    alt="A"
                    className="size-8"
                    /></div>
                <div className="flex flex-col items-start justify-start gap-0.5 ml-14">
                    <span className="text-xs font-bold">{editor.meta.name ? editor.meta.name : "Untitled"}</span>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1"><Clock className='h-3 w-3 mt-0'/> Last updated just now</span>
        
                    </div>
                </div>
                <ViewSwitch/>
                <div className="flex text-xs items-center justify-center gap-2">
                    {state.currentView === "design" ? (
                                            <Button variant="outline" size="sm" className="text-xs min-h-fit py-1">Preview</Button>

                    ) : (
                        <Button variant="outline" size="sm" className="text-xs min-h-fit py-1">Run</Button>

                    )}
                    <Button className="text-xs bg-gradient-to-r from-zinc-700 to-zinc-900 text-white hover:from-zinc-600 hover:to-zinc-800 border-2 border-zinc-800 transition-all" size="sm">Build & Deploy</Button>
                </div>
            </div>
        </header>
    )
}

export default Header