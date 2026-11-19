const amqp=require('amqplib');
const c=require('./config');
const {buildNotification}=require('./notificationBuilder');
const notifications=[];
const processedEventIds=new Set();
async function startConsumer(){
 let connection;
 let channel;
 for(let i=1;i<=20;i++){try{connection=await amqp.connect(c.rabbit);channel=await connection.createChannel();
  await channel.assertQueue(c.queue,{durable:true});await channel.prefetch(10);
  connection.on('error',e=>console.error('[notification] RabbitMQ',e.message));
  connection.on('close',()=>{console.error('[notification] Conexão RabbitMQ encerrada, tentando reconectar');startConsumer().catch(err=>console.error('[notification] Falha ao reconectar',err.message));});
  console.log('[notification] Consumindo fila',c.queue);
  break;
 }catch(e){console.log(`[notification] Aguardando RabbitMQ ${i}/20`);await new Promise(r=>setTimeout(r,2000));}}
 if(!channel)throw new Error('RabbitMQ indisponível');
 await channel.consume(c.queue,msg=>{
  if(!msg)return;
  try{const event=JSON.parse(msg.content.toString());
   if(processedEventIds.has(event.eventId)){channel.ack(msg);return;}
   const item=buildNotification(event);
   notifications.unshift(item);processedEventIds.add(event.eventId);
   console.log('[notification] NOTIFICAÇÃO SIMULADA',JSON.stringify(item));
   channel.ack(msg);
  }catch(e){console.error('[notification] Mensagem inválida',e);channel.nack(msg,false,false);}
 },{noAck:false});
}
module.exports={startConsumer,notifications};
