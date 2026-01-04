export default function SchemaMarkup() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HY Consulting",
    "url": "https://hyconsulting.jp",
    "logo": "https://hy-consulting-lp.manus.space/images/logo_new_design.png",
    "description": "不動産・相続・終活のプロフェッショナルとして、老後の安心、資産の活用、負動産の解決までワンストップでサポート",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "神奈川県横浜市戸塚区戸塚町4711-1 オセアン矢沢ビル304",
      "addressLocality": "横浜市",
      "addressRegion": "神奈川県",
      "postalCode": "244-0003",
      "addressCountry": "JP"
    },
    "telephone": "045-869-6377",
    "email": "info@hyconsulting.jp",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "045-869-6377",
      "email": "info@hyconsulting.jp",
      "availableLanguage": "ja"
    },
    "areaServed": ["神奈川県", "横浜市", "湘南"],
    "sameAs": [
      "https://hyconsulting.jp"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "HY Consulting",
    "image": "https://hy-consulting-lp.manus.space/images/hero_city_16x9.png",
    "description": "老後資金・相続・不動産のコンサルティングサービス",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "神奈川県横浜市戸塚区戸塚町4711-1",
      "addressLocality": "横浜市",
      "addressRegion": "神奈川県",
      "postalCode": "244-0003",
      "addressCountry": "JP"
    },
    "telephone": "045-869-6377",
    "priceRange": "相談無料",
    "url": "https://hyconsulting.jp",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "1"
    }
  };

  const servicesOfferedSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "不動産・相続・終活コンサルティング",
    "description": "老後資金・相続・不動産の総合コンサルティングサービス",
    "provider": {
      "@type": "Organization",
      "name": "HY Consulting"
    },
    "areaServed": {
      "@type": "City",
      "name": "横浜市"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "HY Consultingのサービス",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "老後資金・介護・相続の終活支援"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "不動産購入・売却・活用支援"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "負動産処分活用支援"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesOfferedSchema) }}
      />
    </>
  );
}
