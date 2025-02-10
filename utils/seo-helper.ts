export async function urlExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export function getValidSocialLinks(): string[] {
  const possibleLinks = [
    'https://twitter.com/YourExchange',
    'https://github.com/YourExchange',
    `${process.env.SITE_URL}/about`,
    `${process.env.SITE_URL}/legal`
  ];

  return Promise.all(possibleLinks.map(urlExists))
    .then(results => possibleLinks.filter((_, index) => results[index]));
}
