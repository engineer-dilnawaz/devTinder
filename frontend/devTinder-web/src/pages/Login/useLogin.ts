import { useReducer, type ChangeEvent } from "react";

type State = {
  email: string;
  password: string;
  error: {
    emailError: string;
    passwordError: string;
  };
  loading: boolean;
};

const initialState: State = {
  email: "",
  password: "",
  error: {
    emailError: "",
    passwordError: "",
  },
  loading: false,
};

type Action =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | {
      type: "SET_ERROR";
      payload: { emailError: string; passwordError: string };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET_FORM" };

const loginReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
        error: { ...state.error, emailError: "" },
      };
    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
        error: { ...state.error, passwordError: "" },
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "RESET_FORM":
      return { ...initialState, email: "", password: "" };
    default:
      return state;
  }
};

export const useLogin = () => {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const setEmail = (ev: ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: "SET_EMAIL", payload: ev.target.value });

  const setPassword = (ev: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: "SET_PASSWORD", payload: ev.target.value });

  const setLoading = (loading: boolean) =>
    dispatch({ type: "SET_LOADING", payload: loading });

  const setError = (error: State["error"]) =>
    dispatch({ type: "SET_ERROR", payload: error });

  const resetForm = () => dispatch({ type: "RESET_FORM" });

  const handleSubmit = () => {
    if (email.trim() === "" || password.trim() === "") {
      setError({
        emailError: email.trim() === "" ? "Email is required" : "",
        passwordError: password.trim() === "" ? "Password is required" : "",
      });
      return;
    }
    console.log(email, password);
    resetForm();
  };

  const { email, password, error, loading } = state;

  return {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    setLoading,
    setError,
    handleSubmit,
  };
};
