import Papa from "papaparse";
import content from "./taux-versement-transport-data.js";
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
