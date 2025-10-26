import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConfirmationEmailRequest {
  email: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email }: ConfirmationEmailRequest = await req.json()
    
    console.log('Sending confirmation email to:', email)

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SparshMukhti <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to SparshMukhti Waitlist!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #7E69AB; text-align: center;">Welcome to SparshMukhti! 🎉</h1>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; margin: 20px 0;">
              <p style="color: white; font-size: 18px; text-align: center; margin: 0;">
                Thank you for joining our waitlist!
              </p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">What's Coming:</h2>
              <ul style="color: #666; line-height: 1.8;">
                <li>✨ Native OBS Studio plugin</li>
                <li>🎯 Advanced gesture customization</li>
                <li>📴 Offline mode support</li>
                <li>🚀 Priority support</li>
              </ul>
            </div>

            <p style="color: #666; line-height: 1.6;">
              We'll notify you as soon as the desktop app is ready for download. 
              Get ready to revolutionize your streaming experience with gesture control!
            </p>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #7E69AB;">The SparshMukhti Team</strong>
              </p>
            </div>
          </div>
        `,
      }),
    })

    const data = await res.json()
    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (error: any) {
    console.error('Error sending confirmation email:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
