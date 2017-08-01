DiagrammCreator - README File
=============================

### Objectifs du fichier
Le but du fichier est de permettre à l'utilisateur de pouvoir créer un diagramme circulaire, simplement en appelant la fonction adéquate et en fournissant ses résultats.

### Comment utiliser le fichier
1. Télécharger le fichier et l'insérer dans votre projet

    Pour commencer, récupérer au minimum le fichier 'DiagrammCreator.js' inserez-le dans votre projet, au même niveau que votre page HTML où dans dossier sous-jacent (veillez à ne pas le mettre n'importe où, il vous faudra connaître sa position et gardez une certaine cohérence dans son rangement de fichiers permet une meilleure maintenance).

2. Lier le fichier

    Ensuite, il vous faudra lier le fichier 'DiagrammCreator.js' à votre page HTML. Pour cela, dans la balise <head>, adaptez et insérez le code suivant : <script type="text/javascript" src="LE CHEMIN VERS LE FICHIER/DiagrammCreator.js"></script>.

   *Exemple:* Si le fichier se situe au même niveau que votre page HTML, le code sera : <script type="text/javascript" src="DiagrammCreator.js"></script>

3. Utiliser les fonctions

    Enfin, pour générer un diagramme circulaire, depuis un fichier js ou une balise <script>, inserez le code suivant :

    window.onload = function(){

    circularDiagramm(resultsArray);

    }

    La fonction 'circularDiagramm' permet de générer le diagramme circulaire. Elle prend en argument 'resultsArray' qui est un objet contenant les résultats.

    *Exemple de 'resultsArray':* resultsArray = { 'argument1': 10, 'argument2': 15, 'argument3': 20 };

    La fonction peut également prendre deux autres arguments facultatif : 'width' et 'height', qui correspondent respectivement à la longueur et la hauteur qu'aura le conteneur du diagramme.
