'use strict';

const fs = require('fs');
const axios = require('axios');
const url = `https://github.com/opentraveldata/opentraveldata/blob/master/opentraveldata/optd_por_public.csv?raw=true`;
const output = `${__dirname}/data.json`;

axios.get(url)
  .then((res) => {
    const rows = res.data.split(/\n/);
    const { iata_code, timezone } = rows
      .shift()
      .split(`^`)
      .reduce((a, key, i) => {
        if (key === `iata_code`)
          a.iata_code = i;
        else if (key === `timezone`)
          a.timezone = i;

        return a;
      }, {});

    const timezones = rows
      .reduce((a, line) => {
        const values = line.split(`^`);

        const airport = values[iata_code];

        a[airport] = values[timezone];

        return a;
      }, {});

    fs.writeFile(output, JSON.stringify(timezones, null, 2));
  })
  .catch((err) => console.log(err));
