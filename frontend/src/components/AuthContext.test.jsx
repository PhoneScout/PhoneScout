import React from "react";
import { render, screen, renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import { vi } from "vitest";

const logCurrentTest = (type) => {
  const testName = expect.getState().currentTestName ?? "ismeretlen teszt";
  console.log(`[${type}] ${testName}`);
};

describe("AuthContext tesztek", () => {
  beforeEach(() => {
    localStorage.clear();
    logCurrentTest("UNIT/Auth");
  });

  test("login menti a tokent localStorage-ba", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login("new-token-456");
    });

    expect(localStorage.getItem("userToken")).toBe("new-token-456");
  });

  test("logout törli a tokent localStorage-ból", () => {
    localStorage.setItem("userToken", "token-1");

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("userToken")).toBeNull();
  });
});
