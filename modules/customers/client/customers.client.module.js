(function (app) {
  'use strict';
  app.registerModule('customers');
  }(ApplicationConfiguration));


function myFunction() {
    var x = document.getElementById("hide");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}


function pxTree() {
  var customers = JSON.parse(document.getElementById("SOURCE").innerHTML);
  var string = "<px-tree keys=\'{\"id\":\"id\",\"label\":\"label\",\"children\":\"children\"}\'";
  string+="items=\'["
  for(i=0;i<customers.length;i++){
    string+="{\"label\":\"";
    string+=customers[i].name;
    string+="\",";
    string+="\"id\":\"";
    string+=customers[i]._id;
    string+="\",\"children\":[";
    strcheck0 = string;
    for(j=0;j<customers[i].orders.length;j++){
      string+="{\"label\":\"Order #";
      string+=customers[i].orders[j].index+1;
      string+="\",";
      string+="\"id\":\"";
      string+=customers[i].orders[j]._id;
      string+="\",\"children\":[";
      strcheck1 = string;
      for(k=0;k<customers[i].orders[j].shipments.length;k++){
        string+="{\"label\":\"";
        string+=customers[i].orders[j].shipments[k].ship_date;
        string+="\",\"id\":\"";
        string+=customers[i].orders[j].shipments[k]._id;
        string+="\"},"
      }
      if(strcheck1 != string)
        string = string.substring(0, string.length-1);
      string+="]},";
    }
    if(strcheck1 != string)
      string = string.substring(0, string.length-1);
    string+="]},";
  }
  string = string.substring(0, string.length-1);
  string+="]\' multi-activate>";
  string+="</px-tree>";

  document.getElementById("TREE").innerHTML = string;
}
