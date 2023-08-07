function unhide() {
    var hid = document.getElementsByClassName("action");
   
    if(hid[0].offsetWidth > 0 && hid[0].offsetHeight > 0) {
        hid[0].style.visibility = "visible";
    }
    else {
      hid[0].style.visibility = "hidden";
    }
      
}

function unhide1() {
    var hid = document.getElementsByClassName("action1");
   
    if(hid[0].offsetWidth > 0 && hid[0].offsetHeight > 0) {
        hid[0].style.visibility = "visible";
    }
    else {
      hid[0].style.visibility = "hidden";
    }
      
}
 function myFunction() {
            location.reload();
         }