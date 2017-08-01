/**
* Fonction à appeler qui générera le diagramme circulaire de taille de 500 par 500
* La fonction nécessite au préalable une balise dite 'conteneur' avec
* l'id "DiagrammeCirculaire" qui contiendra le diagramme
*
* @param resultsArray{Object} : Objet à deux dimensions qui contient l'intitulé
*             du résultat ainsi que son résultat
*             exemple: { 'argument1':55, 'argument2':612, 'argument3':15}
* @param width{Number} : Permet de choisir la longueur du diagramme (600 par défaut)
*          -- Argument facultatif --
* @param height{Number} : Permet de choisir la largeur du diagramme (300 par défaut)
*          -- Argument facultatif --
*/
function circularDiagramm(resultsArray, width = 600, height = 300){

  //On vérifie la validité de l'argument de resultsArray
  if(typeof(resultsArray) == "object"){

    //Attend que la page soit bien chargé
    window.onload = function(){

      //Gère l'initialisation et la finalisation
      generateCircularDiagramm(resultsArray, [width, height]);
    }
  }
  else{
    console.error("Les résultats ne sont pas sous forme d'objet");
  }
}

/**
* Fonction qui gère l'initialisation et la finalisation
*
* @param resultsArray{Object} : Contient les résultats
* @param globalInfoDiagramm{Array} : Contient les informations globales(diagramme, balise,...)
*/
function generateCircularDiagramm(resultsArray, globalInfoDiagramm){

  //Initialisation du conteneur du diagramme
  var container = document.getElementById('DiagrammeCirculaire');

  //Gère l'appel aux différentes fonctions
  svg = generateSVG(resultsArray, globalInfoDiagramm);

  container.appendChild(svg);
}

/**
* Fonction qui générera la balise svg et son contenu
*
* @param resultsArray{Object} : Contient les résultats du diagramme
* @param infoDiagramm{Object} : Contient les informations du diagramme
*
* @return svg{Object} : Balise HTML qui contiendra le diagramme
*/
function generateSVG(resultsArray, globalInfoDiagramm){

  //Initialisation des données utilisés à l'avenir
  var infoDiagramm = generateInfoDiagramm(globalInfoDiagramm);

  //Création de la balise 'svg'
  svg = generateSVGTag(globalInfoDiagramm);

  //Tableau qui contient le pourcent du résultat
  resultsInPercent = calculatePercent(resultsArray);

  //Tableau de coordonnées des points
  coordonneesPoints = calculateCoordonnesPoints(infoDiagramm, resultsInPercent);

  //Génère le fond du diagramme
  svg = generateBackGround(svg, globalInfoDiagramm);

  //Coeur de la balise svg
  svg = generateSVGBody(svg, coordonneesPoints, infoDiagramm, resultsInPercent);

  return svg;
}

/**
* Fonction qui calcule les les informations sur le diagramme
*
* @param globalInfoDiagramm{Array} : Contient les informations globales(diagramme, balise,...)
*
* @return infoDiagramm{Array} : Contient les informations du diagrammes
*/
function generateInfoDiagramm(globalInfoDiagramm){
  var infoDiagramm = [];

  infoDiagramm[0] = globalInfoDiagramm[0] / 4;
  infoDiagramm[1] = globalInfoDiagramm[1] / 2;
  infoDiagramm[2] = Math.min(...infoDiagramm) / 1.5;

  return infoDiagramm;
}

/**
* Fonction qui gère la création de la balise svg
*
* @param globalInfoDiagramm{Array} : Contient les informations globales(diagramme, balise,...)
*
* @return svg{Object} : Contient la balise svg
*/
function generateSVGTag(globalInfoDiagramm){

  //Création de la balise svg
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  //Initialisation des attributs
  svg.setAttribute('width', globalInfoDiagramm[0]);
  svg.setAttribute('height', globalInfoDiagramm[1]);

  return svg;
}

/**
* Fonction qui permet de calculer les pourcentages des résultats
*
* @param resultsArray{Object} : Contient les résultats
*
* @return resultsPercentArray{Object} : Contient les résultats en pourcentage non nul
*/
function calculatePercent(resultsArray){

  var totalResults = 0; resultsPercentArray = [];

  //Calcule le total des résultats
  for(variableAvancement in resultsArray){
    totalResults += resultsArray[variableAvancement];
  }

  //Calcule les pourcentages des résultats, arrondi au dixième près
  for(variableAvancement in resultsArray){

    //Calcule du pourcentage puis inseretion à l'arrondi 10^-1 près
    resultInPercent = resultsArray[variableAvancement] * 100 / totalResults;
    resultsInPercentRound = Math.round(resultInPercent * 10) / 10;

    //Si le résultats n'est pas nul arrondi à 10^-1 près
    if(resultsInPercentRound != 0){
      resultsPercentArray[variableAvancement] = resultsInPercentRound;
    }

  }

  //Classe le pourcentages par ordre croissant
  resultsPercentArray = orderedResults(resultsPercentArray);

  return resultsPercentArray;
}

/**
* Fonction qui classe les résultats par ordre croissant
*
* @param resultsPercentArray{Object} : Contient les résultats à trier
*
* @return orderedResultsPercent{Object} : Contient les résultats trier par ordre croissant
*/
function orderedResults(resultsPercentArray){

  var orderedResultsPercent = [];
  var valuesResultsPercent = Object.values(resultsPercentArray); //Tableau des valeurs
  var keysResults = Object.keys(resultsPercentArray); //Tableau des clés

  //Pour chaque élément de l'objet, va trier par ordre croissant
  for (variableAvancement in resultsPercentArray){

    //On prend le minimum ainsi que son index
    minimumFound = Math.min(...valuesResultsPercent);
    indexOfMinimumFound = valuesResultsPercent.indexOf(minimumFound);

    //On l'insère dans le tableau final puis on enlève des autres
    orderedResultsPercent[keysResults[indexOfMinimumFound]] = minimumFound;
    valuesResultsPercent.splice(indexOfMinimumFound, 1);
    keysResults.splice(indexOfMinimumFound ,1);

  }
  //Renvoie le tableau trié
  return orderedResultsPercent;
}


/**
* Fonction qui calcule les coordonnées de tout les points utilisé à l'avenir
*
* @param infoDiagramm{Object} : Contient les informations du diagramme
* @param resultsInPercent{Object} : Contient les pourcentages des résultats
*
* @return coordonneesPoints{Object} : Contient les coordonnées de tous les points utilisés à l'avenir
*/
function calculateCoordonnesPoints(infoDiagramm, resultsInPercent){

  var pourcentAvancement = 0,coordonneesPoints = [];

  //Calcul des coordonnées de chacun des points
  for(variableAvancement in resultsInPercent){

    //Initialisation du tableau des coordonnées
    coordonneesPoints[variableAvancement] = [];

    degresAvancement = (pourcentAvancement * 3.6) * (Math.PI / 180);

    coordonneesPoints[variableAvancement][0] = Math.cos(degresAvancement) * infoDiagramm[2] + infoDiagramm[0];
    coordonneesPoints[variableAvancement][1] = Math.abs(Math.sin(degresAvancement) * infoDiagramm[2] - infoDiagramm[1]);

    pourcentAvancement += resultsInPercent[variableAvancement];
  }

  return coordonneesPoints;
}

/**
* Fonction qui génère un rectangle qui servira de fond au diagramme
*
* @param svg{Object} : Balise HTML qui contiendra le diagramme
* @param globalInfoDiagramm{Array} : Contient les informations globales(diagramme, balise,...)
*
* @return svg{Object} : Balise HTML qui contiendra le diagramme
*/
function generateBackGround(svg, globalInfoDiagramm){

  var background = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

  background.setAttribute('x', 0);
  background.setAttribute('y', 0);
  background.setAttribute('width', globalInfoDiagramm[0]);
  background.setAttribute('height', globalInfoDiagramm[1]);
  background.setAttribute('style', 'fill:white;');

  svg.appendChild(background);

  return svg;

}

/**
* Fonction qui génère les balises "paths", qui forment les parties du diagramme,
*   et qui sont ensuite ajouter à la balise "svg"
*
* @param svg{Object} : Balise HTML qui contiendra le diagramme
* @param coordonneesPoints{Object} : Contient les coordonnees des points
* @param infoDiagramm{Object} : Contient les informations du diagramme
* @param resultsInPercent{Object} : Contient les pourcentages des résultats
*
* @return svg{Object} : Balise HTML qui contiendra le diagramme
*/
function generateSVGBody(svg, coordonneesPoints, infoDiagramm, resultsInPercent){

  //Si aucun résultat ne correspond à 100%
  if(!Object.values(resultsInPercent).includes(100)){

    //Appelle la fonction qui crééra les "paths"
    svg = generatePaths(svg, coordonneesPoints, infoDiagramm, resultsInPercent);
  }
  else{
    //Appelle la fonction qui crééra le cercle
    svg = generateCircle(svg, infoDiagramm);

  }

  return svg;
}

/**
* Fonction qui génère les "paths"
*
* @param svg{Object} : Balise HTML qui contiendra le diagramme
* @param coordonneesPoints{Object} : Contient les coordonnees des points
* @param infoDiagramm{Object} : Contient les informations du diagramme
* @param resultsInPercent{Object} : Contient les pourcentages des résultats
*
* @return svg{Object} : Balise HTML qui contient le diagramme
*/
function generatePaths(svg, coordonneesPoints, infoDiagramm, resultsInPercent){

  //Initialisation des constantes
  var center = "M" + infoDiagramm[0] + "," + infoDiagramm[1];
  var arc = "A" + infoDiagramm[2] + "," + infoDiagramm[2] + " 0 ";
  var firstPoint, lastPoint, pathString, arcSpecification;
  var keys = Object.keys(coordonneesPoints); //Tableau contenant les clés
  var taille = keys.length - 1; //Nombre de résultat

  //Initialisation de la balise 'g' qui groupe tout les "paths"
  var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  //Pour chacun des points, on créer le "path"
  for(variable in coordonneesPoints){

      //Initialise la balise "path"
      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

      //Création du premier point
      var firstPoint = "L" + coordonneesPoints[variable][0] + "," + coordonneesPoints[variable][1];

      //Création du dernier point
      indexNextPoint = keys[keys.indexOf(variable)+1] || keys[0];
      lastPoint = coordonneesPoints[indexNextPoint][0] + "," + coordonneesPoints[indexNextPoint][1];

      //Modification de l'arc en fonction du résultat supérieur à 50% ou non
      if(resultsInPercent[variable] > 50){ arcSpecification = "1,0 "; }
      else{ arcSpecification = "0,0 "; }

      pathString = center + firstPoint + arc + arcSpecification + lastPoint + " z";

      path.setAttribute('d', pathString);
      path.setAttribute('stroke', '#ffffff');
      path.setAttribute('stroke-width', 1);

      //Ajout du "path" dans le groupe
      g.appendChild(path);
  }

  //Ajout du groupe au diagramme
  svg.appendChild(g);

  return svg;
}

/**
* Fonction qui génère le cercle si un résultat vaut 100%
*
* @param svg{Object} : Balise HTML qui contiendra le diagramme
* @param infoDiagramm{Object} : Contient les informations du diagramme
*
* @return svg{Object} : Balise HTML qui contiendra le diagramme
*/
function generateCircle(svg, infoDiagramm){

  //Initialise le cercle
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  circle.setAttribute('cx', infoDiagramm[0]);
  circle.setAttribute('cy', infoDiagramm[1]);
  circle.setAttribute('r', infoDiagramm[2]);

  //Ajout du cercle dans la balise "svg"
  svg.appendChild(circle);

  return svg;
}
