import create from 'zustand'

const usePairStore = create(set => ({
  pair: "BTCUSDT",
  setPair: pair => set({ pair })
}))

export default usePairStore
