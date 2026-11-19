const amqp=require('amqplib');
const c=require('./config');
let connection;
let channel;
async function connectQueue(){
 for(let i=1;i<=20;i++){try{
  connection=await amqp.connect(c.rabbit);
  channel=await connection.createChannel();
  await channel.assertQueue(c.queue,{durable:true});
  connection.on('error',e=>console.error('[payment] RabbitMQ',e.message));
  connection.on('close',()=>{console.error('[payment] Conexão RabbitMQ encerrada, tentando reconectar');channel=null;connectQueue().catch(err=>console.error('[payment] Falha ao reconectar',err.message));});
  console.log('[payment] RabbitMQ conectado');return;
 }catch(e){console.log(`[payment] Aguardando RabbitMQ ${i}/20`);await new Promise(r=>setTimeout(r,2000));}}
 throw new Error('RabbitMQ indisponível');
}
function publish(event){
 if(!channel)throw new Error('Canal RabbitMQ indisponível');
 channel.sendToQueue(c.queue,Buffer.from(JSON.stringify(event)),{persistent:true,contentType:'application/json',messageId:event.eventId});
}
async function closeQueue(){
 if(channel)await channel.close().catch(()=>{});
 if(connection)await connection.close().catch(()=>{});
}
module.exports={connectQueue,publish,closeQueue};
