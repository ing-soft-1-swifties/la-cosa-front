import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import Index from "@/src/pages/index";
import { SiteApp } from "@/src/pages/_app";
import { Box } from "@chakra-ui/react";
import { act } from "react-dom/test-utils";

// Mock Next Router for all tests.
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

describe("App _app", () => {
  it("renders", () => {
    renderWithProviders(
      <SiteApp>
        <Box>Tester</Box>
      </SiteApp>
    );
  });
  it("renders inner page", async () => {
    await act(async () => {
      renderWithProviders(
        <SiteApp>
          <Index />
        </SiteApp>
      );
    });
    screen.getByText("LA COSA");
  });
});
