import { jwtDecode } from 'jwt-decode';
export const decodeJWT = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.log(error);
  }
};

export const isTokenExpired = (expirationTime: number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  return expirationTime < currentTime;
};
