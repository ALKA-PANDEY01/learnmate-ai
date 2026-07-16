import React, { useEffect } from 'react';

export const SEO = ({ title, description }) => {
  useEffect(() => {
    document.title = title ? `${title} | LearnMate AI` : 'LearnMate AI - Personal Learning Agent';
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    
    metaDescription.setAttribute(
      'content',
      description || 'Empower your learning process using LearnMate AI, your dedicated personal learning agent. Customize templates, chat with tutors, and track your metrics.'
    );
  }, [title, description]);

  return null;
};
