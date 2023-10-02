import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const formSchema = Yup.object({
  maxPlayers: Yup.number()
    .required("Este campo es requerido")
    .min(4, "La cantidad minima de jugadores debe ser 4")
    .max(12, "La cantidad maxima de jugadores debe ser 12"),
  minPlayers: Yup.number()
    .required("Este campo es requerido")
    .min(4, "La cantidad minima de jugadores debe ser 4")
    .max(12, "La cantidad maxima de jugares deber ser 12"),
  name: Yup.string()
    .required("Este campo es requerido")
    .max(50, "La cantidad maxima de caracteres es 50")
    .min(3, "La cantidad minima de caracteres es 3"),
});

const enviarDatosServ = async (values: {
  minPlayers: any;
  maxPlayers: any;
  name: any;
}) => {
  try {
    const response = await fetch("http://localhost:3000", {
      method: "POST", //Envia los datos a la api
      headers: {
        //le dice al servidor que tipo de datos se estan enviando
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        minPlayers: values.minPlayers,
        maxPlayers: values.maxPlayers,
      }),
    });
    if (response.ok) {
      const data = await response.json(); //convierte los datos a json
      console.log("Respuesta del servidor:", data);
    } else {
      console.error("Error al enviar datos:", response.statusText);
    }
  } catch (error) {
    console.error("Error al enviar datos:", error);
  }
};

function ModalCrearPartida() {
  const { isOpen, onOpen, onClose } = useDisclosure(); //esto abre y cierra el modal

  const initialRef = React.useRef(null); //esto es para que cuando se abra el modal, el foco vaya al primer input
  const finalRef = React.useRef(null);

  return (
    <>
      <Button onClick={onOpen}>Crear Partida</Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Partida</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{ minPlayers: 4, maxPlayers: 12, name: "" }}
              onSubmit={(values) => {
                console.log(values); //valores del formulario
                enviarDatosServ(values); //envia los datos a la api
                // onClose(); //cierra el modal
              }}
              validationSchema={formSchema}
            >
              {({ errors, touched, handleSubmit }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    {/* input name jugador  */}
                    <FormControl
                      isInvalid={!!errors.name && touched.name} //hubo error y el campo fue tocado
                    >
                      <FormLabel htmlFor="name">Name </FormLabel>
                      <Field as={Input} name="name" type="text" id="name" />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>
                    {/* input de jugadores minimos  */}
                    <FormControl
                      isInvalid={!!errors.minPlayers && touched.minPlayers} //hubo error y el campo fue tocado
                    >
                      <FormLabel htmlFor="minPlayers">
                        Minimo de Jugadores{" "}
                      </FormLabel>
                      <Field
                        as={Input}
                        name="minPlayers"
                        type="text"
                        id="minPlayers"
                      />
                      <FormErrorMessage>{errors.minPlayers}</FormErrorMessage>
                    </FormControl>
                    {/* input de jugadores maximos  */}
                    <FormControl
                      isInvalid={!!errors.maxPlayers && touched.maxPlayers} //hubo error y el campo fue tocado
                    >
                      <FormLabel htmlFor="maxPlayers">
                        Maximo de Jugadores{" "}
                      </FormLabel>
                      <Field
                        as={Input}
                        name="maxPlayers"
                        type="text"
                        id="maxPlayers"
                      />
                      <FormErrorMessage>{errors.maxPlayers}</FormErrorMessage>
                    </FormControl>
                  </form>
                );
              }}
            </Formik>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Guardar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalCrearPartida;
