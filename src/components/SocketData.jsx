import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Box, Typography } from "@mui/material"
import useWebSocket, { ReadyState } from "react-use-websocket"
import useBinanceStore from "../store/binance.store"
import useWazirxStore from "../store/wazirx.store"
import usePairStore from "../store/pair.store"

const SocketData = ({
  brokerName,
  socketUrl,
  subscribePayload,
  unsubscribePayload,
}) => {
  const { pair } = usePairStore()
  const oldPair = useRef(pair)
  const isSubscribed = useRef(false)
  const { setBinanceDiff } = useBinanceStore()
  const { setWazirXDiff } = useWazirxStore()
  const { readyState, sendJsonMessage, lastJsonMessage } =
    useWebSocket(socketUrl)
  const [askDiff, setAskDiff] = useState(0)
  const [bidDiff, setBidDiff] = useState(0)

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState]

  // * Memoize the callback to avoid unnecessary re-renders
  const subscribe = useCallback(() => {
    if (sendJsonMessage && subscribePayload) {
      sendJsonMessage(subscribePayload)
    }
  }, [sendJsonMessage, subscribePayload])

  // * Memoize the unsubscribe function to avoid unnecessary re-renders
  const unsubscribe = useCallback(() => {
    if (sendJsonMessage && unsubscribePayload) {
      sendJsonMessage(unsubscribePayload)
    }
  }, [sendJsonMessage, unsubscribePayload])

  // * Subscribe to the socket when the component mounts and memoize the connection
  useMemo(() => {
    if (readyState === ReadyState.OPEN && !isSubscribed.current) {
      subscribe()
      isSubscribed.current = true
    }
  }, [subscribe, isSubscribed, readyState])

  // * Unsubscribe from the socket when the component unmounts
  useEffect(() => {
    if (oldPair.current !== pair && isSubscribed.current) {
      unsubscribe()
      subscribe()
      oldPair.current = pair
    }
  }, [pair, oldPair, unsubscribe, subscribe])

  useEffect(() => {
    if (lastJsonMessage && setBinanceDiff && setWazirXDiff) {
      // console.log(brokerName, "'s last message: ", lastJsonMessage)

      if (brokerName === "Binance" && lastJsonMessage.a && lastJsonMessage.b) {
        setAskDiff(lastJsonMessage.a)
        setBidDiff(lastJsonMessage.b)
        setBinanceDiff(Number(lastJsonMessage.a), Number(lastJsonMessage.b))
      } else if (
        brokerName === "WazirX" &&
        lastJsonMessage.data.a &&
        lastJsonMessage.data.b
      ) {
        setAskDiff(lastJsonMessage.data.a[0][0])
        setBidDiff(lastJsonMessage.data.b[0][0])
        setWazirXDiff(
          Number(lastJsonMessage.data.a[0][0]),
          Number(lastJsonMessage.data.b[0][0])
        )
      }
    }
  }, [lastJsonMessage, brokerName, setBinanceDiff, setWazirXDiff])

  return (
    <Box
      flex="1"
      padding="20px"
      border="1px solid lightgray"
      borderRadius="10px"
    >
      <Typography>
        {brokerName} connection status - {connectionStatus}
      </Typography>

      <Typography>Top Ask Price - {askDiff}</Typography>
      <Typography>Top Bid Price - {bidDiff}</Typography>
    </Box>
  )
}

export default SocketData
