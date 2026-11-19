const {Pool}=require('pg');
const c=require('./config');
const pool=new Pool({connectionString:c.db});
async function connectDb(){
 for(let i=1;i<=20;i++){try{await pool.query('SELECT 1');console.log('[payment] PostgreSQL conectado');return;}
 catch(e){console.log(`[payment] Aguardando PostgreSQL ${i}/20`);await new Promise(r=>setTimeout(r,2000));}}
 throw new Error('PostgreSQL indisponível');
}
module.exports={pool,connectDb};
