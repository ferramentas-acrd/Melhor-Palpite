interface ArticleSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  category?: string;
  tags?: string[];
  url: string;
}

export function createArticleSchema(props: ArticleSchemaProps) {
  const {
    title,
    description,
    image,
    datePublished,
    dateModified,
    authorName,
    authorUrl,
    category,
    tags = [],
    url
  } = props;

  const siteName = import.meta.env.PUBLIC_SITE_NAME || 'Portal';
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "description": description,
    "image": image ? [image] : [`${siteUrl}/og-default.jpg`],
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName || siteName,
      "url": authorUrl || siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": category || "Geral",
    "keywords": tags.join(", "),
    "inLanguage": "pt-BR"
  };
}

export function createPersonSchema(name: string, bio?: string, image?: string) {
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "description": bio,
    "image": image || `${siteUrl}/avatar-default.jpg`,
    "url": `${siteUrl}/autor/${name.toLowerCase().replace(/\s+/g, '-')}`
  };
}

export function createCategorySchema(name: string, description?: string, postCount?: number) {
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description || `Artigos sobre ${name}`,
    "url": `${siteUrl}/categoria/${name.toLowerCase().replace(/\s+/g, '-')}`,
    "numberOfItems": postCount || 0
  };
}