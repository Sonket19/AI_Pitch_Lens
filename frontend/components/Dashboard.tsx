// frontend/components/Dashboard.tsx
import React from 'react';
import { useParams } from 'react-router-dom'; // Or however you get the dealId
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../firebaseConfig'; // Your Firebase config file
import Loader from './Loader'; // Your loading component

// Define a type for your deal data (you can expand this based on your Firestore structure)
type DealData = {
  dealId: string;
  gcsPath: string;
  status: 'processing' | 'text_extracted' | 'completed' | 'error';
  createdAt: any; // Firestore Timestamp
  full_text?: string; // Available after text extraction
  analysis?: {
    risk: string;
    financials: string;
    // ... other analysis fields
  };
  error_message?: string;
};

const Dashboard: React.FC = () => {
  // --- Get the dealId ---
  // If you are using react-router, you might get it like this:
  // const { dealId } = useParams<{ dealId: string }>();

  // For this example, let's assume dealId comes from somewhere else
  const dealId = "YOUR_DEAL_ID_HERE"; // ** Replace this with how you actually get the ID **

  if (!dealId) {
    return <div>Error: No Deal ID specified.</div>;
  }

  // --- Set up the Firestore Listener ---
  const dealDocRef = doc(db, 'deals', dealId); // Create a reference to the specific document
  const [dealData, loading, error] = useDocumentData<DealData>(dealDocRef); // Hook to listen

  // --- Render based on loading state ---
  if (loading) {
    return <Loader message="Loading analysis data..." />;
  }

  // --- Render based on error state ---
  if (error) {
    console.error("Firestore error:", error);
    return <div className="text-red-600">Error loading analysis: {error.message}</div>;
  }

  // --- Render based on deal status ---
  if (!dealData) {
    return <div>Deal document not found or is empty.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analysis for Deal: {dealData.dealId}</h1>

      {dealData.status === 'processing' && (
        <div className="flex items-center space-x-2 text-blue-600">
          <Loader message="Status: Processing PDF..." />
        </div>
      )}

      {dealData.status === 'text_extracted' && (
        <div className="flex items-center space-x-2 text-purple-600">
           <Loader message="Status: Analyzing text with AI..." />
        </div>
      )}

      {dealData.status === 'completed' && dealData.analysis && (
        <div className="p-4 border rounded-md bg-green-50 border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Analysis Complete! ✅</h2>
          {/* Display your analysis results here */}
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Risk Assessment:</h3>
            <p className="text-sm text-gray-700">{dealData.analysis.risk || 'Not available'}</p>
            <h3 className="font-semibold">Financials:</h3>
            <p className="text-sm text-gray-700">{dealData.analysis.financials || 'Not available'}</p>
            {/* Add displays for other analysis fields */}
          </div>
        </div>
      )}

      {dealData.status === 'error' && (
        <div className="p-4 border rounded-md bg-red-50 border-red-200">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Analysis Failed ❌</h2>
          <p className="text-sm text-red-700">{dealData.error_message || 'An unknown error occurred.'}</p>
        </div>
      )}

      {/* Optionally display the raw text or other details */}
      {/* <pre className="mt-4 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
        {JSON.stringify(dealData, null, 2)}
      </pre> */}
    </div>
  );
};

export default Dashboard;