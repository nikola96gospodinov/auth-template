import { CardWrapper } from "./card-wrapper.component";

export const LoginForm = () => {
  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      Login Form
    </CardWrapper>
  );
};
