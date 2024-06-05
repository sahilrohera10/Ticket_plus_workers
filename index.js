const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const express = require("express");
const app = express();

require("dotenv").config({ path: `${process.cwd()}/.env` });

const send_mail = () =>
  new Promise((resolve, reject) => setTimeout(() => resolve(), 5 * 1000));

console.log("bullmq=>", process.env.REDIS_BULLMQ_URL);
const connection = new IORedis(process.env.REDIS_BULLMQ_URL || "", {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log("A message recieved on worker 1 for job id => ", job.id);
    console.log("Processing Message and sending mail .............");
    await send_mail();
    console.log("Email sent ....");
  },
  {
    connection,
  }
);
const worker2 = new Worker(
  "email-queue",
  async (job) => {
    console.log("A message recieved on worker 2 for job id => ", job.id);
    console.log("Processing Message and sending mail .............");
    await send_mail();
    console.log("Email sent ....");
  },
  {
    connection,
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Workers are running on port ${PORT}`);
});
