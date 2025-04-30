"use client"

import { Waveform } from 'ldrs/react'
import 'ldrs/react/Waveform.css'
import { useTheme } from 'next-themes'


// Default values shown
const Loading = () => {
    const {theme} = useTheme()
    return (
        <div className="flex items-center justify-center z-[5000] overflow-hidden bg-background">
        <Waveform
            className="w-32 h-32"
            color={theme === "dark" ? "#4f46e5" : "#111827"}
            speed={1}
            lineWidth={2}
            lineCount={5}
        />
        </div>
    )
}

export default Loading