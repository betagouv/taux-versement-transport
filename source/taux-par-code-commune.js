import Papa from "papaparse";
import content from "./taux-versement-transport-data.js";

// This code is far from good, please do not hesitate to refactor it fully

let findRow = codeCommune => rows.find(row => row[0] === `'${codeCommune}'`);

let rows;
Papa.parse(content, {
  header: false,
  delimiter: ";",
  complete: function(results) {
    //console.log("Finished:", results.data);
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

  let row = findRow(codeCommune);
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
