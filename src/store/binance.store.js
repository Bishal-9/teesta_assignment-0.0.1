import create from 'zustand'

const useBinanceStore = create((set) => ({
  askBinanceDiff: 0,
  bidBinanceDiff: 0,
  setBinanceDiff: (askDiff, bidDiff) => set({ askBinanceDiff: askDiff, bidBinanceDiff: bidDiff }),
}))

export default useBinanceStore
