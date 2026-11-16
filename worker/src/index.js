export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";

    // CORS preflight
    if (request.method === "OPTIONS") {
      if (allowedOrigin !== "*" && origin !== allowedOrigin) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
    };

    if (allowedOrigin !== "*" && origin !== allowedOrigin) {
      return new Response(JSON.stringify({ error: "Forbidden origin" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let count = 0;
    try {
      const body = await request.json();
      const rawCount = parseInt(body.count, 10);
      count = Number.isFinite(rawCount) && rawCount >= 0 ? rawCount : 0;
    } catch (err) {
      count = 0;
    }

    if (!env.TARGET_EMAIL || !env.FROM_EMAIL || !env.EMAIL) {
      return new Response(JSON.stringify({ error: "Email service misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subject = "you just got egged 🥚";
    const text = `${count} eggs landed. clean yourself up.`;

    try {
      await env.EMAIL.send({
        to: env.TARGET_EMAIL,
        from: env.FROM_EMAIL,
        subject,
        text,
      });

      return new Response(JSON.stringify({ success: true, count }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to send email", details: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
