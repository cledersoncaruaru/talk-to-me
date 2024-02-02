// Definindo uma interface chamada IButton que descreve a estrutura de dados esperada para o componente Button
interface IButton {
  title: string; // Propriedade title deve ser uma string
  type: "button" | "submit" | "reset"; // Propriedade type deve ser uma das três opções especificadas
}

// Exportando o componente Button como padrão.
export default function Button({ title, type }: IButton) {
  // Retornando um botão React com as classes de estilo e os atributos especificados
  return (
    <button
      className="bg-primary w-full text-black font-medium rounded-md py-2"
      type={type} // Atribuindo o valor da propriedade type ao atributo 'type' do botão
    >
      <span>{title}</span>
    </button>
  );
}
