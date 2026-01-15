export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    const data = await request.json();
    const token = "8585400664:AAGOHNW0wgx7CTrKp27N00-BRZPrAKtEpOI"; // TODO: Move to env
    const chatId = "1172102714"; // TODO: Move to env

    if (!data.name || !data.phone) {
        return new Response(JSON.stringify({
            error: "Missing fields"
        }), { status: 400 });
    }

    // Format message HTML
    const message = `🚀 <b>Nueva Solicitud de Presupuesto</b>\n\n` +
        `👤 <b>Nombre:</b> ${data.name}\n` +
        `📞 <b>Teléfono:</b> ${data.phone}\n` +
        `🛠 <b>Servicio:</b> ${data.service}\n` +
        `📝 <b>Detalles:</b> ${data.details}`;

    try {
        const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();

        if (!result.ok) {
            console.error("Telegram API Error:", result);
            return new Response(JSON.stringify({ error: "Failed to send to Telegram" }), { status: 500 });
        }

        return new Response(JSON.stringify({ status: "success" }), { status: 200 });

    } catch (error) {
        console.error("Fetch Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
