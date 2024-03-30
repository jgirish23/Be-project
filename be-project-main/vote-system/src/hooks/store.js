import { create } from "zustand";

const useMyStore = create((set) => ({
  account: null,
  signer: null,
  factoryContract: null,
  loading: false,
  setLoading: (loadingState) => set({ loading: loadingState }),
  setAccount: (newAccount) => set({ account: newAccount }),
  setSigner: (newSigner) => set({ signer: newSigner }),
  setFactoryContract: (newContract) => set({ factoryContract: newContract }),
}));

export default useMyStore;
