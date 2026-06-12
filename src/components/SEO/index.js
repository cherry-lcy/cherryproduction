import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const SEO = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentUrl = `https://cherryproduction.pages.dev${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = t('seo.title');
    
    // Update meta tags
    const metaTags = [
      { name: 'description', content: t('seo.description') },
      { name: 'keywords', content: t('seo.keywords') },
      { name: 'author', content: 'Cherry Production' },
      // Open Graph
      { property: 'og:title', content: t('seo.og_title') },
      { property: 'og:description', content: t('seo.og_description') },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'website' },
      // Twitter Card
      { name: 'twitter:title', content: t('seo.og_title') },
      { name: 'twitter:description', content: t('seo.og_description') },
      { name: 'twitter:card', content: 'summary_large_image' },
    ];

    // Update or create meta tags
    metaTags.forEach(tag => {
      let meta;
      if (tag.property) {
        meta = document.querySelector(`meta[property="${tag.property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', tag.property);
          document.head.appendChild(meta);
        }
      } else if (tag.name) {
        meta = document.querySelector(`meta[name="${tag.name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', tag.name);
          document.head.appendChild(meta);
        }
      }
      if (meta) meta.setAttribute('content', tag.content);
    });

    // Update HTML lang attribute
    document.documentElement.lang = i18n.language === 'zh-CN' ? 'zh-CN' : 
                                     i18n.language === 'zh-TW' ? 'zh-TW' : 'en';
  }, [t, i18n.language, location, currentUrl]);

  return null;
};

export default SEO;