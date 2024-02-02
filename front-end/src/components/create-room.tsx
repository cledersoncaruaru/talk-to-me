// Importando módulos necessários do React.
import { FormEvent, useRef } from "react";

// Importando componentes Button e Input do local correspondente.
import Button from "./button";
import { Input } from "./input";

// Importando o hook useRouter do Next.js para navegação.
import { useRouter } from "next/navigation";

// Componente funcional CreateRoom responsável por criar uma nova sala.
export default function CreateRoom() {
  // Referência para o input do nome do usuário.
  const name = useRef<HTMLInputElement>(null);

  // Hook useRouter para realizar navegação no Next.js.
  const router = useRouter();

  // Função para lidar com a criação de uma nova sala.
  const handleCreateRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificando se o input do nome não está vazio.
    if (name.current && name.current.value !== "") {
      // Salvando o nome do usuário na sessão.
      sessionStorage.setItem("username", name.current.value);

      // Gerando um ID de sala aleatório.
      const roomId = generateRandomString();
      console.log("🚀 ~ handleCreateRoom ~ roomId:", roomId);

      // Navegando para a página da nova sala.
      router.push(`/room/${roomId}`);
    }
  };

  // Função para gerar uma string aleatória.
  function generateRandomString() {
    const randomString = Math.random().toString(36).substring(2, 7);
    return randomString;
  }

  // Renderizando o componente CreateRoom.
  return (
    <>
      {/* Formulário para criar uma nova sala. */}
      <form onSubmit={(e) => handleCreateRoom(e)} className="space-y-8">
        {/* Componente Input para o nome do usuário. */}
        <Input placeholder="Seu nome" type="text" ref={name} />

        {/* Componente Button para iniciar a criação da sala. */}
        <Button title="Entrar" type="submit" />
      </form>
    </>
  );
}
