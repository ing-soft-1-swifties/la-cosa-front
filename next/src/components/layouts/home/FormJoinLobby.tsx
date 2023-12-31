import {
  Button,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Box,
  Text,
} from "@chakra-ui/react";
import { joinPlayerToGame } from "@/src/business/game/gameAPI/manager";
import { Field, Formik } from "formik";
import router from "next/router";
import React, {  useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { SERVER_API_URL } from "@/src/config";
import { setLobbyFormFieldSetter } from "@/store/userSlice";

const formSchema = Yup.object({
  room_id: Yup.number().required("Este campo es requerido"),
  name: Yup.string()
    .required("Este campo es requerido")
    .max(50, "La cantidad maxima de caracteres es 50")
    .min(3, "La cantidad minima de caracteres es 3"),
});

export default function FormJoinLobby() {
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();
  return (
    <>
      <Box
        minW="100%"
        // border="4px"
        // borderColor="white"
        // borderRadius="2xl"
        pt={4}
        pb={6}
        px={8}
        data-testid="form-join-lobby"
      >
        <Text
          textAlign="center"
          data-testid="form-join-lobby_titulo"
          pb={4}
          fontSize="3xl"
          color="white"
        >
          Unirse a una partida
        </Text>

        <Formik
          initialValues={{ room_id: "", name: "" }}
          onSubmit={async (values) => {
            setSubmitError(undefined);
            try {
              const response = await fetch(`${SERVER_API_URL}/join`, {
                method: "POST", //Envia los datos a la api
                headers: {
                  //le dice al servidor que tipo de datos se estan enviando
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: values.name,
                  room_id: values.room_id,
                }),
              });
              if (response.ok) {
                const data: { token: string } = await response.json(); //convierte los datos a json
                joinPlayerToGame(values.name, data.token, router);
              } else if (response.status == 400) {
                const data = await response.json(); //obtiene el error
                console.log(data);
                if (data.detail === "Duplicate player name") {
                  // El nombre de jugador está duplicado
                  setSubmitError("El nombre de jugador ya está en uso.");
                }
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
          {({ errors, touched, handleSubmit, setFieldValue }) => {
            dispatch(setLobbyFormFieldSetter(setFieldValue));
            return (
              <form onSubmit={handleSubmit}>
                {/* input name jugador  */}
                <FormControl
                  isInvalid={!!errors.name && touched.name} //hubo error y el campo fue tocado
                >
                  <FormLabel htmlFor="name" color="white">
                    Nombre
                  </FormLabel>
                  <Field
                    color="white"
                    as={Input}
                    name="name"
                    type="text"
                    id="name"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                {/* input de jugadores minimos  */}
                <FormControl
                  isInvalid={!!errors.room_id && touched.room_id} //hubo error y el campo fue tocado
                >
                  <FormLabel htmlFor="room_id" pt={4} color="white">
                    ID de partida
                  </FormLabel>
                  <Field
                    color="white"
                    as={Input}
                    name="room_id"
                    type="text"
                    id="room_id"
                  />
                  <FormErrorMessage>{errors.room_id}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={submitError != null}>
                  <FormErrorMessage>{submitError}</FormErrorMessage>
                </FormControl>
                <Button
                  id="join_lobby_button"
                  colorScheme="blue"
                  type="submit"
                  mt={4}
                  mr={3}
                >
                  Entrar Partida
                </Button>
              </form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
}
