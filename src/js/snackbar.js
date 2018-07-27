
function showSnack(strMessage) {
    var x = document.getElementById("snackbar");
    x.innerHTML = strMessage
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
