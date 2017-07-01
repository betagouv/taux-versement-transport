var fs = require('fs');
require('isomorphic-fetch')
yaml = require('js-yaml');
const rateLimit = require('promise-rate-limit');

var codesPostaux = fs.readFileSync(process.argv[2], 'utf8').split('\n')
codesPostaux.pop()
console.log(codesPostaux)
var url = "https://www.urssaf.fr/portail/cms/render/live/fr/sites/urssaf/home/taux-et-baremes/versement-transport/middleColumn/versementtransport.calculVTAction.do?typeCode=isCodePostal&code="

const getget = codePostal => {
	console.log('fetching ' + codePostal)
	return fetch(url + codePostal, {
	  method: 'POST',
	  body: {
			typeCode: "isCodePostal",
			code: codePostal
		},
		headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
			'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.124 Safari/537.36"
	  },
	})
		.then(response => response.json())
}

Promise.all(codesPostaux.map(rateLimit(30,60*1000,getget))).then(results => {
	var valid = results
		.filter(r => r.resultat.length > 2)
		.map(r => JSON.parse(r.resultat))
		.reduce((acc, next) => acc.concat(next))


fs.writeFileSync('./resultats/' + process.argv[2] + '.json', JSON.stringify(valid));
})
