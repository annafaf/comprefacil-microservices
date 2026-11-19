const express=require('express');
const c=require('./config');
const {startConsumer,notifications}=require('./consumer');
const app=express();
app.get('/health',(_,res)=>res.json({service:'notification-service',status:'ok'}));
app.get('/notifications',(_,res)=>res.json({count:notifications.length,notifications}));
async function start(){await startConsumer();app.listen(c.port,()=>console.log(`[notification] API na porta ${c.port}`));}
start().catch(e=>{console.error(e);process.exit(1);});
