const express=require('express');
const c=require('./config');
const {pool,connectDb}=require('./database');
const {connectQueue,closeQueue}=require('./messaging');
const {createPayment,getPayment}=require('./payments');
const {validatePaymentInput}=require('./validation');
const app=express();app.use(express.json());
app.get('/health',(_,res)=>res.json({service:'payment-service',status:'ok'}));
app.post('/payments',async(req,res)=>{
 const {error,data}=validatePaymentInput(req.body);
 if(error)return res.status(400).json({error});
 try{const p=await createPayment(data);
 return res.status(202).json({message:'Solicitação recebida para processamento assíncrono',payment:{id:p.id,customerName:p.customer_name,customerEmail:p.customer_email,amount:Number(p.amount),status:p.status,createdAt:p.created_at}});
 }catch(e){console.error(e);return res.status(500).json({error:'Falha ao registrar pagamento'});}
});
app.get('/payments/:id',async(req,res)=>{try{const p=await getPayment(req.params.id);if(!p)return res.status(404).json({error:'Pagamento não encontrado'});
 res.json({id:p.id,customerName:p.customer_name,customerEmail:p.customer_email,amount:Number(p.amount),status:p.status,createdAt:p.created_at,updatedAt:p.updated_at});
 }catch(e){console.error(e);res.status(500).json({error:'Falha ao consultar pagamento'});}});
async function start(){await connectDb();await connectQueue();app.listen(c.port,()=>console.log(`[payment] API na porta ${c.port}`));}
start().catch(e=>{console.error(e);process.exit(1);});
async function shutdown(){await closeQueue();await pool.end();process.exit(0);}
process.on('SIGTERM',shutdown);
process.on('SIGINT',shutdown);
