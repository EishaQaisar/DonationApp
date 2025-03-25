"use client"
import { Text } from "react-native"
import { useAuth } from "../context/AuthContext"

const RTLText = ({ children, style, ...props }) => {
  const { isRTL } = useAuth()

  return (
    <Text style={[style, { textAlign: isRTL ? "right" : "left" }]} {...props}>
      {children}
    </Text>
  )
}

export default RTLText

