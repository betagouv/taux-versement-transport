Ce dépot permet de scrapper le widget de l'URSSAF (ou plus exactement son "API") donnant les taux de versement transport par commune :
https://www.urssaf.fr/portail/home/taux-et-baremes/versement-transport.html

L'URSSAF met à disposition la table des taux à l'adresse : https://fichierdirect.declaration.urssaf.fr/TablesReference.htm

...MAIS : 
- l'historique n'y est pas
- les taux additionnels y sont tous à 0, ce qui rend les données erronées. 

L'URSSAF a été auparavant contactée plusieurs fois à ce sujet par plusieurs moyens différents, sans réponse.

Ce travail a été fait suite à plusieurs remarques des utilisateurs du simulateur de coût d'embauche, signalant le caractère osbolète des taux de versement transport d'OpenFisca. 





Les données à jour de la poste (laposte_hexasmal.csv) sur les codes commune / postal sont utilisés pour récupérer les taux de versement transport (collect.js).  
Le fichier final est ensuite formé par transformToYaml.js.

Il est disponible ici : https://github.com/openfisca/openfisca-france/blob/master/openfisca_france/assets/versement_transport/taux.json
