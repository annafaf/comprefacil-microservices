module.exports={port:Number(process.env.PORT||3002),rabbit:process.env.RABBITMQ_URL||'amqp://guest:guest@localhost:5672',queue:process.env.NOTIFICATION_QUEUE||'payment.events'};
