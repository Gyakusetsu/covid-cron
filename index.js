require('dotenv').config();

const express = require('express');
const axios = require('axios');
const CronJob = require('cron').CronJob;

const app = express();

console.log('Before job instantiation');

const every9AM = '00 00 09 * * *';
const every10Seconds = '*/10 * * * * *';
const every10minutes = '0 */10 * * * *';

const job = new CronJob(every9AM, async function () {
  let phToday = {};

  await axios.post(process.env.WEBHOOK_URL, {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Hello <!channel|channel> Please always wash your hands!`
        }
      }
    ]
  });

  await axios.get('https://corona.lmao.ninja/countries/PH')
    .then((result) => {
      phToday = result.data;
    });

  await axios.post(process.env.WEBHOOK_URL, {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:flag-ph: API reference is https://github.com/NovelCOVID/API`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text":
            `Cases: *${phToday.cases}* \n` +
            `Cases Today : *${phToday.todayCases}*\n` +
            `Deaths : *${phToday.deaths}*\n` +
            `Deaths Today : *${phToday.todayDeaths}*\n` +
            `Recovered : *${phToday.recovered}*\n` +
            `Active : *${phToday.active}*\n` +
            `Critical : *${phToday.critical}*\n` +
            `Last Update : *${new Date(phToday.updated)}*\n`
        }
      }
    ]
  });

  let worldToday = {};

  await axios.get('https://corona.lmao.ninja/all')
    .then((result) => {
      worldToday = result.data;
    });

  await axios.post(process.env.WEBHOOK_URL, {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:flags: API reference is https://github.com/NovelCOVID/API`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text":
            `Cases: *${worldToday.cases}* \n` +
            `Deaths : *${worldToday.deaths}*\n` +
            `Recovered : *${worldToday.recovered}*\n` +
            `Active : *${worldToday.active}*\n` +
            `Last Update : *${new Date(worldToday.updated)}*\n`
        }
      }
    ]
  });
});

console.log('After job instantiation');

job.start();

app.get('/', (req, res) => {
  return res.status(200).send(`Healthy Since ${new Date()}`);
});

const jobAwake = new CronJob(every10minutes, async function () {
  const result = await axios.get('https://auto-covid-news.herokuapp.com/');
  console.log(result.data);
});

jobAwake.start();

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
