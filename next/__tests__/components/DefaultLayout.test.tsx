import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "@/src/utils/test-utils";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Box, Text } from "@chakra-ui/react";

describe("Component Default Layout", () => {
  it("renders with children", () => {
    renderWithProviders(
      <DefaultLayout>
        <Box>
          <Text>Nested text</Text>
        </Box>
      </DefaultLayout>
    );
    screen.getByText("Nested text");
  });
});
