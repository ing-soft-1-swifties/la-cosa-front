import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Flex,
  UseDisclosureReturn,
  Box,
} from "@chakra-ui/react";
import { joinPlayerToGame } from "business/game/gameAPI/manager";
import { Field, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setGameConnectionToken } from "@/store/userSlice";
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
  nombreJugador: Yup.string()
    .required("Este campo es requerido")
    .max(50, "La cantidad maxima de caracteres es 50")
    .min(3, "La cantidad minima de caracteres es 3"),
  nombrePartida: Yup.string()
    .required("Este campo es requerido")
    .max(50, "La cantidad maxima de caracteres es 50")
    .min(3, "La cantidad minima de caracteres es 3"),
});

type NewGameModalProps = {
  disclouse: UseDisclosureReturn;
};

function NewGameModal({ disclouse }: NewGameModalProps) {
  const { isOpen, onClose } = disclouse; //esto abre y cierra el modal
  const router = useRouter();
  const dispatch = useDispatch();

  const initialRef = React.useRef(null); //esto es para que cuando se abra el modal, el foco vaya al primer input
  const finalRef = React.useRef(null);

  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  return (
    <Box data-testid="modal-crear">
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
              initialValues={{
                minPlayers: 4,
                maxPlayers: 12,
                nombreJugador: "",
                nombrePartida: "",
              }}
              onSubmit={async (values) => {
                console.log(values); //valores del formulario
                setSubmitError(undefined);
                try {
                  const response = await fetch("http://localhost:8000/create", {
                    method: "POST", //Envia los datos a la api
                    headers: {
                      //le dice al servidor que tipo de datos se estan enviando
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      room_name: values.nombrePartida,
                      host_name: values.nombreJugador,
                      min_players: values.minPlayers,
                      max_players: values.maxPlayers,
                      is_private: false,
                    }),
                  });
                  if (response.ok) {
                    const data: { token: string } = await response.json(); //convierte los datos a json
                    console.log("Respuesta del servidor:", data);
                    dispatch(setGameConnectionToken(data.token));
                    router.replace("/lobby");
                  } else {
                    setSubmitError("Error al conectarse con el servidor.");
                  }
                } catch (error) {
                  setSubmitError("Error al conectarse con el servidor.");
                  console.error("Error al conectarse con el servidor.", error);
                }
              }}
              validationSchema={formSchema}
            >
              {({ errors, touched, handleSubmit }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    {/* input de name Partida */}
                    <FormControl
                      isInvalid={
                        !!errors.nombrePartida && touched.nombrePartida
                      } //hubo error y el campo fue tocado
                      data-testid="nombrePartida"
                    >
                      <FormLabel htmlFor="nombrePartida">
                        Nombre Partida
                      </FormLabel>
                      <Field
                        as={Input}
                        name="nombrePartida"
                        type="text"
                        id="nombrePartida"
                        data-testid="nombrePartidaInput"
                      />
                      <FormErrorMessage data-testid="nombrePartidaErrormsj">
                        {errors.nombrePartida}
                      </FormErrorMessage>
                    </FormControl>
                    {/* input n jugador  */}
                    <FormControl
                      isInvalid={
                        !!errors.nombreJugador && touched.nombreJugador
                      } //hubo error y el campo fue tocado
                      data-testid="nombreJugador"
                    >
                      <FormLabel htmlFor="nombreJugador">
                        Nombre Jugador
                      </FormLabel>
                      <Field
                        as={Input}
                        name="nombreJugador"
                        type="text"
                        id="nombreJugador"
                        data-testid="nombreJugadorInput"
                      />

                      <FormErrorMessage data-testid="nombreJugadorErrorMessage">
                        {errors.nombreJugador}
                      </FormErrorMessage>
                    </FormControl>
                    {/* input de jugadores minimos  */}
                    <FormControl
                      isInvalid={!!errors.minPlayers && touched.minPlayers} //hubo error y el campo fue tocado
                      data-testid="minPlayers"
                    >
                      <FormLabel htmlFor="minPlayers">
                        Minimo de Jugadores
                      </FormLabel>
                      <Field
                        as={Input}
                        name="minPlayers"
                        type="text"
                        id="minPlayers"
                        data-testid="minPlayersInput"
                      />
                      <FormErrorMessage data-testid="minPlayersErrorMessage">
                        {errors.minPlayers}
                      </FormErrorMessage>
                    </FormControl>
                    {/* input de jugadores maximos  */}
                    <FormControl
                      isInvalid={!!errors.maxPlayers && touched.maxPlayers} //hubo error y el campo fue tocado
                      data-testid="maxPlayers"
                    >
                      <FormLabel htmlFor="maxPlayers">
                        Maximo de Jugadores
                      </FormLabel>
                      <Field
                        as={Input}
                        name="maxPlayers"
                        type="text"
                        id="maxPlayers"
                        data-testid="maxPlayersInput"
                      />
                      <FormErrorMessage data-testid="maxPlayersErrorMessage">
                        {errors.maxPlayers}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={submitError != null}
                      data-testid="submitErrorFormControl"
                    >
                      <FormErrorMessage data-testid="submitErrorErrorMessage">
                        {submitError}
                      </FormErrorMessage>
                    </FormControl>
                    <Flex justify="flex-end" align="center" mt="5">
                      <Button type="submit" colorScheme="green" mr={3}>
                        Crear Partida
                      </Button>
                    </Flex>
                  </form>
                );
              }}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default NewGameModal;
