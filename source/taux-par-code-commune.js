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
exports.handler = async (event, context) => {
	let { codeCommune } = event.queryStringParameters;
	let row = findRow(codeCommune);
	let [, , tauxAOT, tauxSMT] = row;
	return {
		statusCode: 200,
		headers: {
			"Content-Type": "application/json;charset=utf-8",

			"Access-Control-Allow-Origin": "*"
		},
		body: JSON.stringify({
			taux: (
				(Number(tauxAOT) + Number(tauxSMT)) /
				100
			).toFixed(4)
		})
	};
};
