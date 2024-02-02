// Importando a classe App do arquivo 'app'.
import { App } from './app';

// Criando uma instância da classe App.
const app = new App();

// Iniciando o servidor HTTP na porta 3333.
app.listen();

// Configurando eventos do Socket.io para a namespace '/streams'.
app.listenSocket();
