import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Peak Mode - Premium Performance Apparel',
  description = 'Discover premium performance apparel designed for peak athleticism and everyday style. Shop the latest collection of training gear, hoodies, and athletic wear.',
  keywords = 'performance apparel, athletic wear, training gear, fitness clothing, workout clothes, gym wear, sports clothing, peak mode',
  image = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=630&fit=crop',
  url = 'https://peakmode.com',
  type = 'website',
  author = 'Peak Mode',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const fullTitle = title.includes('Peak Mode') ? title : `${title} | Peak Mode`;
  const fullDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  const fullKeywords = [...keywords.split(', '), 'peak mode', 'performance', 'athletic', 'fitness'].join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={author} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Peak Mode" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@peakmode" />
      <meta name="twitter:creator" content="@peakmode" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Product specific meta tags */}
      {type === 'product' && (
        <>
          <meta property="product:price:amount" content="" />
          <meta property="product:price:currency" content="SEK" />
          <meta property="product:availability" content="in stock" />
        </>
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'product' ? 'Product' : type === 'article' ? 'Article' : 'WebSite',
          "name": fullTitle,
          "description": fullDescription,
          "url": url,
          "image": image,
          "author": {
            "@type": "Organization",
            "name": author
          },
          "publisher": {
            "@type": "Organization",
            "name": "Peak Mode",
            "logo": {
              "@type": "ImageObject",
              "url": "https://peakmode.com/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://peakmode.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead; 