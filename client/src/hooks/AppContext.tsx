/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from "react";
import { useProductApi } from "./useProductApi";
import { IProductApi } from "../types/product";

type ContextType = { productApi: IProductApi };

export const AppContext = createContext<ContextType | null>(null);

const { Provider } = AppContext;

export const AppContextProvider = ({
  children,
  initialState,
}: {
  children: JSX.Element | JSX.Element[];
  initialState?: ContextType;
}) => {
  const productApi = useProductApi();

  const sharedState = {
    productApi,
    ...initialState,
  };
  return <Provider value={sharedState}>{children}</Provider>;
};

export const useAppContext = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return appContext;
};
