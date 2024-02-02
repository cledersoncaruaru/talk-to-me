// Importando os módulos necessários do Express, Socket.io e CORS.
import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';

// Classe principal App que configura o servidor Express e o Socket.io.
class App {
  private app: Application;
  private http: http.Server;
  private io: Server;

  // Construtor que inicializa o servidor Express e o Socket.io.
  constructor() {
    // Criando uma instância do aplicativo Express.
    this.app = express();
    
    // Criando uma instância do servidor HTTP utilizando o Express.
    this.http = new http.Server(this.app);
    
    // Criando uma instância do servidor Socket.io associado ao servidor HTTP.
    this.io = new Server(this.http, {
      cors: {
        origin: '*',  // Configuração de CORS permitindo acesso de qualquer origem.
      },
    });
  }

  // Método para iniciar o servidor HTTP na porta 3333.
  public listen() {
    this.http.listen(3333, () => {
      console.log('Server running on port 3333');
    });
  }

  // Método para configurar eventos do Socket.io para a namespace '/streams'.
  public listenSocket() {
    this.io.of('/streams').on('connection', this.socketEvents);
  }

  // Método privado que lida com eventos de Socket.io.
  private socketEvents(socket: Socket) {
    console.log('Socket connected: ' + socket.id);

    // Evento 'subscribe' para adicionar um usuário à sala.
    socket.on('subscribe', (data) => {
      console.log('User joined room: ' + data.roomId);
      
      // O socket se junta à sala identificada por data.roomId.
      socket.join(data.roomId);

      // Evento 'chat' para lidar com mensagens de chat.
      socket.on('chat', (data) => {
        console.log('🚀 ~ App ~ socket.on ~ data:', data);
        
        // Enviando mensagem para todos os membros da sala, exceto o remetente.
        socket.broadcast.to(data.roomId).emit('chat', {
          message: data.message,
          username: data.username,
          time: data.time,
        });
      });
    });
  }
}

// Exportando a classe App para ser utilizada em outros arquivos.
export { App };
