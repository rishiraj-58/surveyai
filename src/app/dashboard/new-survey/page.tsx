'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewSurveyPage() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate survey questions');
      }

      const data = await response.json();
      router.push(`/dashboard/surveys/${data.id}`);
    } catch (error) {
      console.error('Error creating survey:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Survey</h1>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Survey Topic
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., Customer Satisfaction, User Experience, Product Feedback"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter a topic for your survey. Be specific for better results.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 ${
                !isLoading && topic.trim() ? 'hover:bg-indigo-700' : 'opacity-70 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? 'Generating Questions...' : 'Generate AI Survey Questions'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 