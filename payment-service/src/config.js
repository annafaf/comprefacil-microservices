module.exports={
 port:Number(process.env.PORT||3001),
 db:process.env.DATABASE_URL||'postgres://comprefacil:comprefacil_dev@localhost:5432/comprefacil',
 rabbit:process.env.RABBITMQ_URL||'amqp://guest:guest@localhost:5672',
 queue:process.env.NOTIFICATION_QUEUE||'payment.events',
 delay:Number(process.env.PAYMENT_CONFIRMATION_DELAY_MS||3000)
};
