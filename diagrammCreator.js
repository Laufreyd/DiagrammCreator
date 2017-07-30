/**
* Fonction à appeler qui générera le diagramme circulaire de taille de 500 par 500
* La fonction nécessite au préalable une balise dite 'conteneur' avec
* l'id "DiagrammeCirculaire" qui contiendra le diagramme
*
* @param resultsArray{ Object }: Objet à deux dimensions qui contient l'intitulé
*             du résultat ainsi que son résultat
*             exemple: { 'argument1':55, 'argument2':612, 'argument3':15}
*/
function circularDiagramm(resultsArray){

  //On vérifie la validité de l'argument de resultsArray
  if(typeof(resultsArray) == "object"){

    //Initialisation des données utilisés à l'avenir
    var coordonneesCenterDiagramm = [250, 250], rayonDiagramm = 250;

    //Initialisation du conteneur du diagramme
    var container = document.getElementById('DiagrammeCirculaire');

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', 500);
    svg.setAttribute('height', 500);

    svg = generateSVGBody(resultsArray, svg, coordonneesCenterDiagramm, rayonDiagramm);

    container.appendChild(svg);
  }
  else{
    console.error("Les résultats ne sont pas sous forme d'objet");
  }
}

/**
* Fonction qui générera le contenu de la balise "svg" qui est le diagramme
*
* @param resultsArray{ Object }: Contient les résultats du diagramme
* @param svg{ Object }: Balise HTML qui contiendra le diagramme
* @param coordonneesCenterDiagramm{ Object }: Contient les coordonnées du centre du diagramme
* @param rayonDiagramm{ Number }: Contient le rayon du diagramme
*
* @return svg{ Object }: Balise HTML qui contiendra le diagramme
*/
function generateSVGBody(resultsArray, svg, coordonneesCenterDiagramm, rayonDiagramm){

  //Tableau qui contient le pourcent du résultat
  resultsInPercent = calculatePercent(resultsArray);

  //Tableau de coordonnées des points
  coordonneesPoints = calculateCoordonnesPoints(coordonneesCenterDiagramm, rayonDiagramm, resultsInPercent);

  //Balise svg
  svg = createPaths(svg, coordonneesPoints, coordonneesCenterDiagramm, resultsInPercent, rayonDiagramm);

  return svg;
}

/**
* Fonction qui permet de calculer les pourcentages des résultats
*
* @param resultsArray{ Object }: Contient les résultats
*
* @return resultsPercentArray{ Object }: Contient les résultats en pourcentage
*/
function calculatePercent(resultsArray){

  var totalResults = 0; resultsPercentArray = [];

  //Calcule le total des résultats
  for(variableAvancement in resultsArray){
    totalResults += resultsArray[variableAvancement];
  }

  //Calcule les pourcentages des résultats
  for(variableAvancement in resultsArray){
    resultsPercentArray[variableAvancement] = Math.round((resultsArray[variableAvancement] * 100 / totalResults) * 10) / 10;
  }

  return resultsPercentArray;
}


/**
* Fonction qui calcule les coordonnées de tout les points utilisé à l'avenir
*
* @param coordonneesCenterDiagramm{ Object }: Contient les coordonnées du centre du diagramme
* @param rayonDiagramm{ Number }: Contient le rayon du diagramme
* @param resultsInPercent{ Object }: Contient les pourcentages des résultats
*
* @return coordonneesPoints{ Object }: Contient les coordonnées de tous les points utilisés à l'avenir
*/
function calculateCoordonnesPoints(coordonneesCenterDiagramm, rayonDiagramm, resultsInPercent){

  var pourcentAvancement = 0,coordonneesPoints = [];

  //Calcul des coordonnées de chacun des points
  for(variableAvancement in resultsInPercent){

    //Initialisation du tableau des coordonnées
    coordonneesPoints[variableAvancement] = [];
    coordonneesPoints[variableAvancement][0] = Math.cos((pourcentAvancement * 3.6) * (Math.PI /180)) * rayonDiagramm + coordonneesCenterDiagramm[0];
    coordonneesPoints[variableAvancement][1] = Math.abs(Math.sin((pourcentAvancement * 3.6) * (Math.PI /180)) * rayonDiagramm - coordonneesCenterDiagramm[1]);

    pourcentAvancement += resultsInPercent[variableAvancement];
  }

  return coordonneesPoints;
}

/**
* Fonction qui génère les balises "paths", qui forment les parties du diagramme,
*   et qui sont ensuite ajouter à la balise "svg"
*
* @param svg{ Object }: Balise HTML qui contiendra le diagramme
* @param coordonneesPoints{ Object }: Contient les coordonnees des points
* @param coordonneesCenterDiagramm{ Object }: Contient les coordonnées du centre du diagramme
* @param resultsInPercent{ Object }: Contient les pourcentages des résultats
* @param rayonDiagramm{ Number }: Contient le rayon du diagramme
*
* @return svg{ Object }: Balise HTML qui contiendra le diagramme
*/
function createPaths(svg, coordonneesPoints, coordonneesCenterDiagramm, resultsInPercent, rayonDiagramm){

  //Initialisation des constantes
  var center = "M" + coordonneesCenterDiagramm[0] + "," + coordonneesCenterDiagramm[1];
  var arc = "A" + coordonneesCenterDiagramm[0] + "," + coordonneesCenterDiagramm[1] + " 0 ";
  var firstPoint, lastPoint, pathString, arcSpecification;
  var taille = Object.keys(coordonneesPoints).length - 1; //Nombre de résultat
  var keys = Object.keys(resultsInPercent); //Tableau contenant les clés
  var values = Object.values(resultsInPercent); //Tableau contenant les pourcentages

  //Si il n'ya pas de résultat qui vaut 100%
  if(!values.includes(100)){

    //Pour chacun des points, on créer le "path"
    for(variable in coordonneesPoints){

      //Si le pourcentage n'est pas nul
      if(resultsInPercent[variable] != 0){

        //Initialise la balise "path"
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        //Création du premier point
        var firstPoint = "L" + coordonneesPoints[variable][0] + "," + coordonneesPoints[variable][1];

        //Modification de l'arc en fonction du résultat supérieur à 50% ou non
        if(resultsInPercent[variable] > 50){ arcSpecification = "1,0 "; }
        else{ arcSpecification = "0,0 "; }

        //Création du dernier point
        if(keys.indexOf(variable) != taille){
          lastPoint = coordonneesPoints[keys[keys.indexOf(variable)+1]][0] + "," + coordonneesPoints[keys[keys.indexOf(variable)+1]][1];
        }
        else{
          lastPoint = coordonneesPoints[keys[0]][0] + "," + coordonneesPoints[keys[0]][1];
        }

        pathString = center + firstPoint + arc + arcSpecification + lastPoint + " z";

        path.setAttribute('d', pathString);
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', 1);

        svg.appendChild(path);
      }
    }

  }
  //Si le résultat est de 100%
  else{
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute('cx', coordonneesCenterDiagramm[0]);
    circle.setAttribute('cy', coordonneesCenterDiagramm[1]);
    circle.setAttribute('r', rayonDiagramm);

    svg.appendChild(circle);
  }

  return svg;
}
