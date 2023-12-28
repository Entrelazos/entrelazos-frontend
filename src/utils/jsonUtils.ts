export function base64UrlDecode(base64Url: string): string {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64);
}

export function decodeJwt(token: string): any {
  const parts = token.split('.');
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));

  return {
    header,
    payload,
    signature: parts[2],
  };
}

export const isTokenExpired = (expirationTime: number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  return expirationTime < currentTime;
};
