import { LoadingContext } from "../contexts/loadingContext";

const useLoading = (defaultValue) => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

export default useLoading;
