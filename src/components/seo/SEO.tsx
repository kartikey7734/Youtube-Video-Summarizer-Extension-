import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title = "TubeSummarizer - AI Video Summarization", 
  description = "Extract high-fidelity summaries and technical proofs from any YouTube video using Gemini 2.0.",
}) => {
  useEffect(() => {
    document.title = `${title} | TubeSummarizer`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
  }, [title, description]);

  return null;
};
