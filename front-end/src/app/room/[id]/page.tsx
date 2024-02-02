"use client";
// Importando módulos necessários do React e componentes personalizados.
import Chat from "@/components/chat";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { SocketContext } from "@/context/socket";
import { useContext, useEffect, useRef } from "react";

// Componente funcional Room responsável por exibir uma sala de chat com vídeos.
export default function Room({ params }: { params: { id: string } }) {
  // Utilizando o contexto do Socket para acessar a instância do Socket.io.
  const { socket } = useContext(SocketContext);

  // Referência para o elemento de vídeo local.
  const localStream = useRef<HTMLVideoElement>(null);

  // Efeito para lidar com a conexão do Socket quando o componente é montado.
  useEffect(() => {
    socket?.on("connect", async () => {
      console.log("conectado");

      // Emitindo evento "subscribe" para entrar na sala especificada.
      socket?.emit("subscribe", {
        roomId: params.id,
        socketId: socket.id,
      });

      // Inicializando a câmera do usuário.
      await initCamera();
    });
  }, [socket, params.id]);

  // Função para inicializar a câmera do usuário.
  const initCamera = async () => {
    try {
      // Obtendo acesso à câmera e ao microfone.
      const video = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log("🚀 ~ initCamera ~ video:", video);

      // Atribuindo a stream de vídeo ao elemento de vídeo local.
      if (localStream.current) localStream.current.srcObject = video;
    } catch (error) {
      console.error("Error accessing camera and microphone:", error);
    }
  };

  // Renderizando o componente Room.
  return (
    <div className="h-mas screen">
      {/* Componente Header. */}
      <Header />

      <div className="flex h-[80%] ">
        <div className="md:w-[85%] w-full m-3 ">
          {/* Grid para exibir vídeos dos participantes. */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
            {/* Vídeo local com nome do participante. */}
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative ">
              <video
                className="h-full w-full"
                autoPlay
                ref={localStream}
              ></video>
              <span className="absolute bottom-3">Pedro Euzebio</span>
            </div>

            {/* Vídeo de outros participantes com nome. (Exemplo, pode ser dinâmico) */}
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative ">
              <video className="h-full w-full"></video>
              <span className="absolute bottom-3">Pedro Euzebio</span>
            </div>

            {/* Vídeo de outros participantes com nome. (Exemplo, pode ser dinâmico) */}
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative ">
              <video className="h-full w-full"></video>
              <span className="absolute bottom-3">Pedro Euzebio</span>
            </div>

            {/* Vídeo de outros participantes com nome. (Exemplo, pode ser dinâmico) */}
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative ">
              <video className="h-full w-full"></video>
              <span className="absolute bottom-3">Pedro Euzebio</span>
            </div>
          </div>
        </div>

        {/* Componente Chat para a sala específica. */}
        <Chat roomId={params.id} />
      </div>

      {/* Componente Footer. */}
      <Footer />
    </div>
  );
}
