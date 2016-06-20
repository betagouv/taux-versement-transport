let fs = require('fs');
yaml = require('js-yaml');

//input files are split
let suffixes = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
// suffixes = ['a']
let list =
	suffixes
		.map(s => fs.readFileSync('resultats/splita' + s + '.json', 'utf8'))
		.map(s => JSON.parse(s)).reduce((acc, n) => acc.concat(n), [])

let codes = fs.readFileSync('laposte_hexasmal.csv', 'utf8').split('\n')
codes.pop()

let fromFrenchNumber = string => string.replace(',', '.')
let replaceCommas = string => string && string.replace(/,/g, " - ")
let transformDate = string => string.split('/').reverse().join('-')
let acc = {}
codes.forEach(string => {
	let split = string.split(';'),
		codeCommuneLaposte = split[0],
		nomLaposte = split[1],
		codePostal = split[2],
		found = list.find(({codeCommune}) => codeCommuneLaposte === codeCommune)
		if (!found) {
			// Include some info anyway
			// acc[codeCommuneLaposte] = {
			// 		nomLaposte,
			// 		codePostal
			// }
			return
		}

		let {
			codeCommune, libelleCommune,
			tauxEnCours, tauxAdditionnelEnCours,
			beneficiaireCourant, beneficiaireTauxAdditionnelCourant,
			historique, tauxAdditionnelHistorique
		} = found

		let tauxAdditionnel = {}
		if (tauxAdditionnelHistorique && tauxAdditionnelHistorique.find(etat => etat.taux != 0)) {
			tauxAdditionnelHistorique.forEach(etat =>
				tauxAdditionnel[transformDate(etat.debut)] = fromFrenchNumber(etat.taux))
		}
		if (typeof tauxAdditionnelEnCours === 'object'){
			tauxAdditionnel[transformDate(tauxAdditionnelEnCours.debut)] = fromFrenchNumber(tauxAdditionnelEnCours.taux)
		}

		let taux = {}
		if (historique && historique.find(etat => etat.taux != 0)) {
			historique.forEach(etat =>
				taux[transformDate(etat.debut)] = fromFrenchNumber(etat.taux))
		}
		if (typeof tauxEnCours === 'object'){
			taux[transformDate(tauxEnCours.debut)] = fromFrenchNumber(tauxEnCours.taux)
		}

		acc[codeCommune] = {
				codePostal,
				nomLaposte,
				nomAcoss: libelleCommune
		}
		if (Object.keys(taux).length)
			acc[codeCommune].aot = {
					nom: beneficiaireCourant,
					taux
			}
		if (Object.keys(tauxAdditionnel).length)
				acc[codeCommune].smt = {
					nom: beneficiaireTauxAdditionnelCourant,
					taux: tauxAdditionnel
				}
})

let y = yaml.dump(acc)
console.log(y)
