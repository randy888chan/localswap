interface TrackingData {
  geo: {
    country: string;
    city?: string;
  };
  device: {
    type: 'mobile' | 'desktop';
    os: 'ios' | 'android' | 'windows' | 'mac';
  };
  behavior: {
    pagesVisited: string[];
    timeOnSite: number;
  };
}

export function trackUserBehavior(): TrackingData {
  return {
    geo: getCloudflareGeoData(request),
    device: detectDeviceType(),
    behavior: readBehaviorCookies()
  };
}

// Cloudflare-specific geo lookup
function getCloudflareGeoData(request: Request) {
  const country = request.cf?.country ?? 'US';
  const city = request.cf?.city;
  return { country, city };
}
