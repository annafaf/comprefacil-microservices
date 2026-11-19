function buildNotification(event){
 const p=event.payment||{};
 const text=event.eventType==='payment.received'
  ? `Olá, ${p.customerName}. Recebemos sua solicitação de pagamento de R$ ${Number(p.amount).toFixed(2)}.`
  : event.eventType==='payment.confirmed'
  ? `Olá, ${p.customerName}. Seu pagamento de R$ ${Number(p.amount).toFixed(2)} foi confirmado.`
  : `Evento recebido: ${event.eventType||'desconhecido'}.`;
 return {notificationId:event.eventId,eventType:event.eventType,paymentId:p.id,recipient:p.customerEmail,message:text,createdAt:new Date().toISOString()};
}
module.exports={buildNotification};
