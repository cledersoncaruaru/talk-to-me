// Importando o hook useRef do React para criar referências aos elementos input.
import { useRef } from "react";

import Button from "./button";
import { Input } from "./input";

// Componente funcional JoinRoom responsável por renderizar o formulário de entrada em uma sala existente.
export default function JoinRoom() {
  // Criando referências para os elementos input de nome e ID da reunião.
  const name = useRef<HTMLInputElement>(null);
  const id = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* Componente Input utilizado para capturar o nome do usuário. */}
      <Input placeholder="Seu nome" type="text" ref={name} />

      {/* Componente Input utilizado para capturar o ID da reunião. */}
      <Input placeholder="ID da reunião" type="text" ref={id} />

      {/* Componente Button utilizado para acionar a ação de entrar na sala. */}
      <Button title="Entrar" type="button" />
    </>
  );
}
