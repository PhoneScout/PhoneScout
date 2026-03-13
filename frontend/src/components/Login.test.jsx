import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import { AuthProvider } from "./AuthContext";
import { vi } from "vitest";

vi.mock("axios");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("./InputText", () => ({
  default: function MockInputText({ id, label, type, onChange, value }) {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input 
          id={id}
          type={type || "text"}
          onChange={onChange}
          value={value}
        />
      </div>
    );
  },
}));

const renderLoginWithProviders = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login onSwitchToRegister={vi.fn()} />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Login komponens tesztek", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    const mockDigest = vi.fn().mockResolvedValue(new ArrayBuffer(32));
    vi.stubGlobal("crypto", {
      subtle: {
        digest: mockDigest,
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("sikeres bejelentkezés végrehajt egy navigációt", async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: "testsalt123",
    });

    axios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        token: "mock-jwt-token",
        userID: 1,
        firstname: "Teszt",
        lastname: "Felhasználó",
        email: "teszt@email.com",
      },
    });

    renderLoginWithProviders();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/jelszó/i);
    const submitButton = screen.getByRole("button", { name: /bejelentkezés/i });

    fireEvent.change(emailInput, { target: { value: "teszt@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:5175/api/Login/GetSalt/teszt%40email.com"
      );
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5175/api/Login",
        expect.objectContaining({
          email: "teszt@email.com",
        })
      );
    });
  });
});
