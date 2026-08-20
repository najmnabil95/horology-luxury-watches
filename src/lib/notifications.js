// Real Notifications Engine for Horology Luxury Watches
// WhatsApp Messaging, Web Audio Chimes, Browser Native Push, and Printable Invoicing

/**
 * Play a luxurious synthesizer audio chime using Web Audio API
 */
export function playLuxuryChime(type = 'order') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    if (type === 'order') {
      // 3-Tone Ascending Luxury Crystal Chime (E6, G#6, B6, E7)
      const frequencies = [1318.51, 1661.22, 1975.53, 2637.02];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.85);
      });
    } else if (type === 'status') {
      // 2-tone soft notification
      [1046.50, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.15, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.55);
      });
    }
  } catch (err) {
    console.warn('Audio chime playback omitted:', err);
  }
}

/**
 * Request permission for native browser push notifications
 */
export async function requestPushPermission() {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    return 'denied';
  }
}

/**
 * Trigger a native browser notification
 */
export function sendBrowserPushNotification(title, body, icon = '/favicon.ico') {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon,
        vibrate: [200, 100, 200]
      });
    } catch (err) {
      console.warn('Notification error:', err);
    }
  }
}

/**
 * Generate formatted WhatsApp receipt URL for the customer
 */
export function generateWhatsAppReceiptUrl(order, storeSettings = {}, lang = 'ar') {
  const isAr = lang === 'ar';
  const cleanPhone = (order.customer?.phone || '').replace(/[^\d+]/g, '');
  const currencySymbol = isAr ? 'ر.س' : 'SAR';

  let itemsSummary = '';
  if (order.items && order.items.length > 0) {
    itemsSummary = order.items
      .map(item => `▪️ ${item.brand || ''} ${item.name || ''} (×${item.quantity || 1}) - ${item.price} USD`)
      .join('\n');
  }

  const message = isAr
    ? `👑 *دار هورولوجي للساعات الفاخرة | HOROLOGY*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `✨ *تم تأكيد طلبكم الملكي بنجاح!*\n\n` +
      `📜 *رقم الفاتورة والطلب:* \`${order.id}\`\n` +
      `👤 *اسم العميل:* ${order.customer?.fullName || 'عميل VIP'}\n` +
      `📍 *عنوان التوصيل:* ${order.customer?.city || ''} - ${order.customer?.address || ''}\n` +
      `💳 *طريقة الدفع:* ${order.paymentMethod?.toUpperCase() || 'CARD'}\n` +
      `💵 *المبلغ الإجمالي:* ${order.total?.toLocaleString()} ${currencySymbol}\n\n` +
      `🛍️ *القطع المختارة:*\n${itemsSummary}\n\n` +
      `🛡️ *الضمان والأصالة:* ضمان دولي معتمد 5 سنوات + تأمين شحن شامل عبر DHL Valet.\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `شكراً لاختياركم HOROLOGY. خبيركم الشخصي بانتظار خدمتكم دائماً.`
    : `👑 *HOROLOGY Haute Horlogerie*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `✨ *Your VIP Order is Confirmed!*\n\n` +
      `📜 *Order Reference:* \`${order.id}\`\n` +
      `👤 *Client Name:* ${order.customer?.fullName || 'VIP Client'}\n` +
      `📍 *Destination:* ${order.customer?.city || ''}, ${order.customer?.address || ''}\n` +
      `💳 *Payment Method:* ${order.paymentMethod?.toUpperCase() || 'CARD'}\n` +
      `💵 *Total Amount:* ${order.total?.toLocaleString()} ${currencySymbol}\n\n` +
      `🛍️ *Selected Timepieces:*\n${itemsSummary}\n\n` +
      `🛡️ *Authenticity & Coverage:* 5-Year Global Haute Horlogerie Warranty & Insured Courier.\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `Thank you for trusting HOROLOGY.`;

  const phoneParam = cleanPhone ? cleanPhone.replace('+', '') : '';
  return `https://wa.me/${phoneParam}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate Admin WhatsApp Alert URL
 */
export function generateAdminWhatsAppAlertUrl(order, storeSettings = {}) {
  const adminPhone = (storeSettings.whatsappNumber || '+966501112233').replace(/[^\d]/g, '');
  const message = 
    `🚨 *إشعار طلب شراء VIP جديد | HOROLOGY*\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 *رقم الطلب:* ${order.id}\n` +
    `👤 *العميل:* ${order.customer?.fullName} (${order.customer?.phone})\n` +
    `🏙️ *المدينة:* ${order.customer?.city}\n` +
    `💰 *الإجمالي:* $${order.total} USD\n` +
    `💳 *الدفع:* ${order.paymentMethod}\n` +
    `📦 *عدد القطع:* ${order.items?.length || 1}\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `يرجى مراجعة لوحة الإدارة وتجهيز الشحنة المؤمنة.`;

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate Status Update WhatsApp message for customer contact from Admin Panel
 */
export function generateCustomerStatusWhatsAppUrl(order, newStatus, trackingNo = 'DHL-VIP-99482', lang = 'ar') {
  const isAr = lang === 'ar';
  const cleanPhone = (order.customer?.phone || '').replace(/[^\d]/g, '');

  const statusDescriptions = {
    ar: {
      confirmed: 'تم تأكيد طلبك وجاري إعداد شهادة الأصالة الملكية وفحص المعايرة الدقيقة.',
      processing: 'جاري تجهيز وتغليف ساعتك في الصندوق الخشبي الملكي الخاص.',
      shipped: `تم تسليم ساعتك الفاخرة إلى مندوب الشحن المصفح DHL Express. رقم التتبع: ${trackingNo}`,
      delivered: 'تم تسليم شحنتك الملكية بنجاح. نرجو لك أوقاتاً عامرة بالتميز والأناقة.',
      cancelled: 'تم إلغاء الطلب بناءً على رغبتكم واسترداد المستحقات بالكامل.'
    },
    en: {
      confirmed: 'Your VIP order is confirmed and currently undergoing precision chronometer verification.',
      processing: 'Your timepiece is being prepared in our lacquered wooden presentation box.',
      shipped: `Your timepiece has been dispatched via armored DHL Express. Tracking #: ${trackingNo}`,
      delivered: 'Your order has been delivered with white-glove service. Enjoy your masterpiece.',
      cancelled: 'Your order has been cancelled and refunded.'
    }
  };

  const statusText = statusDescriptions[lang]?.[newStatus] || statusDescriptions.en[newStatus] || 'تم تحديث حالة طلبك.';

  const message = isAr
    ? `👑 *تحديث حالة طلبك | HOROLOGY*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `مرحباً بك عزيزنا *${order.customer?.fullName || 'العميل الكريم'}*،\n\n` +
      `📜 *رقم الطلب:* ${order.id}\n` +
      `🔔 *الحالة الحالية:* ${statusText}\n\n` +
      `إذا كان لديك أي استفسار، فإن خبير الساعات الخاص بك جاهز لمساعدتك في أي وقت.`
    : `👑 *Order Status Update | HOROLOGY*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `Dear *${order.customer?.fullName || 'VIP Client'}*,\n\n` +
      `📜 *Order Reference:* ${order.id}\n` +
      `🔔 *Current Status:* ${statusText}\n\n` +
      `Please feel free to reach out to your dedicated Horology Concierge for any assistance.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Print or Download Formal Luxury Tax Invoice
 */
export function printOrDownloadInvoice(order, storeSettings = {}, lang = 'ar') {
  const isAr = lang === 'ar';
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    alert(isAr ? 'يرجى السماح بالنوافذ المنبثقة لطباعة الفاتورة' : 'Please allow popups to print the invoice');
    return;
  }

  const itemsHtml = (order.items || []).map((item, idx) => `
    <tr style="border-bottom: 1px solid #27272a;">
      <td style="padding: 12px 8px; text-align: ${isAr ? 'right' : 'left'}; font-weight: bold; color: #f4f4f5;">
        ${item.brand || ''} - ${item.name || ''}
        <div style="font-size: 11px; color: #a1a1aa; font-weight: normal;">Ref: ${item.ref || 'HR-CHRONO-2026'} | Calibre: ${item.movement || 'Swiss Auto'}</div>
      </td>
      <td style="padding: 12px 8px; text-align: center; color: #f4f4f5;">${item.quantity || 1}</td>
      <td style="padding: 12px 8px; text-align: ${isAr ? 'left' : 'right'}; color: #f4f4f5;">$${(item.price || 0).toLocaleString()}</td>
      <td style="padding: 12px 8px; text-align: ${isAr ? 'left' : 'right'}; font-weight: bold; color: #fbbf24;">$${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <title>Tax Invoice - ${order.id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Tajawal:wght@400;600;700;900&display=swap');
        body {
          font-family: ${isAr ? "'Tajawal', sans-serif" : "'Cinzel', 'Tajawal', serif"};
          background-color: #09090b;
          color: #f4f4f5;
          margin: 0;
          padding: 30px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .invoice-card {
          max-width: 780px;
          margin: 0 auto;
          background: #121622;
          border: 1px solid #d4af37;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #27272a;
          padding-bottom: 24px;
        }
        .logo-title {
          font-size: 26px;
          font-weight: 900;
          letter-spacing: 2px;
          color: #d4af37;
        }
        .gold-badge {
          display: inline-block;
          background: rgba(212, 175, 55, 0.15);
          color: #fbbf24;
          border: 1px solid #d4af37;
          border-radius: 9999px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: bold;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 24px 0;
          background: #181d29;
          border-radius: 12px;
          padding: 16px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
        }
        th {
          background: #181d29;
          color: #d4af37;
          font-size: 12px;
          padding: 12px 8px;
          text-align: ${isAr ? 'right' : 'left'};
          border-bottom: 1px solid #3f3f46;
        }
        .totals-box {
          width: 280px;
          margin-${isAr ? 'right' : 'left'}: auto;
          background: #181d29;
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 16px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 13px;
        }
        .grand-total {
          border-top: 1px solid #d4af37;
          margin-top: 8px;
          padding-top: 8px;
          font-weight: 900;
          font-size: 18px;
          color: #fbbf24;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 11px;
          color: #71717a;
          border-top: 1px solid #27272a;
          padding-top: 16px;
        }
        .seal {
          display: inline-block;
          border: 2px dashed #d4af37;
          border-radius: 50%;
          width: 70px;
          height: 70px;
          line-height: 70px;
          text-align: center;
          color: #d4af37;
          font-size: 10px;
          font-weight: bold;
          transform: rotate(-10deg);
        }
        @media print {
          body { background: white; color: black; }
          .invoice-card { background: white; color: black; border: 1px solid #333; }
          th { background: #eee; color: black; }
          .info-grid, .totals-box { background: #f9f9f9; color: black; border: 1px solid #ddd; }
          .grand-total { color: #000; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <div class="header">
          <div>
            <div class="logo-title">👑 HOROLOGY</div>
            <div style="font-size: 12px; color: #a1a1aa;">${isAr ? 'دار الساعات الرجالية الفاخرة' : 'Haute Horlogerie Sanctuary'}</div>
            <div style="font-size: 11px; color: #71717a; margin-top: 4px;">CR: 1010899440 | Tax ID: 310984882900003</div>
          </div>
          <div style="text-align: ${isAr ? 'left' : 'right'};">
            <span class="gold-badge">${isAr ? 'فاتورة ضريبية رسمية' : 'OFFICIAL TAX INVOICE'}</span>
            <div style="font-size: 16px; font-weight: bold; color: #fbbf24; margin-top: 6px;">#${order.id}</div>
            <div style="font-size: 11px; color: #a1a1aa;">${order.date || new Date().toISOString().slice(0, 10)}</div>
          </div>
        </div>

        <div class="info-grid">
          <div>
            <div style="font-size: 11px; font-weight: bold; color: #d4af37; margin-bottom: 4px;">${isAr ? 'بيانات العميل VIP' : 'VIP CLIENT DETAILS'}</div>
            <div style="font-weight: bold; font-size: 13px;">${order.customer?.fullName || 'VIP Customer'}</div>
            <div style="font-size: 12px; color: #a1a1aa;">${order.customer?.phone || ''}</div>
            <div style="font-size: 12px; color: #a1a1aa;">${order.customer?.email || ''}</div>
          </div>
          <div>
            <div style="font-size: 11px; font-weight: bold; color: #d4af37; margin-bottom: 4px;">${isAr ? 'عنوان التسليم والوسيلة' : 'SHIPPING & PAYMENT'}</div>
            <div style="font-size: 12px; color: #f4f4f5;">${order.customer?.city || ''}</div>
            <div style="font-size: 12px; color: #a1a1aa;">${order.customer?.address || ''}</div>
            <div style="font-size: 11px; color: #38bdf8; font-weight: bold; margin-top: 4px;">${isAr ? 'طريقة السداد:' : 'Payment:'} ${order.paymentMethod?.toUpperCase()}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>${isAr ? 'الساعة والبيانات التقنية' : 'Timepiece & Calibre'}</th>
              <th style="text-align: center;">${isAr ? 'الكمية' : 'Qty'}</th>
              <th style="text-align: ${isAr ? 'left' : 'right'};">${isAr ? 'سعر الوحدة' : 'Unit Price'}</th>
              <th style="text-align: ${isAr ? 'left' : 'right'};">${isAr ? 'الإجمالي' : 'Total'}</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div class="seal">
            OFFICIAL<br>VERIFIED
          </div>

          <div class="totals-box">
            <div class="total-row">
              <span style="color: #a1a1aa;">${isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
              <span>$${(order.subtotal || order.total).toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span style="color: #a1a1aa;">${isAr ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
              <span>$${(order.tax || 0).toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span style="color: #a1a1aa;">${isAr ? 'الشحن والتأمين الملكي:' : 'Insured Shipping:'}</span>
              <span style="color: #34d399;">${isAr ? 'مجاني VIP' : 'Free VIP'}</span>
            </div>
            <div class="total-row grand-total">
              <span>${isAr ? 'المبلغ النهائي:' : 'Grand Total:'}</span>
              <span>$${(order.total || 0).toLocaleString()} USD</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <div>${isAr ? 'جميع الساعات أصلية ومفحوصة بمعايير الكرونومتر السويسري مع ضمان 5 سنوات دولي.' : 'All timepieces certified authentic with 5-Year international warranty and serial verification.'}</div>
          <div style="margin-top: 4px; font-weight: bold; color: #d4af37;">HOROLOGY | www.horology-luxury.com</div>
        </div>
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
