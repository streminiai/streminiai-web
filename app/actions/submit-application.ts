"use server"

import { supabase } from "@/lib/supabase"

export async function submitJobApplication(formData: {
  name: string
  email: string
  portfolio: string
  message: string
  jobTitle?: string
}) {
  try {
    const { data, error } = await supabase
      .from("job_applications")
      .insert([
        {
          full_name: formData.name,
          email: formData.email,
          portfolio_url: formData.portfolio,
          message: formData.message,
          // job_id: ... in a real app we'd lookup the uuid, 
          // for now we'll store the job title in a separate field or just message
          status: "pending",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return { success: false, error: error.message }
    }

    // Optional: Send email notification via EmailJS or similar here
    
    return { success: true, data }
  } catch (error) {
    console.error("Job application server action error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to submit application" 
    }
  }
}
