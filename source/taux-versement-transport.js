import yaml from "js-yaml";

import fs from "fs";
import Papa from "papaparse";
let file = "source/taux-versement-transport.csv";
let content = fs.readFileSync(file, "utf8");

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
	return {
		statusCode: 200,
		headers: {
			"Content-Type": "application/json;charset=utf-8",

			"Access-Control-Allow-Origin": "*"
		},
		body: JSON.stringify({
			taux: rows.find(row => row[0] === `'${codeCommune}'`)[2]
		})
	};
};
