var resultsArray = {
  'Martine':12,
  'Louise':25,
  'test':75
}

function circularDiagramm(resultsArray){
  if(typeof(resultsArray) == "object"){

    var coordonneesCenterDiagramm = [250, 250], rayonDiagramm = 250;

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

function generateSVGBody(resultsArray, svg, coordonneesCenterDiagramm, rayonDiagramm){
  var totalResults = 0;

  for(variableAvancement in resultsArray){
    totalResults += resultsArray[variableAvancement];
  }

  coordonneesPoints = calculateCoordonnesPoints(resultsArray, coordonneesCenterDiagramm, rayonDiagramm, totalResults);

  svg = createPaths(svg, coordonneesPoints, coordonneesCenterDiagramm, resultsArray, totalResults);

  return svg;
}

function calculateCoordonnesPoints(resultsArray, coordonneesCenterDiagramm, rayonDiagramm, totalResults){
  var pourcentAvancement = 0,coordonneesPoints = [];

  for(variableAvancement in resultsArray){
    coordonneesPoints[variableAvancement] = [];
    coordonneesPoints[variableAvancement][0] = Math.cos((pourcentAvancement * 3.6) * (Math.PI / 180)) * rayonDiagramm + coordonneesCenterDiagramm[0];
    coordonneesPoints[variableAvancement][1] = Math.abs(Math.sin((pourcentAvancement * 3.6) * (Math.PI / 180)) * rayonDiagramm - coordonneesCenterDiagramm[1]);

    pourcentAvancement += resultsArray[variableAvancement] * 100 / totalResults;
  }

  return coordonneesPoints;
}

function createPaths(svg, coordonneesPoints, coordonneesCenterDiagramm, resultsArray, totalResults){

  var center = "M" + coordonneesCenterDiagramm[0] + "," + coordonneesCenterDiagramm[1];
  var firstPoint, lastPoint, pathString = "";
  var taille = Object.keys(coordonneesPoints).length - 1;
  var keys = Object.keys(resultsArray);

  for(variable in coordonneesPoints){
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var arc = "A" + coordonneesCenterDiagramm[0] + "," + coordonneesCenterDiagramm[1];

    var firstPoint = "L" + coordonneesPoints[variable][0] + "," + coordonneesPoints[variable][1];

    if(resultsArray[variable] > (totalResults / 2)){
      arc += " 0 1,0 "
    }

    else{
      arc += " 0 0,0 ";
    }

    if(keys.indexOf(variable) != taille){
      lastPoint = coordonneesPoints[keys[keys.indexOf(variable)+1]][0] + "," + coordonneesPoints[keys[keys.indexOf(variable)+1]][1];
    }
    else{
      lastPoint = coordonneesPoints[keys[0]][0] + "," + coordonneesPoints[keys[0]][1];
    }

    pathString = center + firstPoint + arc + lastPoint + " z";

    path.setAttribute('d', pathString);
    path.setAttribute('stroke', '#ffffff');
    path.setAttribute('stroke-width', 1);

    svg.appendChild(path);
  }
  return svg;
}
