export function Jest_BeforeAll_MockNextRouter() {
  jest.mock("next/router", () => jest.requireActual("next-router-mock"));
}

