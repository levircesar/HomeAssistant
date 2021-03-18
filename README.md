# Home Assistant
Projeto Home Assistant implementado em Node.js usando arquitetura gRPC e Rabbitmq

## Etapas do desenvolvimento

- [X] Comunicação TCP CLiente - Servidor
- [X] Utilizar Socket
- [X] Utilizar gRPC 
- [X] Utiizar Rabbit MQ

### Para rodar é importante ter o Node.js na sua maquina
Você pode baixar neste <a href="https://nodejs.org/en/download/">link</a>. Com o Node instalado ,utilize um gerenciador de pacotes para o proximo passo. Neste exemplo, utilizei os comandos npm para instalar todas as dependencias desse projeto.
```
$ npm install
```


#### Execute primeiro o servidor
```
$ node server.js
```
#### Execute o App
```
$ node app.js
```
##### Depois vá no no seu navegador de internet e digite
```
127.0.0.1:7000
```

###### Tudo Ok
Você verá o painel de comandos da aplicacao, todos os valores das operacoes poderam ser observadas pelo terminal.