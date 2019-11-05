import Papa from "papaparse";
import content from "./taux-versement-transport-data.js";

// This code is far from good, please do not hesitate to refactor it fully

let findRow = (codeCommune, date) => {
  let sortedByDate = rows
    .filter(row => row[0] === `'${codeCommune}'`)
    // the list can contain future dates
    .filter(row => row[4] < date)
    .sort((a, b) => +b[4] - +a[4]);

  return sortedByDate[0];
};

let rows;
Papa.parse(content, {
  header: false,
  delimiter: ";",
  complete: function(results) {
    rows = results.data;
  }
});

let headers = {
  "Content-Type": "application/json;charset=utf-8",

  "Access-Control-Allow-Origin": "*"
};
exports.handler = async (event, context) => {
  let { codeCommune: rawCode } = event.queryStringParameters,
    // Les données de versement transport n'ont pas d'entrée pour les villes à arrondissement. Or ces taux
    // ne dépendent pas de l'arrondissement. On en choisit donc un au hasard.
    correspondanceArrondissements = {
      "75056": "75120",
      "69300": "69388",
      "13055": "13203"
    },
    codeCommune = correspondanceArrondissements[rawCode] || rawCode;

  const today = new Date(),
    dd = today.getDate(),
    mm = today.getMonth() + 1, //January is 0!
    yyyy = today.getFullYear(),
    date = `${yyyy}${mm}${dd}`;

  let row = findRow(codeCommune, date);
  if (!row)
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: `Aucune donnée de versement transport trouvée pour cette commune de code : ${codeCommune}. Existe-t-elle vraiment ?`
      })
    };
  let [, , tauxAOT, tauxSMT] = row;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      taux: ((Number(tauxAOT) + Number(tauxSMT)) / 100).toFixed(4)
    })
  };
};
