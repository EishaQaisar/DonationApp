"use client"
import { ScrollView } from "react-native"
import { useAuth } from "../context/AuthContext"

const RTLScrollView = ({ children, style, contentContainerStyle, horizontal = false, ...props }) => {
  const { isRTL } = useAuth()

  // Only apply RTL direction for horizontal ScrollViews
  const rtlContentContainerStyle = horizontal
    ? {
        flexDirection: isRTL ? "row-reverse" : "row",
      }
    : {}

  return (
    <ScrollView
      style={style}
      contentContainerStyle={[contentContainerStyle, rtlContentContainerStyle]}
      horizontal={horizontal}
      {...props}
    >
      {children}
    </ScrollView>
  )
}

export default RTLScrollView

