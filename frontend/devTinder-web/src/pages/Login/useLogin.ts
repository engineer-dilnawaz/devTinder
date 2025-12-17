import { useReducer, type ChangeEvent } from "react";
import { useLoginMutation } from "../../services/queries/auth.queries";

type State = {
  email: string;
  password: string;
  error: {
    emailError: string;
    passwordError: string;
  };
};

const initialState: State = {
  email: "",
  password: "",
  error: {
    emailError: "",
    passwordError: "",
  },
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
    case "RESET_FORM":
      return { ...initialState, email: "", password: "" };
    default:
      return state;
  }
};

export const useLogin = () => {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const { email, password, error } = state;
  const {
    mutate: mutateLogin,
    isPending,
    data: mutationData,
    error: mutationError,
  } = useLoginMutation();

  const setEmail = (ev: ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: "SET_EMAIL", payload: ev.target.value });

  const setPassword = (ev: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: "SET_PASSWORD", payload: ev.target.value });

  const setError = (error: State["error"]) =>
    dispatch({ type: "SET_ERROR", payload: error });

  const handleSubmit = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError({
        emailError: email.trim() === "" ? "Email is required" : "",
        passwordError: password.trim() === "" ? "Password is required" : "",
      });
      return;
    }
    mutateLogin(
      { emailId: email, password },
      {
        onSuccess: () => {
          dispatch({ type: "RESET_FORM" });
        },
        onError: (error) => {
          console.log("Error: ", error);
        },
      }
    );
  };

  return {
    email,
    password,
    error,
    mutationError,
    mutationData,
    loading: isPending,
    setEmail,
    setPassword,
    handleSubmit,
  };
};
