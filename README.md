# CompreFácil — Microsserviços de pagamento e notificação

Projeto didático do desafio SENAI de Sistemas Distribuídos.

## Serviços
- **payment-service** (Node.js/Express): recebe solicitações REST, grava no PostgreSQL e publica eventos AMQP.
- **notification-service** (Node.js/Express): consome eventos RabbitMQ e registra notificações simuladas.
- **PostgreSQL**: persiste pagamentos.
- **RabbitMQ**: fila durável `payment.events`.
- **Docker Compose**: executa os quatro componentes.

## Início rápido
Na pasta deste README:
```bash
docker compose up --build
```
Aguarde os serviços `postgres` e `rabbitmq` ficarem saudáveis; `payment-service` e `notification-service` sobem em seguida.

## Testes automatizados
Cada serviço possui testes unitários (Node.js test runner) para as regras de negócio puras — validação de entrada, montagem de eventos e montagem de notificações:
```bash
cd payment-service && npm install && npm test
cd notification-service && npm install && npm test
```

## Endpoints
- `GET http://localhost:3001/health`
- `POST http://localhost:3001/payments`
- `GET http://localhost:3001/payments/{id}`
- `GET http://localhost:3002/health`
- `GET http://localhost:3002/notifications`
- RabbitMQ Management: http://localhost:15672 (guest / guest)

## Exemplo de solicitação
POST `http://localhost:3001/payments`, cabeçalho `Content-Type: application/json`:
```json
{
  "customerName": "Ana Souza",
  "customerEmail": "ana@example.com",
  "amount": 149.90
}
```
O serviço responde `202 Accepted` com ID e status inicial `pending`. Após 3 segundos, a confirmação simulada atualiza o status para `success` e publica o segundo evento.

## Fluxo do desafio
1. Persistir pagamento como `pending`.
2. Publicar `payment.received`.
3. Notification consome a mensagem e registra/loga aviso de recebimento.
4. Payment confirma de forma assíncrona e atualiza para `success`.
5. Publicar `payment.confirmed`.
6. Notification consome e registra/loga aviso de confirmação.

As notificações são simuladas no console e no endpoint `/notifications`; não é usado provedor externo de e-mail/SMS, pois o enunciado não indica um.

## Encerrar
`docker compose down`
Para remover também os dados persistidos: `docker compose down -v` (apaga o volume PostgreSQL).

## Limites didáticos
A confirmação é simulada, não é uma transação financeira real. Notificações ficam em memória e se perdem quando o serviço reinicia. Ambos os serviços reconectam automaticamente ao RabbitMQ em caso de queda de conexão, e o consumidor ignora eventos já processados (deduplicação em memória por `eventId`). Para produção, ainda seriam necessários Outbox Pattern, idempotência persistente e fila de mensagens mortas (DLQ).
