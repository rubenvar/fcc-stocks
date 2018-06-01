const mongoose = require('mongoose');
const Stock = mongoose.model('Stock');
const axios = require('axios');

exports.getSymbols = async (req, res, next) => {
  const stocks = await Stock.find();
  symbols = [];
  stocks.forEach(stock => symbols.push(stock.symbol));
  res.locals.symbols = symbols;
  next();
};

exports.getApiData = async (req, res, next) => {
  // const symbols = 'baba,amzn,goog,fb';
  const symbols = res.locals.symbols.toString();
  const uri = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=' + symbols + '&types=quote,chart&range=1m&last=10';
  await axios
    .get(uri)
    .then(resp => {
      res.locals.respData = resp.data;
      next();
    })
    .catch(error => {
      console.log(error);
    });
}

exports.renderMain = (req, res) => {
  const data = res.locals.respData;

  let stocks = [];
  let dates = [];
  let datasets = [];
  let colors = ['red', 'lightblue', 'lightgreen', 'yellow', 'orange', 'pink'];

  // this pushes each stock from the main one-block-obj into an array of objs
  for (let key in data) {
    if (!data.hasOwnProperty(key)) continue;

    let stock = data[key];
    stocks.push(stock);
  };
  
  // get the dates from the first stock
  stocks[0].chart.forEach(day => dates.push(day.date));
  dates = JSON.stringify(dates);

  // create a dataset for each stock with label, values and color
  stocks.forEach(stock => {
    let obj = new Object();
    
    obj.label = stock.quote.symbol
    let arr = [];
    stock.chart.forEach(day => arr.push(day.close));
    obj.data = arr;
    obj.borderColor = colors[stocks.indexOf(stock)];
    
    datasets.push(obj);
  });
  // this prevents the pug to render datasets like '[Object object]' (yay!)
  datasets = JSON.stringify(datasets);

  res.render('main', { title: 'Main Page', dates, stocks: data, datasets });
}

exports.addStock = async (req, res) => {
  const symbol = await (new Stock({ symbol: req.body.newStock })).save();
  res.redirect('back');
};