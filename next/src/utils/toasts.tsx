import { UseToastOptions } from "@chakra-ui/react";

export const buildErrorToastOptions = (options: UseToastOptions) => { //toast de error
  const toastOptions: UseToastOptions = { // Opciones del toast
    title: "Error",
    status: "error",
    isClosable: true,
    description: "Ocurrio un error inesperado.",
    position: "top-right",
    ...options,
  };
  return toastOptions;
};

export const buildWarningToastOptions = (options: UseToastOptions) => { //toast de advertencia
  const toastOptions: UseToastOptions = {
    title: "Warning",
    status: "warning",
    isClosable: true,
    description: "Cuidado!",
    position: "top",
    ...options,
  };
  return toastOptions;
};

export const buildSucessToastOptions = (options: UseToastOptions) => { //toast de exito
  const toastOptions: UseToastOptions = {
    title: "Success",
    status: "success",
    isClosable: true,
    description: "Accion completada.",
    position: "top",
    ...options,
  };
  return toastOptions;
};
