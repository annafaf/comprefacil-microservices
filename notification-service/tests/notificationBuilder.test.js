const test=require('node:test');
const assert=require('node:assert/strict');
const {buildNotification}=require('../src/notificationBuilder');

test('monta mensagem de recebimento da solicitação',()=>{
 const event={eventId:'e1',eventType:'payment.received',payment:{id:'p1',customerName:'Ana',customerEmail:'ana@example.com',amount:100}};
 const n=buildNotification(event);
 assert.equal(n.notificationId,'e1');
 assert.equal(n.paymentId,'p1');
 assert.equal(n.recipient,'ana@example.com');
 assert.match(n.message,/Recebemos sua solicitação de pagamento de R\$ 100\.00/);
});

test('monta mensagem de confirmação do pagamento',()=>{
 const event={eventId:'e2',eventType:'payment.confirmed',payment:{id:'p1',customerName:'Ana',customerEmail:'ana@example.com',amount:100}};
 const n=buildNotification(event);
 assert.match(n.message,/foi confirmado/);
});

test('trata eventType desconhecido sem quebrar',()=>{
 const event={eventId:'e3',eventType:'outro.evento',payment:{}};
 const n=buildNotification(event);
 assert.match(n.message,/Evento recebido: outro\.evento/);
});
