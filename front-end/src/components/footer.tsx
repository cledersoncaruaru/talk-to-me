// Importa o módulo 'client' do Next.js
'use client';

// Importa ícones necessários para a interface
import { Camera, Computer, Mic, NoCamera, NoComputer, NoMic, Phone } from '@/icons';

// Importa os módulos necessários do React
import { MutableRefObject, useContext, useState } from 'react';

// Importa o componente Container do local atual
import Container from './container';

// Importa o contexto SocketContext para comunicação com o servidor WebSocket
import { SocketContext } from '@/context/socket';

// Declaração do componente Footer
export default function Footer({
  videoMediaStream,
  peerConnections,
  localStream,
  logout,
}: {
  videoMediaStream: MediaStream;
  peerConnections: MutableRefObject<Record<string, RTCPeerConnection>>;
  localStream: MutableRefObject<HTMLVideoElement | null>;
  logout: () => void;
}) {
  // Estados para controlar o estado do áudio, câmera e compartilhamento de tela
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Obtém a data atual para exibição do horário
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0') + ':';
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Função para alternar o estado do áudio
  const toggleMuted = () => {
    // Altera o estado do áudio local
    videoMediaStream?.getAudioTracks().forEach((track) => {
      track.enabled = !isMuted;
    });
    setIsMuted(!isMuted);

    // Atualiza o estado do áudio para todos os pares conectados
    Object.values(peerConnections.current).forEach((peerConnection) => {
      peerConnection.getSenders().forEach((sender) => {
        if (sender.track?.kind === 'audio') {
          if (videoMediaStream?.getAudioTracks().length > 0) {
            sender.replaceTrack(
              videoMediaStream
                ?.getAudioTracks()
                .find((track) => track.kind === 'audio') || null,
            );
          }
        }
      });
    });
  };

  // Função para alternar o estado da câmera
  const toggleVideo = () => {
    // Altera o estado da câmera local
    setIsCameraOff(!isCameraOff);
    videoMediaStream?.getVideoTracks().forEach((track) => {
      track.enabled = isCameraOff;
    });

    // Atualiza o estado da câmera para todos os pares conectados
    Object.values(peerConnections.current).forEach((peerConnection) => {
      peerConnection.getSenders().forEach((sender) => {
        if (sender.track?.kind === 'video') {
          sender.replaceTrack(
            videoMediaStream
              ?.getVideoTracks()
              .find((track) => track.kind === 'video') || null,
          );
        }
      });
    });
  };

  // Função para alternar o compartilhamento de tela
  const toggleScreenSharing = async () => {
    if (!isScreenSharing) {
      // Inicia o compartilhamento de tela e substitui a faixa de vídeo local
      const videoShareScreen = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      if (localStream.current) localStream.current.srcObject = videoShareScreen;

      // Atualiza o estado de compartilhamento de tela para todos os pares conectados
      Object.values(peerConnections.current).forEach((peerConnections) => {
        peerConnections.getSenders().forEach((sender) => {
          if (sender.track?.kind === 'video') {
            sender.replaceTrack(videoShareScreen.getVideoTracks()[0]);
          }
        });
      });

      setIsScreenSharing(!isScreenSharing);
      return;
    }

    // Restaura a faixa de vídeo local e atualiza o estado para todos os pares conectados
    if (localStream.current) localStream.current.srcObject = videoMediaStream;

    Object.values(peerConnections.current).forEach((peerConnections) => {
      peerConnections.getSenders().forEach((sender) => {
        if (sender.track?.kind === 'video') {
          sender.replaceTrack(videoMediaStream?.getVideoTracks()[0]);
        }
      });
    });

    setIsScreenSharing(!isScreenSharing);
  };

  // Renderiza o componente Footer
  return (
    <div className="fixed items-center bottom-0 bg-black py-6 w-full">
      <Container>
        <div className="grid grid-cols-3 ">
          <div className="flex items-center">
            {/* Exibe o horário atual */}
            <p className="text-xl">
              {hours}
              {minutes}
            </p>
          </div>
          <div className="flex space-x-6 justify-center ">
            {/* Botões para controlar áudio, câmera, compartilhamento de tela e logout */}
            {isMuted ? (
              <NoMic
                className="h-12 w-16 text-white p-2 cursor-pointer bg-red-500  rounded-md"
                onClick={() => toggleMuted()}
              />
            ) : (
              <Mic
                className="h-12 w-16 text-white p-2 cursor-pointer bg-gray-950  rounded-md"
                onClick={() => toggleMuted()}
              />
            )}
            {isCameraOff ? (
              <NoCamera
                className="h-12 w-16 text-white p-2 cursor-pointer bg-red-500 rounded-md"
                onClick={() => toggleVideo()}
              />
            ) : (
              <Camera
                className="h-12 w-16 text-white p-2 cursor-pointer bg-gray-950 rounded-md"
                onClick={() => toggleVideo()}
              />
            )}

            {isScreenSharing ? (
              <NoComputer
                className="h-12 w-16 text-white p-2 cursor-pointer bg-red-500 rounded-md"
                onClick={() => toggleScreenSharing()}
              />
            ) : (
              <Computer
                className="h-12 w-16 text-white p-2 cursor-pointer bg-gray-950 rounded-md"
                onClick={() => toggleScreenSharing()}
              />
            )}

            {/* Botão de logout */}
            <Phone
              onClick={logout}
              className="h-12 w-16 text-white hover:bg-red-500 p-2 cursor-pointer bg-primary rounded-md"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
