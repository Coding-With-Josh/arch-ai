"use client";

import React from 'react';
import { useEditor } from '@/editor/editor-provider';

const ViewSwitch: React.FC = () => {
    const { state, dispatch } = useEditor();

    const handleSwitch = (view: 'design' | 'flow') => {
        dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
    };

    const baseClasses = "px-3.5 py-1 rounded cursor-pointer transition-colors border";

    // Active button styles for light and dark mode.
    const activeClasses =
        "bg-zinc-300 text-zinc-900 border-zinc-400 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-800/75 dark:hover:bg-zinc-800/75";
    
    // Inactive button styles for light and dark mode.
    const inactiveClasses =
        "bg-zinc-100 text-zinc-900 border-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800";

    const designButtonClass =
        state.currentView === 'design'
            ? `${baseClasses} ${activeClasses}`
            : `${baseClasses} ${inactiveClasses}`;
    const flowButtonClass =
        state.currentView === 'flow'
            ? `${baseClasses} ${activeClasses}`
            : `${baseClasses} ${inactiveClasses}`;

    return (
        <div className="flex gap-2 p-1 text-xs border rounded-md bg-zinc-100 border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800">
            <button className={designButtonClass} onClick={() => handleSwitch('design')}>
                Design
            </button>
            <button className={flowButtonClass} onClick={() => handleSwitch('flow')}>
                Flow
            </button>
        </div>
    );
};

export default ViewSwitch;