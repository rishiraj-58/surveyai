'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Survey {
  id: string;
  topic: string;
  createdAt: string;
  questionCount: number;
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        // This is just a placeholder - in a real app, you'd fetch from your API
        // const response = await fetch('/api/surveys');
        // const data = await response.json();
        // setSurveys(data);
        
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setSurveys([
            {
              id: '1',
              topic: 'Customer Satisfaction',
              createdAt: new Date().toISOString(),
              questionCount: 8,
            },
            {
              id: '2',
              topic: 'Product Feedback',
              createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              questionCount: 10,
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching surveys:', error);
        setIsLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Surveys</h1>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : surveys.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">You haven't created any surveys yet.</p>
              <Link
                href="/dashboard/new-survey"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create your first survey
              </Link>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {surveys.map((survey) => (
                  <tr key={survey.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{survey.topic}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{survey.questionCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/surveys/${survey.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View
                      </Link>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 