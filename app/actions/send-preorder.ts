"use server"


export async function sendPreorderEmail(email: string, wishlistItems: Array<{ feature: string; description: string }>) {
    const submissionTime = new Date().toLocaleString(); 
  try {
    
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: email,
          user_email: email,
          wishlist_items: wishlistItems.map((item) => `${item.feature}: ${item.description}`).join("\n"),
          message: `I'm interested in these features for Stremini AI:\n\n${wishlistItems.map((item) => `• ${item.feature}${item.description ? ": " + item.description : ""}`).join("\n")}`,
          name: email,  
          time: submissionTime, 
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send email")
    }

    return { success: true }
  } catch (error) {
    console.error("Preorder email error:", error)
    return { success: false, error: "Failed to send preorder email" }
  }
}
