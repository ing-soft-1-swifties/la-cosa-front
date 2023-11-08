import { UseToastOptions } from "@chakra-ui/react";

export const buildErrorToastOptions = (options: UseToastOptions) => {
  const toastOptions: UseToastOptions = {
    title: "Error",
    status: "error",
    isClosable: true,
    description: "Ocurrio un error inesperado.",
    position: "top-right",
    ...options,
  };
  return toastOptions;
};

export const buildWarningToastOptions = (options: UseToastOptions) => {
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

export const buildSucessToastOptions = (options: UseToastOptions) => {
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
