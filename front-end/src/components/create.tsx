// Importando o hook useRef do React para criar uma referência ao elemento input.
import { useRef } from "react";

import Button from "./button";
import { Input } from "./input";

// Componente funcional CreateRoom responsável por renderizar o formulário de criação de sala.
export default function CreateRoom() {
  // Criando uma referência para o elemento input do nome.
  const name = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* Componente Input utilizado para capturar o nome do usuário. */}
      <Input placeholder="Seu nome" type="text" ref={name} />

      {/* Componente Button utilizado para acionar a ação de entrar na sala. */}
      <Button title="Entrar" type="button" />
    </>
  );
}
