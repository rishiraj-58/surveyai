'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                Survey AI
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Welcome, {user?.firstName || user?.username}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Create New Survey Card */}
            <Link
              href="/dashboard/new-survey"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Create New Survey</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Generate a new AI-powered survey with custom questions
                </p>
              </div>
            </Link>

            {/* My Surveys Card */}
            <Link
              href="/dashboard/surveys"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">My Surveys</h3>
                <p className="mt-2 text-sm text-gray-500">
                  View and manage your existing surveys
                </p>
              </div>
            </Link>

            {/* Credits Card */}
            <Link
              href="/dashboard/credits"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Credits</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage your survey credits and purchase more
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 