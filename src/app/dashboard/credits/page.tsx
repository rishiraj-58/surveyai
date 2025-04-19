'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const CREDIT_PACKAGES = [
  { id: 'basic', amount: 5, price: 5, savings: '0%' },
  { id: 'popular', amount: 20, price: 18, savings: '10%' },
  { id: 'premium', amount: 50, price: 40, savings: '20%' },
];

export default function CreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState('popular');
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | null; text: string | null }>({
    type: null,
    text: null,
  });
  
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  
  // Fetch user's credits
  useEffect(() => {
    async function fetchUserCredits() {
      if (isLoaded && user?.id) {
        try {
          const response = await fetch(`/api/user/credits?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setCredits(data.credits);
          } else {
            console.error('Failed to fetch credits:', await response.text());
            // Fallback to default credits on error
            setCredits(5);
          }
        } catch (error) {
          console.error('Error fetching credits:', error);
          // Fallback to default credits on error
          setCredits(5);
        }
      }
    }
    
    fetchUserCredits();
  }, [user?.id, isLoaded]);
  
  useEffect(() => {
    // Check for success or canceled params in URL
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setStatusMessage({
        type: 'success',
        text: 'Payment successful! Your credits have been added to your account.',
      });
      
      // Refresh credits after successful payment
      if (isLoaded && user?.id) {
        fetchCredits();
      }
    } else if (canceled === 'true') {
      setStatusMessage({
        type: 'error',
        text: 'Payment was canceled. No credits were added to your account.',
      });
    }
  }, [searchParams, user?.id, isLoaded]);
  
  // Function to fetch credits
  async function fetchCredits() {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/user/credits?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
      } else {
        console.error('Failed to fetch credits:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  }

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const selectedPkg = CREDIT_PACKAGES.find((pkg) => pkg.id === selectedPackage);
      
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: selectedPkg?.price }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setStatusMessage({
        type: 'error',
        text: 'Something went wrong while creating your checkout session.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Credits</h1>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            Back to Dashboard
          </Link>
        </div>
        
        {statusMessage.text && (
          <div 
            className={`mb-6 p-4 rounded-md ${
              statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Your Credit Balance</h2>
              <p className="text-sm text-gray-500 mt-1">1 credit = 1 survey generation</p>
            </div>
            <span className="text-3xl font-bold text-indigo-600">
              {credits !== null ? `${credits} Credits` : 'Loading...'}
            </span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Credits</h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`border rounded-lg p-5 cursor-pointer transition-all ${
                selectedPackage === pkg.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">{pkg.amount} Credits</h3>
                {pkg.id === 'popular' && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex items-baseline mb-2">
                <span className="text-2xl font-bold text-gray-900">${pkg.price}</span>
                <span className="text-gray-500 ml-1">USD</span>
              </div>
              {pkg.savings !== '0%' && (
                <p className="text-green-600 text-sm">Save {pkg.savings}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 ${
            !isLoading ? 'hover:bg-indigo-700' : 'opacity-70 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isLoading ? 'Processing...' : 'Purchase Credits'}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          Purchases are processed securely through Stripe
        </div>
      </div>
    </div>
  );
} 