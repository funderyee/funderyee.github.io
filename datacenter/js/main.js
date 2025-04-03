
// DOCUMENT READY
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("ready");
    //
    // scroll à la position par défaut (ici on veut centrer)
    const $mapWrapper = document.getElementById('map-wrapper');
    const $map = document.getElementById('map');
    const mapWidth = $map.getBoundingClientRect().width;
    const mapHeight = $map.getBoundingClientRect().height;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    // on calcule la position pour avoir le centre de la carte au centre de l'écran
    let centerX = (mapWidth / 2) - (screenWidth/2);
    let centerY = (mapHeight / 2) - (screenHeight/2);
    // on scroll vers la position calculée
    $mapWrapper.scrollTo(centerX, centerY);
    //
    //
    // navigation dans la carte
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    // début (souris enfoncée)
    $mapWrapper.addEventListener('mousedown', (event) => {
        console.log('souris pressée');
        isDragging = true;
        startX = event.pageX - $mapWrapper.offsetLeft;
        startY = event.pageY - $mapWrapper.offsetTop;
        scrollLeft = $mapWrapper.scrollLeft;
        scrollTop = $mapWrapper.scrollTop;
        /**/
        $mapWrapper.style.cursor = "grabbing";
    });
    // mouvement (souris déplacée)
    $mapWrapper.addEventListener('mousemove', (event) => {
        if (!isDragging){ 
            return 
        } else {
            console.log('souris pressée et bouge');
            event.preventDefault();
            const x = event.pageX - $mapWrapper.offsetLeft;
            const y = event.pageY - $mapWrapper.offsetTop;
            $mapWrapper.scrollLeft = scrollLeft - (x - startX);
            $mapWrapper.scrollTop = scrollTop - (y - startY);
        }
      });
    // arrêt (souris relachée)
    $mapWrapper.addEventListener('mouseup', () => {
        console.log('souris relachée');
        isDragging = false;
        /**/
        $mapWrapper.style.cursor = "grab";
    });
});