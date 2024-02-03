// Importa o módulo 'client' do Next.js
'use client';

// Importa os componentes necessários
import Chat from '@/components/chat';
import Footer from '@/components/footer';
import Header from '@/components/header';

// Importa o contexto SocketContext para comunicação com o servidor WebSocket
import { SocketContext } from '@/context/socket';

// Importa o hook useRouter do Next.js para manipular a navegação
import { useRouter } from 'next/navigation';

// Importa os módulos necessários do React
import { useContext, useEffect, useRef, useState } from 'react';

// Interfaces para definir o formato dos dados esperados
interface IAnswer {
  sender: string;
  description: RTCSessionDescriptionInit;
}

interface ICandidate {
  sender: string;
  candidate: RTCIceCandidate;
}

interface IDataStream {
  id: string;
  stream: MediaStream;
  username: string;
}

// Declaração do componente Room
export default function Room({ params }: { params: { id: string } }) {
  // Obtém o contexto do socket
  const { socket } = useContext(SocketContext);

  // Referências para o vídeo local e a instância do roteador do Next.js
  const localStream = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  // Referência para os pares de conexão (peer connections) e estado para os streams remotos
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const [remoteStreams, setRemoteStreams] = useState<IDataStream[]>([]);
  const [videoMediaStream, setVideoMediaStream] = useState<MediaStream | null>(null);

  // Efeito colateral para lidar com eventos de conexão e comunicação com o servidor WebSocket
  useEffect(() => {
    // Obtém o nome do usuário da sessão
    const username = sessionStorage.getItem('username');

    // Evento 'connect' é emitido quando o socket se conecta ao servidor
    socket?.on('connect', async () => {
      console.log('conectado');
      
      // Envia uma mensagem de inscrição para entrar na sala
      socket?.emit('subscribe', {
        roomId: params.id,
        socketId: socket.id,
        username,
      });

      // Inicializa a câmera local
      await initLocalCamera();
    });

    // Evento 'new user' é acionado quando um novo usuário tenta se conectar à sala
    socket?.on('new user', (data) => {
      console.log('Novo usuário tentando se conectar', data);

      // Cria uma nova conexão com o novo usuário
      createPeerConnection(data.socketId, false, data.username);

      // Emite um evento 'newUserStart' para o novo usuário
      socket.emit('newUserStart', {
        to: data.socketId,
        sender: socket.id,
        username,
      });
    });

    // Evento 'newUserStart' é acionado quando um novo usuário é conectado à sala
    socket?.on('newUserStart', (data) => {
      console.log('Usuário conectado na sala', data);

      // Cria uma nova conexão com o usuário recém-conectado
      createPeerConnection(data.sender, true, data.username);
    });

    // Evento 'sdp' é acionado quando há uma descrição da sessão a ser trocada
    socket?.on('sdp', (data) => handleAnswer(data));

    // Evento 'ice candidates' é acionado quando há candidatos ICE a serem trocados
    socket?.on('ice candidates', (data) => handleIceCandidates(data));
  }, [socket]);

  // Função para lidar com candidatos ICE recebidos
  const handleIceCandidates = async (data: ICandidate) => {
    const peerConnection = peerConnections.current[data.sender];

    // Adiciona o candidato ICE à conexão
    if (data.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  // Função para lidar com a resposta (answer) à descrição da sessão
  const handleAnswer = async (data: IAnswer) => {
    const peerConnection = peerConnections.current[data.sender];

    // Se a descrição da sessão for do tipo 'offer', cria uma resposta (answer)
    if (data.description.type === 'offer') {
      await peerConnection.setRemoteDescription(data.description);

      // Cria uma resposta (answer) e define-a como descrição local
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log('criando uma resposta');
      
      // Envia a resposta para o outro lado da conexão
      socket?.emit('sdp', {
        to: data.sender,
        sender: socket?.id,
        description: peerConnection.localDescription,
      });
    } else if (data.description.type === 'answer') {
      console.log('ouvindo a oferta');
      
      // Se a descrição da sessão for do tipo 'answer', define-a como descrição remota
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.description),
      );
    }
  };

  // Função para criar uma nova conexão peer-to-peer (peer connection)
  const createPeerConnection = async (
    socketId: string,
    createOffer: boolean,
    username: string,
  ) => {
    // Configuração dos servidores ICE
    const config = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    };

    // Cria uma nova instância de RTCPeerConnection
    const peer = new RTCPeerConnection(config);
    peerConnections.current[socketId] = peer;
    const peerConnection = peerConnections.current[socketId];

    // Adiciona as faixas de vídeo e áudio à conexão
    if (videoMediaStream) {
      videoMediaStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, videoMediaStream);
      });
    } else {
      // Inicializa a câmera remota se não houver uma faixa de vídeo local
      const video = await initRemoteCamera();
      video
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, video));
    }

    // Se for necessário criar uma oferta (offer), cria e define como descrição local
    if (createOffer) {
      const peerConnection = peerConnections.current[socketId];

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log('criando uma oferta');
      
      // Envia a oferta para o outro lado da conexão
      socket?.emit('sdp', {
        to: socketId,
        sender: socket?.id,
        description: peerConnection.localDescription,
      });
    }

    // Evento ontrack é acionado quando uma nova faixa de mídia é recebida
    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];

      const dataStream: IDataStream = {
        id: socketId,
        stream: remoteStream,
        username,
      };

      // Atualiza o estado com o novo stream remoto
      setRemoteStreams((prevState: IDataStream[]) => {
        if (!prevState.some((stream) => stream.id === socketId)) {
          return [...prevState, dataStream];
        }
        return prevState;
      });
    };

    // Evento onicecandidate é acionado quando um candidato ICE é gerado
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        // Envia o candidato ICE para o outro lado da conexão
        socket?.emit('ice candidates', {
          to: socketId,
          sender: socket?.id,
          candidate: event.candidate,
        });
      }
    };

    // Evento onsignalingstatechange é acionado quando o estado de sinalização muda
    peerConnection.onsignalingstatechange = (event) => {
      switch (peerConnection.signalingState) {
        case 'closed':
          // Remove o stream remoto quando a conexão é fechada
          setRemoteStreams((prevState) =>
            prevState.filter((stream) => stream.id !== socketId),
          );
          break;
      }
    };

    // Evento onconnectionstatechange é acionado quando o estado de conexão muda
    peerConnection.onconnectionstatechange = (event) => {
      switch (peerConnection.connectionState) {
        case 'disconnected':
          // Remove o stream remoto quando a conexão é desconectada
          setRemoteStreams((prevState) =>
            prevState.filter((stream) => stream.id !== socketId),
          );
        case 'failed':
          // Remove o stream remoto quando a conexão falha
          setRemoteStreams((prevState) =>
            prevState.filter((stream) => stream.id !== socketId),
          );
        case 'closed':
          // Remove o stream remoto quando a conexão é fechada
          setRemoteStreams((prevState) =>
            prevState.filter((stream) => stream.id !== socketId),
          );
          break;
      }
    };
  };

  // Função para realizar o logout, encerrando as conexões e redirecionando para a página inicial
  const logout = () => {
    videoMediaStream?.getTracks().forEach((track) => {
      track.stop();
    });
    Object.values(peerConnections.current).forEach((peerConnection) => {
      peerConnection.close();
    });
    socket?.disconnect();
    router.push('/');
  };

  // Função para inicializar a câmera local
  const initLocalCamera = async () => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    setVideoMediaStream(video);
    if (localStream.current) localStream.current.srcObject = video;
  };

  // Função para inicializar a câmera remota
  const initRemoteCamera = async () => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    return video;
  };

  // Renderiza o componente Room
  return (
    <div className="h-mas screen">
      {/* Componente Header para o topo da página */}
      <Header />

      <div className="flex h-[80%] ">
        {/* Área de exibição de vídeo local e remoto */}
        <div className="md:w-[85%] w-full m-3 ">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
            {/* Vídeo local */}
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative ">
              <video
                className="h-full w-full mirror-mode"
                autoPlay
                ref={localStream}
              ></video>
              <span className="absolute bottom-3">
                {sessionStorage.getItem('username')}
              </span>
            </div>

            {/* Vídeos remotos */}
            {remoteStreams.map((stream, index) => {
              return (
                <div
                  className="bg-gray-950 w-full rounded-md h-full p-2 relative "
                  key={index}
                >
                  <video
                    className="h-full w-full"
                    autoPlay
                    ref={(video) => {
                      if (video && video.srcObject !== stream.stream)
                        video.srcObject = stream.stream;
                    }}
                  />
                  <span className="absolute bottom-3">{stream.username}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Componente Chat para a área de chat */}
        <Chat roomId={params.id} />
      </div>

      {/* Componente Footer para a parte inferior da página */}
      <Footer
        videoMediaStream={videoMediaStream!}
        peerConnections={peerConnections}
        localStream={localStream}
        logout={logout}
      />
    </div>
  );
}
