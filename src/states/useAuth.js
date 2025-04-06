import { useRecoilValue } from "recoil";
import { authState } from "./authState";

const useAuth = () => {
  const auth = useRecoilValue(authState);
  return { auth }; // wrap it
};

export default useAuth;
