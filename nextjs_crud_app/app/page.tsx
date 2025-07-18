import Link from 'next/link';
import { FolderOpen, BarChart3, Users, Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Project Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern, full-stack CRUD application built with Next.js, TypeScript, and MongoDB.
            Manage your projects with ease and efficiency.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Management</h3>
            <p className="text-gray-600 text-sm">Create, read, update, and delete projects with full CRUD functionality.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Filtering</h3>
            <p className="text-gray-600 text-sm">Filter projects by status, priority, or search by name and description.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Collaboration</h3>
            <p className="text-gray-600 text-sm">Assign team members and organize projects with tags and priorities.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Timeline Tracking</h3>
            <p className="text-gray-600 text-sm">Set start and end dates to keep track of project timelines and deadlines.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Link
              href="/projects"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <FolderOpen className="w-5 h-5 mr-2" />
              View All Projects
            </Link>
          </div>

          <p className="text-gray-600">
            Ready to get started? View your projects or create a new one to begin organizing your work.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Built With Modern Technologies</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-black rounded-full"></div>
              <span>Next.js 15</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>TypeScript</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>MongoDB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <span>Tailwind CSS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Lucide Icons</span>
            </div>
          </div>
        </div>

        {/* API Info */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">API Endpoints</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Project Management</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/projects</code> - List projects with pagination</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/projects</code> - Create new project</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/projects/[id]</code> - Get single project</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">PUT /api/projects/[id]</code> - Update project</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">DELETE /api/projects/[id]</code> - Delete project</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Pagination with configurable page size</li>
                <li>• Search by name and description</li>
                <li>• Filter by status and priority</li>
                <li>• Full input validation</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}