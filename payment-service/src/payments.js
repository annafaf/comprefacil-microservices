const {randomUUID}=require('node:crypto');
const {pool}=require('./database');
const {publish}=require('./messaging');
const c=require('./config');
function buildPaymentEvent(eventType,row){
 return {eventId:randomUUID(),eventType,occurredAt:new Date().toISOString(),
  payment:{id:row.id,customerName:row.customer_name,customerEmail:row.customer_email,amount:Number(row.amount),status:row.status}};
}
async function createPayment(input){
 const id=randomUUID();
 const q=await pool.query(
  `INSERT INTO payments(id,customer_name,customer_email,amount,status)
   VALUES($1,$2,$3,$4,'pending')
   RETURNING id,customer_name,customer_email,amount,status,created_at`,
  [id,input.customerName,input.customerEmail,input.amount]);
 const p=q.rows[0];
 publish(buildPaymentEvent('payment.received',p));
 setTimeout(()=>confirmPayment(id).catch(e=>console.error('[payment] Confirmação falhou',e)),c.delay);
 return p;
}
async function confirmPayment(id){
 const q=await pool.query(
  `UPDATE payments SET status='success',updated_at=NOW()
   WHERE id=$1 AND status='pending'
   RETURNING id,customer_name,customer_email,amount,status`,[id]);
 if(!q.rowCount)return;
 const p=q.rows[0];
 publish(buildPaymentEvent('payment.confirmed',p));
 console.log('[payment] Pagamento confirmado:',id);
}
async function getPayment(id){
 const q=await pool.query('SELECT id,customer_name,customer_email,amount,status,created_at,updated_at FROM payments WHERE id=$1',[id]);
 return q.rows[0]||null;
}
module.exports={createPayment,getPayment,buildPaymentEvent};
