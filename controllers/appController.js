const axios = require('axios');
// add chartjs here and render it in the main page from here
const chart = require('chart.js');

exports.getApiData = async (req, res, next) => {
  const symbols = 'baba,amzn,goog,gold';
  const uri = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=' + symbols + '&types=quote,chart&range=1m&last=10';
  let theData;
  await axios
    .get(uri)
    .then(resp => {
      // res.locals.theData = [];
      // res.locals.theData.push(resp.data);
      res.locals.theData = resp.data;
      next();
    })
    .catch(error => {
      console.log(error);
    });
}

exports.renderMain = (req, res) => {
  const data = res.locals.theData;
  let stocks = [];
  let dates = [];
  let datasets = [];

  for (let key in data) {
    if (!data.hasOwnProperty(key)) continue;
    let stock = data[key];
    stocks.push(stock);
  };
  
  stocks[0].chart.forEach(day => dates.push(day.date));

  stocks.forEach(stock => {
    let obj = new Object();
    obj.label = stock.quote.symbol
    let arr = [];
    stock.chart.forEach(day => arr.push(day.close));
    obj.data = arr;
    datasets.push(obj);
  });

  // stocks.forEach(stock => {
  //   console.log('......................')
  //   console.log(stock);
  // });
  // res.json(data);

  res.render('main', { title: 'Main Page', dates, stocks: data, datasets });
}