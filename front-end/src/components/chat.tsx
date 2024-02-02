import Image from "next/image";

export default function Chat() {
  return (
    // Container principal do chat com classes de estilo e layout responsivo.
    <div className="bg-gray-900 px-4 pt-4 md:w-[15%] hidden md:flex rounded-md m-3 h-full">
      {/* Container relativo para envolver o chat e a barra de entrada. */}
      <div className="relative h-full w-full">
        {/* Balão de mensagem com fundo cinza escuro, bordas arredondadas e espaço interno. */}
        <div className="bg-gray-950 rounded p-2">
          {/* Informações do remetente (nome e horário) com estilo. */}
          <div className="flex items-center text-pink-400 space-x-2">
            <span>Pedro Euzebio</span>
            <span>09:15</span>
          </div>
          {/* Conteúdo da mensagem com margem superior e tamanho de texto pequeno. */}
          <div className="mt-5 text-sm">
            <p>text</p>
          </div>
        </div>

        {/* Formulário para a barra de entrada com posição absoluta na parte inferior. */}
        <form action="" className="absolute bottom-2 w-full">
          {/* Container flexível para a entrada de texto e o ícone de envio. */}
          <div className="flex relative">
            {/* Input de texto com estilo. */}
            <input
              type="text"
              name=""
              id=""
              className="px-3 py-2 bg-gray-950 rounded-md w-full"
            />
            {/* Ícone de envio com posição absoluta à direita e acima. */}
            <Image
              className="absolute right-2 top-2.5 cursor-pointer"
              src="/send.png"
              width={20}
              height={20}
              alt="Send"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
