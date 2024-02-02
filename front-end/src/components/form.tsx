"use client";
// Importando o hook useState do React para gerenciar o estado do componente.
import { useState } from "react";
import CreateRoom from "./create-room";
import JoinRoom from "./join-room";

// Componente funcional Form responsável por renderizar o formulário de seleção e os formulários de criação/join de sala.
export default function FormWrapper() {
  // Estado para controlar a opção de sala selecionada ("create" ou "join")
  const [selectedRoom, setSelectedRoom] = useState<"create" | "join">("join");
  // Função para atualizar o estado com a opção de sala escolhida.
  const handleSelectRoom = (room: "create" | "join") => {
    setSelectedRoom(room);
  };
  return (
    <div className="max-w-[580px] w-full ">
      <div className="flex mx-auto items-center space-x-6 text-center ">
        <span
          className={`cursor-pointer w-1/2  p-4 ${
            selectedRoom === "join" &&
            " bg-secondary rounded-t-lg  text-primary"
          }`}
          onClick={() => handleSelectRoom("join")}
        >
          Ingressar
        </span>
        <span
          className={`cursor-pointer w-1/2  p-4 ${
            selectedRoom === "create" &&
            " bg-secondary rounded-t-lg  text-primary"
          }`}
          onClick={() => handleSelectRoom("create")}
        >
          Nova reunião
        </span>
      </div>
      <div className="space-y-8 bg-secondary p-10 rounded-b-lg">
        <RoomSelector selectedRoom={selectedRoom} />
      </div>
    </div>
  );
}

// Componente funcional RoomSelector responsável por escolher qual componente de sala renderizar com base na opção selecionada
const RoomSelector = ({ selectedRoom }: { selectedRoom: string }) => {
  switch (selectedRoom) {
    // Se a opção for "create", renderiza o formulário de criação de sala
    case "create":
      return <CreateRoom />;
    // Se a opção for "join", renderiza o formulário de entrada em sala existente
    case "join":
      return <JoinRoom />;
    // Caso padrão (pode ser removido, pois o switch só deve ter duas opções neste caso).
    default:
      return <JoinRoom />;
  }
};
