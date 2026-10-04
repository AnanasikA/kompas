export interface Credentials {
  email: string;
  password: string;
  consent: boolean;
}

export type CredentialErrors = Partial<Record<keyof Credentials, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCredentials(values: Credentials, mode: "signup" | "login"): CredentialErrors {
  const errors: CredentialErrors = {};
  if (!EMAIL.test(values.email.trim())) errors.email = "Wpisz poprawny adres e-mail, np. anna@poczta.pl.";
  if (values.password.length < 6) errors.password = "Hasło musi mieć co najmniej 6 znaków.";
  if (mode === "signup" && !values.consent) errors.consent = "Zaznacz zgodę, żeby założyć konto.";
  return errors;
}
