// SVG data URLs for landing page QR code logos
// These are optimized for embedding in QR codes

export const LANDING_LOGOS = {
  business: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <path fill="#1e293b" d="M25 30h50a5 5 0 0 1 5 5v35a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5V35a5 5 0 0 1 5-5zm0 5v35h50V35H25zm5 5h15v8H30v-8zm20 0h20v3H50v-3zm0 8h15v3H50v-3zm-20 7h40v3H30v-3zm0 8h30v3H30v-3z"/>
    </svg>
  `.trim()
  )}`,

  restaurant: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <path fill="#d97706" d="M35 20v25c0 5.5 4.5 10 10 10v25h10V55c5.5 0 10-4.5 10-10V20h-5v20c0 2.8-2.2 5-5 5V20h-5v25c-2.8 0-5-2.2-5-5V20h-5v20c0 2.8-2.2 5-5 5V20h-5z"/>
    </svg>
  `.trim()
  )}`,

  events: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <path fill="#9333ea" d="M30 25h40a5 5 0 0 1 5 5v40a5 5 0 0 1-5 5H30a5 5 0 0 1-5-5V30a5 5 0 0 1 5-5zm5 0v-5h10v5H45zm20 0v-5h10v5H65zM30 35v35h40V35H30zm5 5h10v10H35V40zm15 0h10v10H50V40zm15 0h10v10H65V40zm-30 15h10v10H35V55zm15 0h10v10H50V55z"/>
    </svg>
  `.trim()
  )}`,

  social: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <path fill="#25D366" d="M50 15c-19.3 0-35 15.7-35 35 0 6.2 1.6 12 4.4 17.1L15 85l18.4-4.8c5 2.6 10.6 4 16.6 4 19.3 0 35-15.7 35-35S69.3 15 50 15zm17.5 49.9c-.7 2-4.2 3.9-5.8 4.1-1.5.2-3.5.3-5.6-.4-1.3-.4-3-1-5.2-1.9-9.2-4-15.2-13.3-15.7-13.9-.4-.6-3.6-4.8-3.6-9.2 0-4.4 2.3-6.5 3.1-7.4.8-.9 1.8-1.1 2.4-1.1h1.7c.5 0 1.3-.2 2 1.5.7 1.8 2.5 6.1 2.7 6.6.2.4.4 1 .1 1.6-.3.6-.4.9-.8 1.4-.4.5-.9 1.1-1.3 1.5-.4.4-.9.9-.4 1.8.5.9 2.2 3.6 4.7 5.8 3.2 2.8 5.9 3.7 6.8 4.1.9.4 1.4.4 1.9-.2.5-.7 2.1-2.5 2.7-3.3.6-.9 1.1-.7 1.9-.4.8.3 4.9 2.3 5.7 2.7.8.4 1.4.6 1.6 1 .2.3.2 1.9-.5 3.8z"/>
    </svg>
  `.trim()
  )}`,

  luxury: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <path fill="#b45309" d="M50 15L20 40v5l30-20 30 20v-5L50 15zM25 48v32h20V60h10v20h20V48L50 30 25 48zm10 5h10v12H35V53zm20 0h10v12H55V53z"/>
    </svg>
  `.trim()
  )}`,

  tech: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <path fill="#0891b2" d="M20 25h60a5 5 0 0 1 5 5v35a5 5 0 0 1-5 5H20a5 5 0 0 1-5-5V30a5 5 0 0 1 5-5zm0 5v35h60V30H20zm35 40h-10v8h10v-8zM30 75h40v3H30v-3zM35 40l-10 10 10 10 4-4-6-6 6-6-4-4zm30 0l10 10-10 10-4-4 6-6-6-6 4-4zM45 35l-5 30h5l5-30h-5z"/>
    </svg>
  `.trim()
  )}`,

  instagram: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <defs>
        <radialGradient id="ig" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stop-color="#fdf497"/>
          <stop offset="5%" stop-color="#fdf497"/>
          <stop offset="45%" stop-color="#fd5949"/>
          <stop offset="60%" stop-color="#d6249f"/>
          <stop offset="90%" stop-color="#285AEB"/>
        </radialGradient>
      </defs>
      <rect x="15" y="15" width="70" height="70" rx="18" fill="url(#ig)"/>
      <circle cx="50" cy="50" r="15" fill="none" stroke="white" stroke-width="5"/>
      <circle cx="68" cy="32" r="5" fill="white"/>
    </svg>
  `.trim()
  )}`,

  youtube: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <path fill="#FF0000" d="M85 35c-.9-3.4-3.5-6-6.8-7-6-1.6-30.2-1.6-30.2-1.6s-24.2 0-30.2 1.6c-3.3.9-5.9 3.6-6.8 7-1.6 6-1.6 18.5-1.6 18.5s0 12.5 1.6 18.5c.9 3.4 3.5 6 6.8 7 6 1.6 30.2 1.6 30.2 1.6s24.2 0 30.2-1.6c3.3-.9 5.9-3.6 6.8-7 1.6-6 1.6-18.5 1.6-18.5s0-12.5-1.6-18.5z"/>
      <path fill="white" d="M42 63V40l22 11.5L42 63z"/>
    </svg>
  `.trim()
  )}`,

  linkedin: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <rect x="12" y="12" width="76" height="76" rx="8" fill="#0A66C2"/>
      <path fill="white" d="M30 40v30h10V40H30zm5-15a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm25 15c-5.5 0-9 3-10 5v-5H40v30h10V55c0-3 2-5 5-5s5 2 5 5v15h10V52c0-7-4-12-10-12z"/>
    </svg>
  `.trim()
  )}`,

  twitter: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <circle cx="50" cy="50" r="38" fill="black"/>
      <path fill="white" d="M62.5 30h7.5l-16.4 18.8L72 70h-12l-10.6-13.8L37 70h-7.5l17.5-20L28 30h12.3l9.6 12.6L62.5 30zm-2.6 36h4.2L40.5 34.2h-4.5L59.9 66z"/>
    </svg>
  `.trim()
  )}`,

  facebook: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <circle cx="50" cy="50" r="38" fill="#1877F2"/>
      <path fill="white" d="M62 50h-8v30H44V50h-6v-9h6v-6c0-6 4-12 12-12h8v9h-6c-2 0-4 1-4 3v6h10l-2 9z"/>
    </svg>
  `.trim()
  )}`,

  spotify: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="#1DB954" d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.5c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.4-1.1-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 4.1-.9 7.6-.5 10.4 1.3.3.2.4.6.2.9zm1.3-2.7c-.2.3-.7.4-1 .2-2.8-1.7-7-2.2-10.2-1.2-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 3.7-1.1 8.4-.6 11.6 1.4.3.2.4.7.2 1zm.1-2.8c-3.3-2-8.7-2.2-11.9-1.2-.5.1-.9-.1-1.1-.6-.1-.5.1-.9.6-1.1 3.7-1.1 9.9-.9 13.8 1.4.4.2.5.7.3 1.1-.2.4-.7.5-1.1.3z"/>
</svg>
  `.trim()
  )}`,

  tiktok: `data:image/svg+xml,${encodeURIComponent(
    `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white" rx="12"/>
      <path fill="#25F4EE" d="M48 28h10c1 8 6 12 14 13v10c-5 0-10-2-14-5v22c0 14-15 22-26 13s-8-26 6-30v10c-7 2-9 10-5 15s13 4 16-3V28z"/>
      <path fill="#FE2C55" d="M52 28h10c1 8 6 12 14 13v10c-5 0-10-2-14-5v22c0 14-15 22-26 13s-8-26 6-30v10c-7 2-9 10-5 15s13 4 16-3V28z" transform="translate(2,-2)"/>
      <path fill="black" d="M50 28h10c1 8 6 12 14 13v10c-5 0-10-2-14-5v22c0 14-15 22-26 13s-8-26 6-30v10c-7 2-9 10-5 15s13 4 16-3V28z"/>
    </svg>
  `.trim()
  )}`,
};
