let display = document.querySelector('.display');
let uploadInput = document.getElementById('input');
let displayString = '';

// var 
let ipaddress = "null";
let schema = "null";
let username = "null";
let host = "null";
let updateHost = "null"
let port = "null";
let pathname = "null";
let query = "null";
let fragment = "null";
const ar=[];

// counter
let count = {
  http:0, 
  https:0,};
let tdm = {}
var counthttp = 0

uploadInput.addEventListener('change', e =>  {
    readeFiles(uploadInput.files[0]);
}, false);

function readeFiles(files){
const reader = new FileReader();
reader.onload = (element)=> {
  const result = element.target.result;
  let resultSet = reader.result.split('\n');
  resultSet.forEach( 
     function(str)
    {
        let a = new URL(str.trim());
        getContent(a);
        createTable();
        console.log("3 :");
        createChart();
        createTDM();
  })
   
}
reader.readAsText(files);
}

 async function getContent(a){
  schema = a.protocol;
  if (schema == "") schema+= "null";
  if (schema != "" ) countSchem(schema);
  username = a.username;
  if (username == "") username+= "null";
  host = a.hostname;
  if (host == "") host+= "null";
  else {
    var part = host.split(".").reverse();
    const r = part[0];
    if(r in tdm) tdm[r]++;
    else tdm[r]=1;
    for(var index in tdm){
      var attr = tdm[index]
      console.log(index+" "+attr)
    }
  }
  port = a.port;
  if (port == "") port+= "null";
  pathname = a.pathname;
  query = a.search;
  if (query == "") query+= "null";
  fragment = a.hash;
  if (fragment == "") fragment+= "null";
  counthttp = count.http;
  // await $.getJSON('https://dns.google.com/resolve?name=' + host,function(data){
  //   const result =data.Answer;
  //   const index=data.Answer.length-1;
  //   ipaddress=result[index].data;
  //   console.log(ipaddress);
  // })

  await getIP();
  for(var index in tdm){
    var attr = tdm[index]
    ar.push({label:index,y:attr,color:"#FFF"})
  }
  // createTable();

    //Table Ip
    /** 
    let table = document.getElementById("ipaddress");
    console.log("HOST 2" + host)
    const content="<table>"+
      "<tr>"+
        "<th>IP ADDRESS</th>"+
      "</tr>"+
      "<tr>"+
        "<td>"+ ipaddress +"</td>"+
      "</tr>"+
    "</table>";
     table.innerHTML+=content;
     **/
}

async function getIP(){
 await makeRequest()
 console.log("2");
 let table = document.getElementById("table");
 const content="<table>"+
   "<tr>"+
     "<th>IP Address</th>"+
     "<th>SCHEMA</th>"+
     "<th>USERNAME</th>"+
     "<th>HOST</th>"+
     "<th>PORT</th>"+
     "<th>PATH</th>"+
     "<th>QUERY</th>"+
     "<th>FRAGMENT</th>"+
   "</tr>"+
   "<tr>"+
     "<td>"+ ipaddress +"</td>"+
     "<td>"+ schema +"</td>"+
     "<td>"+ username +"</td>"+
     "<td>"+ host +"</td>"+
     "<td>"+ port +"</td>"+
     "<td>"+ pathname +"</td>"+
     "<td>"+ query +"</td>"+
     "<td>"+ fragment +"</td>"+
   "</tr>"+
 "</table>";
  table.innerHTML+=content;
}

function makeRequest(){
  return new Promise(function (resolve, reject){
    var xhr =  new XMLHttpRequest();
    xhr.timeout = 2000;
    xhr.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          const index = myArr.Answer.length-1;
          ipaddress = myArr.Answer[index].data;
          console.log("1 : " + ipaddress);
          host = myArr.Question.name;
          resolve(xhr.response);    
      }else {
        reject ({
          status: this.status,
          statustText: xhr.statusText
        });
      }
  };
     xhr.open('GET','https://dns.google.com/resolve?name=' + host);
     xhr.send()
  })

}

function countSchem(schema){
  if (schema == "https:")
  count.https++
  if (schema == "http:")
  count.http++
}

function createTable(a){
 let table = document.getElementById("table");
const content="<table>"+
  "<tr>"+
    "<th>IP Address</th>"+
    "<th>SCHEMA</th>"+
    "<th>USERNAME</th>"+
    "<th>HOST</th>"+
    "<th>PORT</th>"+
    "<th>PATH</th>"+
    "<th>QUERY</th>"+
    "<th>FRAGMENT</th>"+
  "</tr>"+
  "<tr>"+
    "<td>"+ ipaddress +"</td>"+
    "<td>"+ schema +"</td>"+
    "<td>"+ username +"</td>"+
    "<td>"+ host +"</td>"+
    "<td>"+ port +"</td>"+
    "<td>"+ pathname +"</td>"+
    "<td>"+ query +"</td>"+
    "<td>"+ fragment +"</td>"+
  "</tr>"+
"</table>";
 table.innerHTML+=content;
}

function createChart() {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    backgroundColor: "#f0fff0",
    subtitles:{
      fontColor:"red" },
    title: {
      text: "Chart of Scheme",
      fontColor: "#1b7484"
    },
    data: [{
      type: "doughnut",
      startAngle: 100,
      yValueFormatString: "##0.00\"%\"",
      indexLabel: "{label} {y}",
      dataPoints: [
        {y: count.http, 
          label: "http",
          color : "#ddd600"
        },
        {y: count.https, 
          label: "https",
          color : "#c64227"
        },
      ]
    }]   
  });
  chart.render();
}

for(var index in tdm){
  var attr = tdm[index]
  console.log(index+" " + attr)
}

function createTDM() {
  var chart = new CanvasJS.Chart("TDMContainer", {
    animationEnabled: true,
    backgroundColor: "#f0fff0",
    subtitles:{
      fontColor:"red" },
    title: {
      text: "Chart of Top Domain",
      fontColor: "#1b7484"
    },
    data: [{
      type: "doughnut",
      startAngle: 100,
      yValueFormatString: "##0.00\"%\"",
      indexLabel: "{label} {y}",
      dataPoints: fruits[0]
    }]   
  });
  chart.render();
}

