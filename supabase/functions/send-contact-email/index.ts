import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send contact email");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactEmailRequest = await req.json();
    
    console.log(`Processing contact from: ${name} (${email})`);

    // Validate inputs
    if (!name || !email || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to admin using Resend API directly
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AZLINDA <noreply@azlinda.com>",
        to: ["info@azlinda.com"],
        subject: `رسالة جديدة من ${name}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #0066cc;">رسالة جديدة من موقع AZLINDA</h1>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>الاسم:</strong> ${name}</p>
              <p><strong>البريد الإلكتروني:</strong> ${email}</p>
              <p><strong>الرسالة:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 5px;">${message}</p>
            </div>
          </div>
        `,
      }),
    });

    const adminResult = await adminEmailResponse.json();
    console.log("Admin email result:", adminResult);

    // Send confirmation email to user
    const userEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AZLINDA <noreply@azlinda.com>",
        to: [email],
        subject: "شكراً لتواصلك معنا - AZLINDA",
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #0066cc;">شكراً لتواصلك معنا، ${name}!</h1>
            <p>لقد استلمنا رسالتك وسنتواصل معك في أقرب وقت ممكن.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>رسالتك:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 5px;">${message}</p>
            </div>
            <p>مع تحيات،<br/>فريق AZLINDA</p>
          </div>
        `,
      }),
    });

    const userResult = await userEmailResponse.json();
    console.log("User confirmation email result:", userResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminResult,
        userEmail: userResult 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
