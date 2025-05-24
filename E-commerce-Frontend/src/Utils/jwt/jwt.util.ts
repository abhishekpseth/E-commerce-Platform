import { jwtDecode, type JwtPayload } from "jwt-decode";

interface TokenPayload extends JwtPayload {
  roles?: string[];
  _id?: string
}

const checkTokenValid = (token: string) : boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp !== undefined && decoded.exp > currentTime;
  } catch (e) {
    return false;
  }
};

const getJWTData =(token : string) : TokenPayload | null =>{
  const decodedData = checkTokenValid(token) ? jwtDecode(token) : null;
  return decodedData;
}

const jwtUtils = {
  checkTokenValid,
  getJWTData
}

export default jwtUtils;