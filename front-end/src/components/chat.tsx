// Importando o contexto do Socket para utilizar a instância do Socket.io.
import { SocketContext } from "@/context/socket";

// Importando módulos do Next.js e do React.
import Image from "next/image";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";

// Interface para modelar a estrutura das mensagens de chat.
interface IChatMessage {
  message: string;
  username: string;
  roomId: string;
  time: string;
}

// Componente funcional Chat que renderiza o chat em tempo real.
export default function Chat({ roomId }: { roomId: string }) {
  // Referência para o input de mensagem atual.
  const currentMsg = useRef<HTMLInputElement>(null);

  // Utilizando o contexto do Socket para acessar a instância do Socket.io.
  const { socket } = useContext(SocketContext);

  // Estado para armazenar as mensagens de chat.
  const [chat, setChat] = useState<IChatMessage[]>([]);

  // Efeito para escutar eventos de "chat" quando a instância do Socket muda.
  useEffect(() => {
    socket?.on("chat", (data) => {
      console.log("message: ", data);
      // Atualizando o estado com a nova mensagem recebida.
      setChat((prevState) => [...prevState, data]);
    });
  }, [socket]);

  // Função para enviar mensagens para o servidor.
  function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(currentMsg.current?.value);

    // Verificando se a mensagem não está vazia antes de enviar.
    if (currentMsg.current && currentMsg.current?.value !== "") {
      const sendMsgToServer = {
        message: currentMsg.current.value,
        username: "Alexia Kattah",
        roomId,
        time: new Date().toLocaleTimeString(),
      };

      // Emitindo a mensagem para o servidor.
      socket?.emit("chat", sendMsgToServer);

      // Atualizando o estado local com a mensagem enviada.
      setChat((prevState) => [...prevState, sendMsgToServer]);

      // Limpando o campo de input.
      currentMsg.current.value = "";
    }
  }

  // Renderizando o componente Chat.
  return (
    <div className="relative min-h-[70vh] bg-gray-900 px-4 pt-4 md:w-[15%] hidden md:flex flex-col rounded-md m-3 h-full">
      <div className="h-full w-full">
        {/* Mapeando e renderizando as mensagens de chat no DOM. */}
        {chat.map((chat, index) => {
          return (
            <div className="bg-gray-950 rounded p-2 mb-4" key={index}>
              <div className="flex items-center text-pink-400 space-x-2">
                <span>{chat.username}</span>
                <span>{chat.time}</span>
              </div>
              <div className="mt-5 text-sm">
                <p>{chat.message}</p>
              </div>
            </div>
          );
        })}

        {/* Formulário para enviar novas mensagens. */}
        <form
          className="absolute bottom-4 inset-x-3"
          onSubmit={(e) => sendMessage(e)}
        >
          <div className="flex relative">
            {/* Input para a mensagem. */}
            <input
              type="text"
              name=""
              id=""
              ref={currentMsg}
              className="px-3 py-2 bg-gray-950 rounded-md w-full"
            />
            {/* Botão de envio da mensagem. */}
            <button type="submit">
              <Image
                className="absolute right-2 top-2.5 cursor-pointer"
                src="/send.png"
                width={20}
                height={20}
                alt="Send"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
