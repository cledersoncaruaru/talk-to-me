// Importando as funções necessárias do React para criar um componente funcional com encaminhamento de referência
import { ForwardRefRenderFunction, forwardRef } from "react";

// Definindo uma interface IInput que descreve a estrutura de dados esperada para o componente Input
interface IInput {
  placeholder: string; // Propriedade placeholder deve ser uma string
  type: string; // Propriedade type deve ser uma string
}

// Definindo o componente base (InputBase) usando ForwardRefRenderFunction, que lida com a lógica do componente
const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  { placeholder, type, ...rest }, // Destructuring das props, extraindo placeholder, type e o restante das props
  ref // Referência encaminhada ao componente
) => {
  return (
    <div className="w-full">
      {/* Criando um elemento input com as propriedades e estilos especificados */}
      <input
        type={type}
        placeholder={placeholder}
        ref={ref} // Associando a referência encaminhada ao input
        {...rest} // Passando o restante das props diretamente para o input
        className="px-3 py-2 bg-gray-950 rounded-md w-full" // Estilos do input
      />
    </div>
  );
};

// Exportando o componente Input utilizando o encaminhamento de referência.
export const Input = forwardRef(InputBase);
