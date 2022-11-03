import { Box, Tab, Tabs, Typography } from "@mui/material"
import coinPair from "./constants/coinPair"
import PairData from "./components/PairData"
import usePairStore from "./store/pair.store"

function App() {
  const { pair, setPair } = usePairStore()

  return (
    <Box>
      <header
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid lightgray",
        }}
      >
        <Typography variant="h5">Teesta Assignment</Typography>
      </header>

      <Box>
        <Tabs value={pair} onChange={(_, v) => setPair(v)}>
          {coinPair.map((pair) => (
            <Tab key={pair.value} label={pair.name} value={pair.value} />
          ))}
        </Tabs>
        <PairData />
      </Box>
    </Box>
  )
}

export default App
