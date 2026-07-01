/**
 * Font family utilities for consistent typography across the app
 * Uses system fonts with appropriate font weights for Roboto-like appearance
 */

export const FontFamilies = {
  // Regular weight (400)
  regular: {
    fontFamily: "System",
    fontWeight: "400" as const,
  },
  // Medium weight (500)
  medium: {
    fontFamily: "System",
    fontWeight: "500" as const,
  },
  // Bold weight (700)
  bold: {
    fontFamily: "System",
    fontWeight: "700" as const,
  },
};

// Alternative: use specific font names if available
export const FontNames = {
  robotoRegular: "Roboto-Regular",
  robotoMedium: "Roboto-Medium",
  robotoBold: "Roboto-Bold",
};
