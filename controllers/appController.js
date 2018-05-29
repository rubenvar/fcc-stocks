const axios = require('axios');

exports.renderMain = async (req, res) => {
  const symbols = 'aapl,fb,msft';
  const uri = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=' + symbols + '&types=quote,chart&range=1m&last=10';
  let theData;
  await axios
    .get(uri)
    .then(resp => {
      theData = resp.data;
    }).catch(error => {
      console.log(error);
    });
    res.json(theData);
  // res.render('main', { title: 'Main Page' });
}