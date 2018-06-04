const bna = require('./bna');


module.exports = async() => {
  const { buy, sell } = await bna.getRate();

  return { buy, sell };
};
