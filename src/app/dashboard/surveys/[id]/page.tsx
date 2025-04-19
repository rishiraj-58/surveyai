'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Survey {
  id: string;
  topic: string;
  questions: string[];
  createdAt: string;
}

export default function SurveyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, you'd fetch from your API
        // For demo, let's use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, we'll use mock data instead of an actual API call
        // In a real implementation, you would use:
        // const response = await fetch(`/api/surveys/${params.id}`);
        // const data = await response.json();
        // setSurvey(data);
        
        setSurvey({
          id: params.id as string,
          topic: 'Customer Satisfaction',
          questions: [
            'How would you rate your overall experience?',
            'What aspects of our service did you enjoy the most?',
            'What areas do you think we could improve?',
            'How likely are you to recommend us to others?',
            'Is there anything specific you would like to see in the future?'
          ],
          createdAt: new Date().toISOString()
        });
        
        // Initialize answers array
        setAnswers(new Array(5).fill(''));
      } catch (error) {
        console.error('Error fetching survey:', error);
        setError('Failed to load survey. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, [params.id]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!survey) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you'd submit to your API
      // const response = await fetch('/api/analyze-responses', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ surveyId: survey.id, answers })
      // });
      
      // if (!response.ok) throw new Error('Failed to submit responses');
      
      // Simulate successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to results page
      router.push(`/dashboard/surveys`);
    } catch (error) {
      console.error('Error submitting responses:', error);
      setError('Failed to submit responses. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-red-500 mb-6">{error}</p>
            <Link href="/dashboard/surveys" className="text-indigo-600 hover:text-indigo-800">
              Return to surveys
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Survey Not Found</h1>
            <p className="text-gray-500 mb-6">The survey you're looking for doesn't exist or has been removed.</p>
            <Link href="/dashboard/surveys" className="text-indigo-600 hover:text-indigo-800">
              Return to surveys
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{survey.topic}</h1>
          <Link href="/dashboard/surveys" className="text-indigo-600 hover:text-indigo-800">
            Back to Surveys
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Survey Questions</h2>
          </div>
          <div className="p-6">
            {survey.questions.map((question, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {index + 1}. {question}
                </label>
                <textarea
                  rows={3}
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Type your answer here..."
                ></textarea>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || answers.some(a => !a.trim())}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting || answers.some(a => !a.trim())
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Responses'}
          </button>
        </div>
      </div>
    </div>
  );
} 