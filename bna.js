const dateFormat  = require('dateformat');
const got         = require('got');
const { JSDOM }   = require('jsdom');
const querystring = require('querystring');


async function getRate() {
  const date = dateFormat(new Date(), 'dd/mm/yyyy');

  const query = {
    fecha:       date,
    filtroDolar: 1,
    filtroEuro:  0,
    id:          'billetes'
  };

  const response = await got('http://www.bna.com.ar/Cotizador/HistoricoPrincipales', {
    query:   querystring.stringify(query),
    headers: {
      'Accept':           '*/*',
      'Referer':          'http://www.bna.com.ar/',
      'User-Agent':       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/11.0.1 Safari/604.3.5',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  if (response.statusCode === 200) {
    const dom                   = new JSDOM(response.body);
    const [ buyCell, sellCell ] = dom.window.document.querySelectorAll('#tablaDolar td.dest');
    const buy                   = getFloatValueFromCell(buyCell);
    const sell                  = getFloatValueFromCell(sellCell);
    return { buy, sell };
  } else
    throw new Error(`BNA: ${response.statusCode}`);
}


function getFloatValueFromCell(cell) {
  return parseFloat(cell.textContent.replace(/,/g, '.'));
}


module.exports = {
  getRate
};
