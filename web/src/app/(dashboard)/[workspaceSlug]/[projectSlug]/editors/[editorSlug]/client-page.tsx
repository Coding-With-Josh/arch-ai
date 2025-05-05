import React from 'react'

interface ClientPageProps {
    params: {
        editorSlug: string
    }
}

const ClientPage = ({params}: ClientPageProps) => {
  return (
    <div>ClientPage
        this is {params.editorSlug}
    </div>
  )
}

export default ClientPage