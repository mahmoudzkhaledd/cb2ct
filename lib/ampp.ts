import { getConfigs } from "@/utils/configs";
import amq, { Channel } from "amqplib";

export class RabbitMq {
  channel: Channel | null = null;
  exchangeName = "studies_ex";
  constructor(exName?: string) {
    this.exchangeName = exName ?? this.exchangeName;
  }
  async createChannel() {
    if (this.channel) return;
    const configs = await getConfigs();
    const url = `amqp://${configs.rabbitmqUsername}:${configs.rabbitmqPassword}@${configs.rabbitmqHost}:${configs.rabbitmqPort}${configs.rabbitmqVhost === "/" ? "" : `/${configs.rabbitmqVhost}`}`;
    console.log({ url });
    const connection = await amq.connect(url);
    this.channel = await connection.createChannel();
    if (!this.channel) return;
    await this.channel.assertExchange(this.exchangeName, "direct", {
      durable: false,
    });
  }
  async createQueueAndConsume(
    queueName: string,
    routingKey: string,
    onRecieveMessage: (data: any, ack: () => void) => Promise<void>,
  ) {
    await this.createChannel();

    const q = await this.channel?.assertQueue(queueName);
    if (!q) return;
    await this.channel?.bindQueue(q!.queue, this.exchangeName, routingKey);
    this.channel?.consume(q!.queue, async (msg) => {
      if (!msg) return;
      const ackMsg = () => {
        this.channel?.ack(msg);
      };
      const data = JSON.parse(msg.content.toString());
      await onRecieveMessage(data, ackMsg);
    });
  }
  async publishMessage(routingKey: string, message: any) {
    await this.createChannel();

    this.channel?.publish(
      this.exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(message)),
    );
  }
}

function mqSingleton() {
  const r = new RabbitMq();

  return r;
}
let rabbitMq: ReturnType<typeof mqSingleton>;
declare global {
  var rabbitMq: undefined | ReturnType<typeof mqSingleton>;
}
if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    rabbitMq = mqSingleton();
  } else {
    if (!global.rabbitMq) {
      global.rabbitMq = mqSingleton();
    }

    rabbitMq = global.rabbitMq;
  }
}
export { rabbitMq };
