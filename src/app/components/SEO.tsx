import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

export function SEO({ 
  title = 'SOMNICLAW AI',
  description = 'AI-powered Web3 Launchpad for intelligent token creation on Solana.'
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const metaTags: { selector: string; attr: string; attrValue: string; content: string }[] = [
      { selector: 'meta[name="title"]', attr: 'name', attrValue: 'title', content: title },
      { selector: 'meta[name="description"]', attr: 'name', attrValue: 'description', content: description },
      { selector: 'meta[property="og:title"]', attr: 'property', attrValue: 'og:title', content: title },
      { selector: 'meta[property="og:description"]', attr: 'property', attrValue: 'og:description', content: description },
      { selector: 'meta[property="og:type"]', attr: 'property', attrValue: 'og:type', content: 'website' },
      { selector: 'meta[property="og:url"]', attr: 'property', attrValue: 'og:url', content: 'https://somniclaw.xyz' },
      { selector: 'meta[property="og:image"]', attr: 'property', attrValue: 'og:image', content: '/somniclaw-preview.png' },
      { selector: 'meta[name="twitter:card"]', attr: 'name', attrValue: 'twitter:card', content: 'summary_large_image' },
      { selector: 'meta[name="twitter:title"]', attr: 'name', attrValue: 'twitter:title', content: title },
      { selector: 'meta[name="twitter:description"]', attr: 'name', attrValue: 'twitter:description', content: 'AI-powered Web3 Launchpad' },
      { selector: 'meta[name="twitter:image"]', attr: 'name', attrValue: 'twitter:image', content: '/somniclaw-preview.png' },
    ];

    metaTags.forEach(({ selector, attr, attrValue, content }) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', '#070707');
  }, [title, description]);

  return null;
}
