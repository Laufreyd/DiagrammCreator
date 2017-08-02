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

  //Ajout la balise svg
  container.appendChild(svg);
}

/**
* Fonction qui générera la balise svg et son contenu
*
* @param resultsArray{Object} : Contient les résultats du diagramme
* @param globalInfoDiagramm{Array} : Contient les informations globales(diagramme, balise,...)
*
* @return svg{Object} : Balise HTML qui contiendra le diagramme
*/
function generateSVG(resultsArray, globalInfoDiagramm){

  //Tableau des couleurs
  coloursResults = generateColours();

  //Initialisation des données utilisés à l'avenir
  infoDiagramm = generateInfoDiagramm(globalInfoDiagramm);

  //Création de la balise 'svg'
  svg = generateSVGTag(globalInfoDiagramm);

  //Tableau qui contient le pourcent du résultat
  resultsInPercent = calculatePercent(resultsArray);

  //Tableau de coordonnées des points
  coordonneesPoints = calculateCoordonnesPoints(infoDiagramm, resultsInPercent);

  //Génère le fond du diagramme
  svg = generateBackGround(svg, globalInfoDiagramm);

  //Génère les titres des résultats
  svg = generateTitleResults(svg, resultsInPercent, infoDiagramm, coloursResults);

  //Coeur de la balise svg
  svg = generateSVGBody(svg, coordonneesPoints, infoDiagramm, resultsInPercent, coloursResults);

  return svg;
}

/**
* Fonction qui génère le tableau des couleurs
*
* @return coloursResults{Array} : Tableau contenant les couleurs
*/
function generateColours(){
  var coloursResults = ['#FF0000', '#00FF00','#0000FF', '#39002D', '#FE5500'
                      , '#00FFFF', '#4C1B1B', '#002F2F', '#FFFF00', '#000000'];

  return coloursResults;
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

  //Calcule, dans l'ordre, le centre X, le centre Y et le rayon
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

    resultsPercentArray[variableAvancement] = resultsInPercentRound;

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

    if(resultsInPercent[variableAvancement] != 0){

      //Initialisation du tableau des coordonnées
      coordonneesPoints[variableAvancement] = [];

      degresAvancement = (pourcentAvancement * 3.6) * (Math.PI / 180);

      coordonneesPoints[variableAvancement][0] = Math.cos(degresAvancement) * infoDiagramm[2] + infoDiagramm[0];
      coordonneesPoints[variableAvancement][1] = Math.abs(Math.sin(degresAvancement) * infoDiagramm[2] - infoDiagramm[1]);

      pourcentAvancement += resultsInPercent[variableAvancement];
    }
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

  //Créé la balise 'rect'
  var background = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

  //On donne des attributs au fond
  background.setAttribute('x', 0);
  background.setAttribute('y', 0);
  background.setAttribute('width', globalInfoDiagramm[0]);
  background.setAttribute('height', globalInfoDiagramm[1]);
  background.setAttribute('style', 'fill:white;');

  //Ajout du fond à la balise 'svg'
  svg.appendChild(background);

  return svg;
}

/**
* Fonction qui génère les titres des résultats sur le côté du diagramme
*
* @param svg{Object} : Balise HTML qui contiendra le diagramme
* @param resultsInPercent{Object} : Contient les pourcentages des résultats
* @param infoDiagramm{Object} : Contient les informations du diagramme
* @param coloursResults{Array} : Tableau contenant les couleurs
*
* @return svg{Object} : Balise HTML qui contiendra le diagramme
*/
function generateTitleResults(svg, resultsInPercent, infoDiagramm, coloursResults){

  //Récupération des titres
  var keys = Object.keys(resultsInPercent);
  var halfSize = Math.floor(keys.length / 2) * 20;

  //Création de la balise groupante
  var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  for(variable in keys){
    //Création de la balise sous-groupante
    var gSecond = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    //Variable de positionnement des éléments
    var widthPosition = 2 * infoDiagramm[0] + infoDiagramm[2];
    var heightPosition = infoDiagramm[1] + variable * 20 - halfSize;

    //Création de la balise de texte
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    //Ajout des attributs au texte
    text.setAttribute('x', widthPosition);
    text.setAttribute('y', heightPosition);

    //Ajout du texte
    text.appendChild(document.createTextNode(keys[variable]));

    //Création du cercle
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    //Positionnement et ajout des caractéristiques du cercle
    circle.setAttribute('cx', widthPosition - 10); //10 = espace pour laisser le cercle + espace
    circle.setAttribute('cy', heightPosition - 4); //4 = 16 - 12 (taille écriture - diamètre)
    circle.setAttribute('r', 6);
    circle.setAttribute('style', 'fill:' + coloursResults[variable] + ';');

    //Ajout du circle et du texte
    gSecond.appendChild(circle);
    gSecond.appendChild(text);

    //Ajout à la balise groupante principale
    g.appendChild(gSecond);
  }
  //Ajout à la balise svg
  svg.appendChild(g);

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
* @param coloursResults{Array} : Tableau contenant les couleurs
*
* @return svg{Object} : Balise HTML qui contiendra le diagramme
*/
function generateSVGBody(svg, coordonneesPoints, infoDiagramm, resultsInPercent, coloursResults){

  //Si aucun résultat ne correspond à 100%
  if(!Object.values(resultsInPercent).includes(100)){
    //Appelle la fonction qui crééra les "paths"
    svg = generatePaths(svg, coordonneesPoints, infoDiagramm, resultsInPercent, coloursResults);
  }
  else{
    //Appelle la fonction qui crééra le cercle
    svg = generateCircle(svg, infoDiagramm, coloursResults[0]);
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
* @param coloursResults{Array} : Tableau contenant les couleurs
*
* @return svg{Object} : Balise HTML qui contient le diagramme
*/
function generatePaths(svg, coordonneesPoints, infoDiagramm, resultsInPercent, coloursResults){

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
      path.setAttribute('style', 'fill:' + coloursResults[keys.indexOf(variable)] + ';');

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
* @param color{String} : Contient la couleur
*
* @return svg{Object} : Balise HTML qui contiendra le diagramme
*/
function generateCircle(svg, infoDiagramm, color){

  //Initialise le cercle
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  circle.setAttribute('cx', infoDiagramm[0]);
  circle.setAttribute('cy', infoDiagramm[1]);
  circle.setAttribute('r', infoDiagramm[2]);
  circle.setAttribute('style', 'fill:' + color + ';');

  //Ajout du cercle dans la balise "svg"
  svg.appendChild(circle);

  return svg;
}
