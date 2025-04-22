import React from 'react'

const Page = () => {
  return (
    <div>
        <h1 className="text-4xl font-bold mb-6">Organizations</h1>
        <p className="mb-4 text-lg">
            Manage your organizations here. You can create, edit, or delete organizations as needed.
        </p>
        <p className="mb-4 text-lg">
            For more information, visit our <a href="/help" className="text-primary hover:underline">Help Center</a>.
        </p>
        <div className="mt-8">
            <a 
            href="/organizations/create" 
            className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
            Create New Organization
            </a>    
        </div>
    </div>
  )
}

export default Page