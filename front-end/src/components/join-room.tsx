// Importa o módulo 'client' do Next.js
'use client';

// Importa os módulos necessários do React
import { FormEvent, useRef } from 'react';

// Importa os componentes Button e Input do local atual
import Button from './button';
import { Input } from './input';

// Importa o hook useRouter do Next.js para manipular a navegação
import { useRouter } from 'next/navigation';

// Declaração do componente JoinRoom
export default function JoinRoom() {
  // Cria referências para os elementos de input usando useRef do TypeScript
  const name = useRef<HTMLInputElement>(null);
  const id = useRef<HTMLInputElement>(null);

  // Obtém o objeto router para manipular a navegação
  const router = useRouter();

  // Função chamada ao enviar o formulário
  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    // Previne o comportamento padrão do formulário
    e.preventDefault();

    // Verifica se os campos de nome e ID não estão vazios
    if (
      name.current &&
      name.current.value !== '' &&
      id.current &&
      id.current.value !== ''
    ) {
      // Armazena o nome do usuário na sessão do navegador
      sessionStorage.setItem('username', name.current.value);

      // Obtém o ID da sala e redireciona para a página da sala
      const roomId = id.current.value;
      window.location.href = `/room/${roomId}`;
    }
  };

  // Renderiza o componente JoinRoom
  return (
    <>
      {/* Formulário de entrada na sala com evento onSubmit associado à função handleJoinRoom */}
      <form onSubmit={(e) => handleJoinRoom(e)} className="space-y-8">
        {/* Componente Input para o nome do usuário */}
        <Input placeholder="Seu nome" type="text" ref={name} />

        {/* Componente Input para o ID da reunião */}
        <Input placeholder="ID da reunião" type="text" ref={id} />

        {/* Componente Button para enviar o formulário */}
        <Button title="Entrar" type="submit" />
      </form>
    </>
  );
}
