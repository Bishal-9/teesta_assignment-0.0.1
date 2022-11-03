import create from 'zustand'

const useWazirxStore = create((set) => ({
  askWazirXDiff: 0,
  bidWazirXDiff: 0,
  setWazirXDiff: (askDiff, bidDiff) => set({ askWazirXDiff: askDiff, bidWazirXDiff: bidDiff }),
}))

export default useWazirxStore
