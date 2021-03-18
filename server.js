
const PROTO_PATH = __dirname + '/proto/employee.proto';
const PROTO_PATH2 = __dirname + '/proto/sensor.proto';


const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

let packageDefinition2 = protoLoader.loadSync(
  PROTO_PATH2,
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });


let employee_proto = grpc.loadPackageDefinition(packageDefinition).employee;
let sensor_proto = grpc.loadPackageDefinition(packageDefinition2).sensor;

//let {employees} = require('./data.js');
//let {sensores} = require('./data2.js');

let employees = [];
let sensores = [];

function getDetails(call, callback) {
  console.log(call.request);
  callback(null, 
    {
       message: _.find(employees, { id: call.request.id })
    });
}

function getDetailsSensor(call, callback) {
  console.log(call.request);
  callback(null, 
    {
       message: _.find(sensores, { id: call.request.id })
    });
}



function  createEmployee(call, callback) {

  for (var i in sensores) {
    if (sensores[i].id ==  call.request.idSensor) {

      let client = new employee_proto.Employee('localhost:4500',grpc.credentials.createInsecure());
      
      client.getDetails({id: call.request.idSensor}, function(err, response) {
            if(response.message ==null){
                let obj = [];
                obj = call.request
                employees.push(obj);
                callback('sucesso');
              }else{
                callback('erro');
              }
       });
    }
    
  }
  console.log('lista de objetos : ' +employees);

}

function  createSensor(call, callback) {
  let client = new sensor_proto.Sensor('localhost:4500',
  grpc.credentials.createInsecure());


  client.getDetailsSensor({id: call.request.id}, function(err, response) {
    if(response.message ==null){
      let obj = [];
      obj = call.request
      sensores.push(obj);
      callback('sucesso');
    }else{
      callback('erro');
    }
    
  })
   
  console.log('lista de objetos : ' +sensores);
}

function changeStatus(call, callback){
  let number = call.request.id;
  for (var i in employees) {
    if (employees[i].id == number) {
      if(employees[i].status == false){
        employees[i].status = true;
      }else{
        employees[i].status = false;
      }
       
       break; //Stop this loop, we found it!
    }
  }
  console.log(employees);
  callback(null, 
    {
       message: _.find(employees, { id: call.request.id})
    });
    
}



function changeValue(call, callback){
  let id = call.request.id;
  let valor = call.request.valor;
  for (var i in sensores) {
    if (sensores[i].id == id) {
      sensores[i].valor = valor;
    }
  }
  console.log(sensores);
  callback(null, 
    {
       message: _.find(sensores, { id: call.request.id})
    });
    
}

function turnOff(call, callback){
  let number = call.request.id;
  for (var i in employees) {
    if (employees[i].id == number) {
      employees[i].status = false;
    }
  }
  console.log(employees);
  callback(null, 
    {
       message: _.find(employees, { id: call.request.id})
    });
    
}

function main() {
  let server = new grpc.Server();
  server.addService(employee_proto.Employee.service, {getDetails: getDetails, createEmployee:  createEmployee,changeStatus :changeStatus , turnOff:turnOff});
  server.addService(sensor_proto.Sensor.service, {getDetailsSensor:getDetailsSensor,createSensor:createSensor ,changeValue:changeValue});
  server.bind('0.0.0.0:4500', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();


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
        // Step 4: Send message to queue
        setInterval(function(){
          arr =[];
          arr = {
            dispositivo:employees,
            sensores:sensores
          }
          channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(arr)));
         console.log(`Message send ${QUEUE}`);
        },5000);
        
    })
})

