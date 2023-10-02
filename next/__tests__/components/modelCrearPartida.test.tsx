import { screen } from "@testing-library/react";
import ModalPP from "@/src/components/modalCrearPartida";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import { RootState } from "store/store";
import { PreloadedState } from "@reduxjs/toolkit";
import { GameStatus } from "@/store/gameSlice";
import mockRouter from "next-router-mock";
import { act } from "react-dom/test-utils";

describe("component modelCrearPartida ")