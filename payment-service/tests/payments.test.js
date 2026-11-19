const test=require('node:test');
const assert=require('node:assert/strict');
const {buildPaymentEvent}=require('../src/payments');

const row={id:'abc-123',customer_name:'Ana Souza',customer_email:'ana@example.com',amount:'149.90',status:'pending'};

test('monta evento payment.received a partir da linha do banco',()=>{
 const event=buildPaymentEvent('payment.received',row);
 assert.equal(event.eventType,'payment.received');
 assert.ok(event.eventId);
 assert.ok(event.occurredAt);
 assert.deepEqual(event.payment,{id:'abc-123',customerName:'Ana Souza',customerEmail:'ana@example.com',amount:149.9,status:'pending'});
});

test('converte amount em string para número',()=>{
 const event=buildPaymentEvent('payment.confirmed',{...row,status:'success'});
 assert.equal(typeof event.payment.amount,'number');
 assert.equal(event.payment.status,'success');
});
