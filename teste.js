var $ = require('jquery')
var socket = io.connect();


$("#lampada").click(function(e){
  e.preventDefault();
  socket.emit("entrar");
});

socket.on("clienteStatus", function(dados){
  console.log('recebendo dados do servidor');
});



$("#criarDispositivo").click(function(e){
  e.preventDefault();
  let id = $("input[name=criarId]").val();
  let nome = $("input[name=criarName]").val();
  let status =  $("input[name=criarStatus]").val();
  let idSensor = $("input[name=criarIdSensorDispositivo]").val();
  
  let obj = []
  obj = {
    name:nome,
    id: id,
    nome:nome,
    status: status,
    idSensor: idSensor
  }

  socket.emit("criar",obj);
});


$("#criarSensor").click(function(e){
  e.preventDefault();
  let id = $("input[name=criarIdSensor]").val();
  let nome = $("input[name=criarNameSensor]").val();
  let valor = $("input[name=criarValorSensor]").val();
  
  let obj = []
  obj = {
    name:nome,
    id: id,
    valor:valor
  }

  socket.emit("criarSensor",obj);
});

$("#change").click(function(e){
  e.preventDefault();
  let id = $("input[name=change]").val();
  socket.emit("change",id);
});


$("#alterarValor").click(function(e){
  e.preventDefault();
  let IdNovoValor= $("input[name=IdNovoValor]").val();
  let novoValor = $("input[name=novoValor]").val();

  socket.emit("changeValue",IdNovoValor,novoValor);
});