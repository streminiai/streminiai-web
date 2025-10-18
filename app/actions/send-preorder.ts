"use server"

import emailjs from '@emailjs/nodejs'

export async function sendPreorderEmail(
  email: string,
  wishlistItems: Array<{ feature: string; description: string }>
) {
  const submissionTime = new Date().toLocaleString()

  try {
    // Check if env vars exist
    if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY || !process.env.EMAILJS_PRIVATE_KEY) {
      console.error("Missing EmailJS environment variables")
      return { success: false, error: "Configuration error" }
    }

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: email,
        user_email: email,
        name: email,
        time: submissionTime,
        message: `I'm interested in these features for Stremini AI:\n\n${wishlistItems
          .map((item) => `• ${item.feature}${item.description ? ": " + item.description : ""}`)
          .join("\n")}`,
        wishlist_items: wishlistItems
          .map((item) => `${item.feature}${item.description ? ": " + item.description : ""}`)
          .join("\n"),
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY, // Required for server-side
      }
    )

    console.log("Email sent successfully:", response)
    return { success: true }
  } catch (error) {
    console.error("Preorder email error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to send preorder email" 
    }
  }
}