var resultsArray = {
  'Martine':33,
  'Louise':10,
  'Cerbère':33
}

//Fonction qui génère un diagramme circulaire automatiquement
function circularDiagramm(resultsArray){
  if(typeof(resultsArray) == "object"){

    var coordonneesCenterDiagramm = [250, 250], rayonDiagramm = 250;

    coordonneesPointArray = calculateCoordonnesPoints(resultsArray, coordonneesCenterDiagramm, rayonDiagramm);

    var container = document.getElementById('DiagrammeCirculaire');

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', 500);
    svg.setAttribute('height', 500);

    svg = createPaths(svg, coordonneesPointArray, coordonneesCenterDiagramm);

    container.appendChild(svg);
  }
  else{
    console.error("Les résultats ne sont pas sous forme d'objet");
  }
}

function calculateCoordonnesPoints(resultsArray, coordonneesCenterDiagramm, rayonDiagramm){
  var pourcentAvancement = 0,position = 0, coordonneesPoints = [];

  for(variableAvancement in resultsArray){
    coordonneesPoints[position] = [];
    coordonneesPoints[position][0] = Math.cos((pourcentAvancement * 3.6) * (Math.PI / 180)) * rayonDiagramm + coordonneesCenterDiagramm[0];
    coordonneesPoints[position][1] = Math.abs(Math.sin((pourcentAvancement * 3.6) * (Math.PI / 180)) * rayonDiagramm - coordonneesCenterDiagramm[1]);

    position++;
    pourcentAvancement += resultsArray[variableAvancement];
  }
  return coordonneesPoints;
}

function createPaths(svg, coordonneesPoints, coordonneesCenterDiagramm){
  var center = "M" + coordonneesCenterDiagramm[0] + "," + coordonneesCenterDiagramm[1];
  var arc = "A" + coordonneesCenterDiagramm[0] + "," + coordonneesCenterDiagramm[1] + " 0 0,0 ";
  var longueur = coordonneesPoints.length - 1, firstPoint, lastPoint, pathString = "";

  for(variable in coordonneesPoints){
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    var firstPoint = "L" + coordonneesPoints[variable][0] + "," + coordonneesPoints[variable][1];

    if(parseInt(variable) != longueur){
      lastPoint = coordonneesPoints[parseInt(variable)+1][0] + "," + coordonneesPoints[parseInt(variable)+1][1];
    }
    else{
      lastPoint = coordonneesPoints[0][0] + "," + coordonneesPoints[0][1];
    }

    pathString = center + firstPoint + arc + lastPoint + " z";

    path.setAttribute('d', pathString);
    path.setAttribute('stroke', '#ffffff');
    path.setAttribute('stroke-width', 1);

    svg.appendChild(path);
  }
  return svg;
}
