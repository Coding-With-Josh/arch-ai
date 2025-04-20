import React from "react";

export const RoleOrgManagementDemo = () => {
    const [activeTab, setActiveTab] = React.useState("roles");

    return (
        <div className="bg-gray-900 p-4 rounded-lg text-gray-100">
            <div className="flex space-x-2 mb-3">
                <button
                    onClick={() => setActiveTab("roles")}
                    className={`py-1 px-3 border rounded-lg ${
                        activeTab === "roles" ? "bg-primary text-white" : "bg-transparent"
                    }`}
                >
                    Roles
                </button>
                <button
                    onClick={() => setActiveTab("orgs")}
                    className={`py-1 px-3 border rounded-lg ${
                        activeTab === "orgs" ? "bg-primary text-white" : "bg-transparent"
                    }`}
                >
                    Organizations
                </button>
            </div>
            {activeTab === "roles" ? (
                <div className="text-sm">
                    <p>Manage user roles:</p>
                    <ul className="list-disc ml-5 mt-2">
                        <li>Add new roles</li>
                        <li>Edit existing roles</li>
                        <li>Remove roles</li>
                    </ul>
                </div>
            ) : (
                <div className="text-sm">
                    <p>Manage organization settings:</p>
                    <ul className="list-disc ml-5 mt-2">
                        <li>Update profile</li>
                        <li>Manage billing</li>
                        <li>Add team members</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RoleOrgManagementDemo;