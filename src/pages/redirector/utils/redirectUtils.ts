// Types that should display content instead of redirecting
export const DIRECT_CONTENT_TYPES = ['vcard', 'wifi', 'phone', 'sms', 'email', 'location', 'text'];

export type SmartRedirect = {
  appUrl: string | null;
  webUrl: string;
  platform: string;
  androidIntent?: string;
};

export const getSmartRedirectUrl = (url: string): SmartRedirect => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname;
    const search = urlObj.search || '';

    // YouTube (video)
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let videoId = '';
      if (hostname.includes('youtu.be')) {
        videoId = pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get('v') || '';
      }

      if (videoId) {
        const appUrl = `youtube://watch?v=${videoId}`;
        const androidIntent = `intent://www.youtube.com/watch?v=${videoId}#Intent;package=com.google.android.youtube;scheme=https;end`;
        return { appUrl, webUrl: url, platform: 'YouTube', androidIntent };
      }

      const appUrl = `youtube://${pathname}`;
      const androidIntent = `intent://www.youtube.com${pathname}${search}#Intent;package=com.google.android.youtube;scheme=https;end`;
      return { appUrl, webUrl: url, platform: 'YouTube', androidIntent };
    }

    // Instagram
    if (hostname.includes('instagram.com')) {
      const parts = pathname.split('/').filter(Boolean);
      const username = parts[0];
      if (username && username !== 'p' && username !== 'reel') {
        const appUrl = `instagram://user?username=${username}`;
        const androidIntent = `intent://instagram.com/_u/${username}/#Intent;package=com.instagram.android;scheme=https;end`;
        return { appUrl, webUrl: url, platform: 'Instagram', androidIntent };
      }

      const appUrl = `instagram://media?id=${encodeURIComponent(pathname)}`;
      const androidIntent = `intent://instagram.com${pathname}#Intent;package=com.instagram.android;scheme=https;end`;
      return { appUrl, webUrl: url, platform: 'Instagram', androidIntent };
    }

    // TikTok
    if (hostname.includes('tiktok.com')) {
      const androidIntent = `intent://www.tiktok.com${pathname}${search}#Intent;package=com.zhiliaoapp.musically;scheme=https;end`;
      return { appUrl: `snssdk1233://`, webUrl: url, platform: 'TikTok', androidIntent };
    }

    // X / Twitter
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      const username = pathname.split('/')[1];
      if (username) {
        const appUrl = `twitter://user?screen_name=${username}`;
        const androidIntent = `intent://twitter.com/${username}#Intent;package=com.twitter.android;scheme=https;end`;
        return { appUrl, webUrl: url, platform: 'X', androidIntent };
      }
      return { appUrl: 'twitter://', webUrl: url, platform: 'X' };
    }

    // Facebook
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
      const appUrl = `fb://facewebmodal/f?href=${encodeURIComponent(url)}`;
      const androidIntent = `intent://www.facebook.com${pathname}${search}#Intent;package=com.facebook.katana;scheme=https;end`;
      return { appUrl, webUrl: url, platform: 'Facebook', androidIntent };
    }

    // LinkedIn
    if (hostname.includes('linkedin.com')) {
      return { appUrl: `linkedin://${pathname}`, webUrl: url, platform: 'LinkedIn' };
    }

    // Spotify
    if (hostname.includes('spotify.com')) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        return { appUrl: `spotify://${parts[0]}/${parts[1]}`, webUrl: url, platform: 'Spotify' };
      }
      return { appUrl: 'spotify://', webUrl: url, platform: 'Spotify' };
    }

    // WhatsApp
    if (hostname.includes('wa.me') || hostname.includes('whatsapp.com')) {
      const phone = pathname.slice(1) || urlObj.searchParams.get('phone') || '';
      return { appUrl: `whatsapp://send?phone=${phone}`, webUrl: url, platform: 'WhatsApp' };
    }

    // Telegram
    if (hostname.includes('t.me') || hostname.includes('telegram.me')) {
      return { appUrl: `tg://resolve?domain=${pathname.slice(1)}`, webUrl: url, platform: 'Telegram' };
    }

    return { appUrl: null, webUrl: url, platform: 'Website' };
  } catch {
    return { appUrl: null, webUrl: url, platform: 'Website' };
  }
};
