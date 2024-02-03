// Importação das bibliotecas necessárias do Express, HTTP, Cors e Socket.IO
import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';

// Classe principal da aplicação
class App {
  // Declaração de membros privados da classe
  private app: Application;
  private http: http.Server;
  private io: Server;

  // Construtor da classe
  constructor() {
    // Inicialização do Express
    this.app = express();
    
    // Criação de um servidor HTTP usando o Express
    this.http = new http.Server(this.app);

    // Configuração do Socket.IO para o mesmo servidor HTTP
    this.io = new Server(this.http, {
      cors: {
        origin: '*',
      },
    });
  }

  // Método para iniciar o servidor
  public listen() {
    this.http.listen(3333, () => {
      console.log('Server running on port 3333');
    });
  }

  // Método para configurar eventos de socket
  public listenSocket() {
    // Configuração de um namespace '/streams' no Socket.IO
    this.io.of('/streams').on('connection', this.socketEvents);
  }

  // Método privado para manipular eventos de socket
  private socketEvents(socket: Socket) {
    // Evento de conexão de socket
    console.log('Socket connected: ' + socket.id);

    // Evento 'subscribe' - lida com a entrada do usuário em uma sala
    socket.on('subscribe', (data) => {
      console.log('usuario inserido na sala: ' + data.roomId);
      socket.join(data.roomId);
      socket.join(data.socketId);

      const roomsSession = Array.from(socket.rooms);

      // Verifica se há mais de uma sala na sessão e emite 'new user' para os outros usuários na sala
      if (roomsSession.length > 1) {
        socket.to(data.roomId).emit('new user', {
          socketId: socket.id,
          username: data.username,
        });
      }
    });

    // Outros eventos de socket (newUserStart, sdp, ice candidates, chat) são tratados da mesma forma
    // ...

    // Comentado: Evento 'disconnect' - desconectar um socket
    // socket.on('disconnect', () => {
    //   console.log('Socket desconectado: ' + socket.id);
    //   socket.disconnect();
    // });
  }
}

// Exporta a classe App para ser usada em outros arquivos
export { App };
