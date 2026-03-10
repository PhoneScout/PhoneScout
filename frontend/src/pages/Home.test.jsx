import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Home from "./Home";
import { vi } from "vitest";

const logCurrentTest = (type) => {
  const testName = expect.getState().currentTestName ?? "ismeretlen teszt";
  console.log(`[${type}] ${testName}`);
};

// Mock-oljuk az axios-t
vi.mock("axios");

// Mock PhoneCard komponens
vi.mock("../components/PhoneCard", () => ({
  default: function MockPhoneCard({ phoneName, phonePrice }) {
    return (
      <div>
        <div>{phoneName}</div>
        <div>{phonePrice} Ft</div>
      </div>
    );
  },
}));

// Mock Navbar komponens
vi.mock("../components/Navbar", () => ({
  default: function MockNavbar() {
    return <nav>Mock Navbar</nav>;
  },
}));

// Mock InputText komponens
vi.mock("../components/InputText", () => ({
  default: function MockInputText(props) {
    return <input {...props} />;
  },
}));

// Mock react-router Link komponens
vi.mock("react-router", () => ({
  Link: function MockLink({ to, children, ...props }) {
    return <a href={to} {...props}>{children}</a>;
  },
}));

const renderHomeWithRouter = () => {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
};

describe("Home oldal tesztek", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    logCurrentTest("UNIT/Home");
  });

  test("betölti és megjeleníti a telefonokat a GET kérés után", async () => {
    const mockPhones = [
      {
        phoneID: 1,
        phoneName: "Samsung Galaxy S24",
        price: 299990,
        inStore: 1,
        colors: [],
        ramStoragePairs: [],
      },
      {
        phoneID: 2,
        phoneName: "iPhone 15 Pro",
        price: 449990,
        inStore: 1,
        colors: [],
        ramStoragePairs: [],
      },
    ];

    const mockEvents = [];

    // Mock axios hívások
    axios.get.mockImplementation((url) => {
      if (url.includes("mainPage")) {
        return Promise.resolve({ data: mockPhones });
      }
      if (url.includes("event")) {
        return Promise.resolve({ data: mockEvents });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    renderHomeWithRouter();

    // Várjuk meg, hogy a telefonok megjelenjenek
    await waitFor(() => {
      expect(screen.getByText("Samsung Galaxy S24")).toBeInTheDocument();
    });

    expect(screen.getByText("iPhone 15 Pro")).toBeInTheDocument();
  });
});
