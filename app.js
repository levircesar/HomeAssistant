var app = require('http').createServer(resposta); // Criando o servidor
var fs = require('fs'); // Sistema de arquivos
var io = require('socket.io')(app); // Socket.Io

var ip_default = '127.0.0.1';
var port = 7000;

const amqp = require('amqplib/callback_api');

// Step 1: Create Connection
amqp.connect('amqp://localhost', (connError, connection) => {
    if (connError) {
        throw connError;
    }
    // Step 2: Create Channel
    connection.createChannel((channelError, channel) => {
        if (channelError) {
            throw channelError;
        }
        // Step 3: Assert Queue
        const QUEUE = 'codingtest'
        channel.assertQueue(QUEUE);
        // Step 4: Receive Messages
        channel.consume(QUEUE, (msg) => {
            console.log(`Message received: ${msg.content.toString()}`);
			let lista = JSON.parse(msg.content.toString())
			//console.log(lista);
			console.log(lista.dispositivo);
			console.log(lista.sensores);
			for (var i in lista.sensores) {
				if (lista.sensores[i].valor > 25) {

					console.log(lista.dispositivo[i]);
					console.log(lista.sensores[i].id);

					for( var j in lista.dispositivo){
						if(lista.sensores[i].id == lista.dispositivo[j].idSensor){
							client.turnOff({id:lista.dispositivo[j].id}, function(err, response) {});
						}
					}
					
				}
			  }
        }, {
            noAck: true
        })
    })
})

const PROTO_PATH = __dirname + '/proto/employee.proto';
const PROTO_PATH2 = __dirname + '/proto/sensor.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');



let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
let employee_proto = grpc.loadPackageDefinition(packageDefinition).employee;


let packageDefinition2 = protoLoader.loadSync(
    PROTO_PATH2,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
let sensor_proto = grpc.loadPackageDefinition(packageDefinition2).sensor;

var obj =[];

var sensores = [];

var client = new employee_proto.Employee('localhost:4500',
										 grpc.credentials.createInsecure());

var sensor = new sensor_proto.Sensor('localhost:4500',
										 grpc.credentials.createInsecure());	 

function criarDispositivo(name,id,nome,status,idSensor){
    name = new employee_proto.Employee('localhost:4500',
    grpc.credentials.createInsecure());
    name.id = id;
    name.nome=nome;
    name.status = status;
	name.idSensor = idSensor;
    let obje = {
      id       :name.id   ,
	  nome: 	name.nome,
      status   :name.status ,
	  idSensor: name.idSensor
    }
    //obj.push(obje);
    return obje 
} 

function criarSensor(name,id,valor){
    name = new sensor_proto.Sensor('localhost:4500',
    grpc.credentials.createInsecure());
    name.id = id;
	name.valor = valor;
    let obje = {
      id   :name.id,
	  valor:name.valor
    }
    //obj.push(obje);
    return obje
    
} 





app.listen(port);

console.log("Aplicação está em execução...");
// Função principal de resposta as requisições do servidor
function resposta (req, res) {
	var arquivo = "";
	if(req.url == "/"){
		arquivo = __dirname + '/index.html';
	}else{
		arquivo = __dirname + req.url;
	}
	fs.readFile(arquivo,
		function (err, data) {
			if (err) {
				res.writeHead(404);
				return res.end('Página ou arquivo não encontrados');
			}

			res.writeHead(200);
			res.end(data);
		}
	);
}

	io.on("connection", function(socket){
	// Método de resposta ao evento de entrar

	setInterval(function(){
		socket.emit("clienteStatus");
	},5000);
	
	socket.on("entrar", function(dados, callback){
			console.log('usuario entrou na aplicacao');
	});


	//se o botao sair for acionado
	socket.on("sair", function(){
		console.log('Usuario saiu da aplicação');
	});

	socket.on("criar", function(dados){
		let teste = criarDispositivo(dados.nome,dados.id ,dados.nome,dados.status,dados.idSensor);
		client.createEmployee(teste, function(err, response) {
		 console.log('criado');
		});
	});


	socket.on("criarSensor", function(dados){
		let teste = criarSensor(dados.name,dados.id ,dados.valor);
		sensor.createSensor(teste, function(err, response) {
		 console.log('sensor criado');
		});
	});

	socket.on("change", function(id){
		
		client.changeStatus({id:id}, function(err, response) {
			console.log(response.message);
		});

	});

	socket.on("changeValue", function(IdNovoValor,novoValor){
		
		sensor.changeValue({id:IdNovoValor,valor:novoValor}, function(err, response) {
			console.log(response.message);
		});

	});


	//se a página for fechada
	socket.on("disconnect", function(){
		console.log('Usuario saiu da aplicação');
	});

});
