"use client";

// Importando módulos necessários do React e do Socket.io.
import { ReactNode, createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

// Definindo uma interface para o contexto do Socket.
interface ISocketContext {
  socket: Socket | null; // Propriedade que armazena o objeto Socket ou null se não estiver conectado.
}

// Criando um contexto do React para o Socket.
export const SocketContext = createContext({} as ISocketContext);

// Componente funcional SocketProvider que fornece o contexto do Socket para os componentes descendentes.
export function SocketProvider({ children }: { children: ReactNode }) {
  // Estado para armazenar a instância do Socket ou null se não estiver conectado.
  const [socket, setSocket] = useState<Socket | null>(null);

  // Efeito colateral que é executado após a montagem do componente para criar a instância do Socket.
  useEffect(() => {
    // Criando uma nova instância do Socket.io-client e conectando ao servidor.
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}/streams`, {
      transports: ["websocket"], // Especificando o uso de transporte WebSocket.
    });

    // Atualizando o estado com a instância do Socket.
    setSocket(newSocket);
  }, []); // O efeito é executado apenas uma vez, após a montagem do componente.

  // Renderizando o contexto do SocketProvider com o valor atualizado do estado.
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
