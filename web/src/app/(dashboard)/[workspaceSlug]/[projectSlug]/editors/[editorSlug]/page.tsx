import React from 'react'
import ClientPage from './client-page'

const Page = ({params}: {params: { editorSlug: string}}) => {
  return (
    <ClientPage params={params} />
  )
}

export default Page
