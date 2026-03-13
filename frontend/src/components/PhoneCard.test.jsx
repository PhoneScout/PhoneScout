import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import PhoneCard from "./PhoneCard";
import { vi } from "vitest";

const logCurrentTest = (type) => {
  const testName = expect.getState().currentTestName ?? "ismeretlen teszt";
  console.log(`[${type}] ${testName}`);
};

// Mock axios module.
vi.mock("axios");

// Render component with router.
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("PhoneCard komponens tesztek", () => {
  beforeEach(() => {
    // Reset state before each test.
    localStorage.clear();
    vi.clearAllMocks();
    logCurrentTest("UNIT/PhoneCard");
  });

  test("betölti a telefon képét az API-ból", async () => {
    const mockBlob = new Blob(["fake image"], { type: "image/jpeg" });
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: mockBlob,
    });

    renderWithRouter(
      <PhoneCard
        phoneId={5}
        phoneName="iPhone 15"
        phoneInStore={true}
        phonePrice={399990}
        colors={[]}
        ramStoragePairs={[]}
      />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:5175/api/blob/GetIndex/5",
        { responseType: "blob" }
      );
    });
  });
});
