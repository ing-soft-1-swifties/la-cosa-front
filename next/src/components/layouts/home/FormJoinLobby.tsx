import {
  Button,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import router, { Router } from "next/router";
import React, { useState } from "react";
import { setGameConnectionToken } from "store/userSlice";
import * as Yup from "yup";

const formSchema = Yup.object({
  room_id: Yup.number().required("Este campo es requerido"),
  name: Yup.string()
    .required("Este campo es requerido")
    .max(50, "La cantidad maxima de caracteres es 50")
    .min(3, "La cantidad minima de caracteres es 3"),
});

export default function FormJoinLobby() {
  const initialRef = React.useRef(null); //esto es para que cuando se abra el modal, el foco vaya al primer input
  const finalRef = React.useRef(null);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  return (
    <>
      <Formik
        initialValues={{ room_id: null, name: "" }}
        onSubmit={async (values) => {
          console.log(values); //valores del formulario
          setSubmitError(undefined);
          try {
            const response = await fetch("http://localhost:8000/join", {
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
              console.log("Respuesta del servidor:", data);
              setGameConnectionToken(data.token);
              router.replace("/lobby");
            } else if(response.status == 400) {
              setSubmitError("Nombre de jugador ya asignado en la partida.");
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
              {/* input name jugador  */}
              <FormControl
                isInvalid={!!errors.name && touched.name} //hubo error y el campo fue tocado
              >
                <FormLabel htmlFor="name" color="white">
                  Nombre{" "}
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
                  {" "}
                  ID de partida{" "}
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
              <Button colorScheme="blue" type="submit" mt={4} mr={3}>
                Entrar Partida
              </Button>
            </form>
          );
        }}
      </Formik>
    </>
  );
}
