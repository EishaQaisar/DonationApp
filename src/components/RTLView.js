"use client"
import { View } from "react-native"
import { useAuth } from "../context/AuthContext"

const RTLView = ({
  children,
  style,
  reverseDirection = true,
  alignText = true,
  swapMargins = true,
  swapPadding = true,
  swapPosition = true,
}) => {
  const { isRTL } = useAuth()

  // Create RTL-aware styles
  const rtlStyle = {}

  // Handle flex direction
  if (reverseDirection && style && style.flexDirection === "row") {
    rtlStyle.flexDirection = isRTL ? "row-reverse" : "row"
  } else if (reverseDirection && !style?.flexDirection) {
    // If flexDirection is not specified but reverseDirection is true,
    // assume row and apply RTL if needed
    rtlStyle.flexDirection = isRTL ? "row-reverse" : "row"
  }

  // Handle text alignment
  if (alignText && style && style.textAlign) {
    rtlStyle.textAlign = isRTL ? (style.textAlign === "left" ? "right" : "left") : style.textAlign
  }

  // Handle margin swapping
  if (swapMargins) {
    if (style && style.marginLeft) {
      rtlStyle.marginLeft = isRTL ? style.marginRight || style.marginLeft : style.marginLeft
      rtlStyle.marginRight = isRTL ? style.marginLeft : style.marginRight || style.marginLeft
    }
    if (style && style.marginRight) {
      rtlStyle.marginRight = isRTL ? style.marginLeft || style.marginRight : style.marginRight
      rtlStyle.marginLeft = isRTL ? style.marginRight : style.marginLeft || style.marginRight
    }
  }

  // Handle padding swapping
  if (swapPadding) {
    if (style && style.paddingLeft) {
      rtlStyle.paddingLeft = isRTL ? style.paddingRight || style.paddingLeft : style.paddingLeft
      rtlStyle.paddingRight = isRTL ? style.paddingLeft : style.paddingRight || style.paddingLeft
    }
    if (style && style.paddingRight) {
      rtlStyle.paddingRight = isRTL ? style.paddingLeft || style.paddingRight : style.paddingRight
      rtlStyle.paddingLeft = isRTL ? style.paddingRight : style.paddingLeft || style.paddingRight
    }
  }

  // Handle position swapping
  if (swapPosition) {
    if (style && style.left !== undefined) {
      rtlStyle.left = isRTL ? style.right : style.left
      rtlStyle.right = isRTL ? style.left : style.right
    }
    if (style && style.right !== undefined) {
      rtlStyle.right = isRTL ? style.left : style.right
      rtlStyle.left = isRTL ? style.right : style.left
    }
  }

  return <View style={[style, rtlStyle]}>{children}</View>
}

export default RTLView

