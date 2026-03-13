import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

describe("AuthContext tesztek", () => {
  beforeEach(() => {
    localStorage.clear();
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
