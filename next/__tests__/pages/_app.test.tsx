import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import Index from "@/src/pages/index";
import { SiteApp } from "@/src/pages/_app";
import { Box } from "@chakra-ui/react";

describe("App _app", () => {
  it("renders", () => {
    renderWithProviders(
      <SiteApp>
        <Box>Tester</Box>
      </SiteApp>
    );
  });
  it("renders inner page", () => {
    renderWithProviders(
      <SiteApp>
        <Index />
      </SiteApp>
    );
    screen.getByText("Welcome to La Cosa");
  });
});
