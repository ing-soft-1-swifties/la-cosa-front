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
import router, { Router } from "next/router";
import React, { useState } from "react";
import * as Yup from "yup";

const formSchema = Yup.object({
  room_id: Yup.number()
    .required("Este campo es requerido"),
  name: Yup.string()
    .required("Este campo es requerido")
    .max(50, "La cantidad maxima de caracteres es 50")
    .min(3, "La cantidad minima de caracteres es 3"),
});

const [submitError, setSubmitError] = useState<String|undefined>(undefined);

const enviarDatosServ = async (values: {
  room_id: any;
  name: any;
}) => {
  try {
    const response = await fetch("http://localhost:8000", {
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
      const data = await response.json(); //convierte los datos a json
      console.log("Respuesta del servidor:", data);
      
      setGameConnectionToken(data.token)
      router.replace("/lobby")

    } else {
      setSubmitError("Error al conectarse con el servidor.");
    }
  } catch (error) {
    setSubmitError("Error al conectarse con el servidor.");
    console.error("Error al conectarse con el servidor.", error);
  }
};

export default function FormJoinLobby() {

  const initialRef = React.useRef(null); //esto es para que cuando se abra el modal, el foco vaya al primer input
  const finalRef = React.useRef(null);

  return (
    <>

      <Formik
        initialValues={{ room_id: null, name: "" }}
        onSubmit={(values) => {
          console.log(values); //valores del formulario
          enviarDatosServ(values); //envia los datos a la api
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
                <FormLabel htmlFor="name" color='white' >Nombre </FormLabel>
                <Field as={Input} name="name" type="text" id="name" />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>
              {/* input de jugadores minimos  */}
              <FormControl
                isInvalid={!!errors.room_id && touched.room_id} //hubo error y el campo fue tocado
              >
                <FormLabel htmlFor="room_id" pt={4} color='white'> ID de partida </FormLabel>
                <Field
                  as={Input}
                  name="room_id"
                  type="text"
                  id="room_id"

                />
                <FormErrorMessage>{errors.room_id}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={submitError != undefined}
              >
                <FormErrorMessage>
                  {submitError}
                </FormErrorMessage>
              </FormControl>
              
            </form>
          );
        }}
      </Formik>
      <Button colorScheme="blue" type='submit' mt={4} mr={3}>
        Entrar Partida
      </Button>
    </>
  );
}
