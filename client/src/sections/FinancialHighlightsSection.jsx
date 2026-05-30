'use client';

import { useState, useEffect } from 'react';
import FinancialOverview from '@/components/financial/FinancialOverview';
import FinancialPerformanceChart from '@/components/financial/FinancialPerformanceChart';
import FinancialMetrics from '@/components/financial/FinancialMetrics';
import FinancialStrengths from '@/components/financial/FinancialStrengths';

export default function FinancialHighlightsSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/financial-highlights`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data) {
          setData(data);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error('Financial highlights fetch error:', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="bg-white dark:bg-[#09090B] py-14 lg:py-20 flex justify-center items-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  // If there's an error or no data was saved yet, render nothing or a fallback.
  if (error || !data) return null;

  return (
    <section className="relative bg-[#FAFAFA] dark:bg-[#09090B] py-14 lg:py-24 overflow-hidden border-t border-black/5 dark:border-[#1a1a1a]">
      <div className="relative container-custom z-10">
        
        <FinancialOverview overview={data.overview} />
        
        <FinancialPerformanceChart data={data.financialPerformance} />
        
        <FinancialMetrics metrics={data.metrics} />
        
        <FinancialStrengths strengths={data.strengths} />
        
      </div>
    </section>
  );
}
