const calcularDigito = (numeros: string, pesoInicial: number): number => {
  let soma = 0;

  for (let i = 0; i < numeros.length; i++) {
    soma = soma + Number(numeros[i]) * (pesoInicial - i);
  }

  const resto = (soma * 10) % 11;

  if (resto === 10) {
    return 0;
  }

  return resto;
};

export const validarCpf = (cpf: string): boolean => {
  const numeros = cpf.replace(/\D/g, "");

  if (numeros.length !== 11) {
    return false;
  }


  if (/^(\d)\1{10}$/.test(numeros)) {
    return false;
  }

  const digito1 = calcularDigito(numeros.slice(0, 9), 10);
  const digito2 = calcularDigito(numeros.slice(0, 10), 11);

  return digito1 === Number(numeros[9]) && digito2 === Number(numeros[10]);
};