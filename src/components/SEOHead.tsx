import { Helmet } from "react-helmet-async";

const SITE_URL = "https://qr-craft-studio.vercel.app";
const SITE_NAME = "QR Studio";
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  type?: string;
  noindex?: boolean;
  structuredData?: object | object[];
}

const SEOHead = ({
  title,
  description,
  path = "/",
  type = "website",
  noindex = false,
  structuredData,
}: SEOHeadProps) => {
  const url = `${SITE_URL}${path}`;
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />

      {/* Structured Data */}
      {structuredData && (
        Array.isArray(structuredData) 
          ? structuredData.map((data, i) => (
              <script key={i} type="application/ld+json">{JSON.stringify(data)}</script>
            ))
          : <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
