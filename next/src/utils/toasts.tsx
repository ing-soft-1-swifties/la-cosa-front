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
    status: "warning",
    isClosable: true,
    position: "top",
    ...options,
  };
  return toastOptions;
};

export const buildSucessToastOptions = (options: UseToastOptions) => {
  const toastOptions: UseToastOptions = {
    status: "success",
    isClosable: true,
    position: "top",
    ...options,
  };
  return toastOptions;
};

export const buildInfoToastOptions = (options: UseToastOptions) => {
  const toastOptions: UseToastOptions = {
    status: "info",
    isClosable: true,
    position: "top",
    ...options,
  };
  return toastOptions;
};
