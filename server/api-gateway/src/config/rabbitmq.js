const amqp = require("amqplib");

class RabbitMQClient {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queues = {
      claim: "claim-requests",
      policy: "policy-requests",
      replies: "reply-queue",
    };
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000;
    this.responseListeners = new Map();
    this.correlationCounter = 0;
  }

  generateCorrelationId() {
    this.correlationCounter = (this.correlationCounter + 1) % 1000000;
    return `${Date.now()}-${this.correlationCounter}`;
  }

  async connect() {
    if (this.isConnecting) return;

    this.isConnecting = true;

    try {
      const options = {
        protocol: "amqp",
        hostname: process.env.RABBITMQ_HOST || "localhost",
        port: parseInt(process.env.RABBITMQ_PORT) || 5672,
        vhost: process.env.RABBITMQ_VHOST || "/",
        username: process.env.RABBITMQ_USER || "guest",
        password: process.env.RABBITMQ_PASS || "guest",
        heartbeat: parseInt(process.env.RABBITMQ_HEARTBEAT) || 60,
      };

      this.connection = await amqp.connect(options);
      this.reconnectAttempts = 0;

      this.connection.on("error", () => this.handleConnectionError());
      this.connection.on("close", () => this.handleConnectionError());

      this.channel = await this.connection.createChannel();
      this.channel.on("error", () => this.handleChannelError());
      this.channel.on("close", () => this.handleChannelError());

      for (const queue of Object.values(this.queues)) {
        await this.channel.assertQueue(queue, {
          durable: true,
          autoDelete: false,
        });
      }
    } catch (error) {
      this.connection = null;
      this.channel = null;

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        await new Promise((res) => setTimeout(res, this.reconnectDelay));
        return this.connect();
      } else {
        console.error("RabbitMQ connection failed:", error.message);
        throw error;
      }
    } finally {
      this.isConnecting = false;
    }
  }

  async handleConnectionError() {
    this.connection = null;
    this.channel = null;
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      await new Promise((res) => setTimeout(res, this.reconnectDelay));
      return this.connect();
    }
  }

  async handleChannelError() {
    this.channel = null;
    await this.connect();
  }

  async sendRequest(queueKey, request) {
    if (!this.channel || this.channel.closed) {
      await this.connect();
    }

    const queueName = this.queues[queueKey];
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(request)), {
      persistent: true,
    });
  }

  async sendRequestAndWaitResponse(queueKey, request) {
    if (!this.channel || this.channel.closed) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      const correlationId = this.generateCorrelationId();
      const replyTo = this.queues.replies;

      const timeoutId = setTimeout(() => {
        this.responseListeners.delete(correlationId);
        reject(new Error("Request timeout after 30 seconds"));
      }, 30000);

      this.responseListeners.set(correlationId, (response) => {
        clearTimeout(timeoutId);
        this.responseListeners.delete(correlationId);
        resolve(response);
      });

      this.channel.consume(
        replyTo,
        (msg) => {
          if (!msg) return;

          const msgCorrelationId = msg.properties.correlationId;
          const listener = this.responseListeners.get(msgCorrelationId);

          if (listener) {
            const response = JSON.parse(msg.content.toString());
            this.channel.ack(msg);
            listener(response);
          } else {
            this.channel.nack(msg, false, true);
          }
        },
        { noAck: false }
      );

      const queueName = this.queues[queueKey];
      this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(request)), {
        correlationId,
        replyTo,
        persistent: true,
        expiration: 30000,
      });
    });
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    this.connection = null;
    this.channel = null;
  }
}

const rabbitMQClient = new RabbitMQClient();
module.exports = rabbitMQClient;
