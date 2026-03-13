import React from "react";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import PhoneCard from "./PhoneCard";
import { vi } from "vitest";

vi.mock("axios");

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("PhoneCard komponens tesztek", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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
