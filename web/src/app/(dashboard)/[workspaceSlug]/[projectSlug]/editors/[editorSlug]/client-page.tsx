"use client"

import { useEditor } from '@/editor/editor-provider'
import React from 'react'
import FlowView from './_view/flow'
import DesignView from './_view/design'
import Header from '@/editor/components/shared/header'
import TabNav from '@/editor/components/design/tab-nav'

interface ClientPageProps {
  params: {
    editorSlug: string
  }
}

const ClientPage = ({ params }: ClientPageProps) => {
  const { state, currentEditor } = useEditor()

  if (!currentEditor) {
    throw new Error("Yoooo")
  }

  return (
    <div className="h-screen w-screen overflow-hidden top-0 left-0 bottom-0 right-0">
      <Header state={state} editor={currentEditor} />
      {/* <TabNav/> */}
      { state.currentView === "flow" ? (
      <div className="w-screen h-screen overflow-hidden top-0 left-0 bottom-0 right-0">
        <FlowView />
      </div>
    ) : state.currentView === "design" ? (
      <div className="w-screen h-screen overflow-hidden top-0 left-0 bottom-0 right-0">
        <DesignView />
      </div>
    ) : (
      <div className="w-screen h-screen overflow-hidden top-0 left-0 bottom-0 right-0">

      </div>
    )}
    </div>
  )
}

export default ClientPage