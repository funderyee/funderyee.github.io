$(document).ready(function () {
    let fond = $(".fond"); 
    let originalSrc = fond.attr("src"); // Sauvegarde la source originale du GIF

    $("#interraction").hover(
        function () {
            // Remplace l'image animée par une version statique
            fond.attr("src", "src/img/Notsosimple_static.png");
        },
        function () {
            // Remet l'image animée
            fond.attr("src", originalSrc);
        }
    );
});

