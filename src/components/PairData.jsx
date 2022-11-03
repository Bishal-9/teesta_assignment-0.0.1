import { useEffect, useState } from "react"
import { Box, Stack, Typography } from "@mui/material"
import { binanceBaseURL, wazirXBaseURL } from "../config/endpoints"
import SocketData from "./SocketData"
import useBinanceStore from "../store/binance.store"
import useWazirxStore from "../store/wazirx.store"
import usePairStore from "../store/pair.store"

const PairData = () => {
  const { pair } = usePairStore()
  const { askBinanceDiff, bidBinanceDiff } = useBinanceStore()
  const { askWazirXDiff, bidWazirXDiff } = useWazirxStore()
  const [askDiff, setAskDiff] = useState(0)
  const [bidDiff, setBidDiff] = useState(0)

  useEffect(() => {
      setAskDiff(Math.round(Number(askBinanceDiff) - Number(askWazirXDiff)))
      setBidDiff(Math.round(Number(bidBinanceDiff) - Number(bidWazirXDiff)))
  }, [askBinanceDiff, bidBinanceDiff, askWazirXDiff, bidWazirXDiff])

  return (
    <Box padding="30px">
      <Typography gutterBottom variant="h3">
        Coin - {pair.substr(0, pair.length - 4)}
      </Typography>

      <Stack direction="row" spacing={2} marginBottom="15px" justifyContent='space-evenly'>
        <Typography>Ask Price Diff: {askDiff}</Typography>
        <Typography>Bid Price Diff: {bidDiff}</Typography>
      </Stack>

      <Stack spacing={2} direction="row" justifyContent="space-between">
        <SocketData
          socketUrl={binanceBaseURL + "/ws/" + pair + "@bookTicker"}
          brokerName="Binance"
          subscribePayload={{
            method: "SUBSCRIBE",
            params: [`${pair.toLowerCase()}@bookTicker`],
            id: 1,
          }}
          unsubscribePayload={{
            method: "UNSUBSCRIBE",
            params: [`${pair.toLowerCase()}@bookTicker`],
            id: 1,
          }}
        />

        <SocketData
          socketUrl={wazirXBaseURL}
          brokerName="WazirX"
          subscribePayload={{
            event: "subscribe",
            streams: [`${pair.toLowerCase()}@depth`],
          }}
          unsubscribePayload={{
            event: "unsubscribe",
            streams: [`${pair.toLowerCase()}@depth`],
          }}
        />
      </Stack>
    </Box>
  )
}

export default PairData
