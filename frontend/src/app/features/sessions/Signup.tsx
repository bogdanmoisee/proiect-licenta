import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormGroup,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetErrorState, signUpUser } from "./sessionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { globalStyles, theme } from "../../utils/Theme";

function Signup() {
  const emailRef = useRef<HTMLInputElement>();
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const passwordConfirmationRef = useRef<HTMLInputElement>();
  const errorMessages = useAppSelector((state) => state.session.errorMessages);

  const [errors, setErrors] = useState<Array<string>>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const loading = false;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    emailRef?.current?.focus();
    if (errorMessages !== undefined) {
      setErrors(errorMessages);
      dispatch(resetErrorState());
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    if (
      emailRef?.current === undefined ||
      emailRef.current.value === "" ||
      usernameRef?.current === undefined ||
      usernameRef.current.value === "" ||
      passwordRef?.current === undefined ||
      passwordRef.current.value === "" ||
      passwordConfirmationRef?.current === undefined ||
      passwordConfirmationRef.current.value === ""
    ) {
      return setErrors(["Please fill out all fields"]);
    }
    if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
      return setErrors(["Passwords do not match"]);
    }
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      username: usernameRef.current.value,
    };
    const response = await dispatch(signUpUser(payload) as any);

    console.log(response);
    if (response.error) {
      return setErrors(response.payload);
    } else {
      navigate("/");
    }
  }

  const passwordInput = (
    <OutlinedInput
      id="password"
      label="Password"
      type={showPassword ? "text" : "password"}
      inputRef={passwordRef}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setShowPassword(!showPassword)}
            onMouseDown={() => setShowPassword(!showPassword)}
            edge="end"
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      }
    />
  );

  const passwordConfirmationInput = (
    <OutlinedInput
      label="Password Confirmation"
      id="password-confirmation"
      type={showPassword ? "text" : "password"}
      inputRef={passwordConfirmationRef}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setShowPassword(!showPassword)}
            onMouseDown={() => setShowPassword(!showPassword)}
            edge="end"
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      }
    />
  );

  return (
    <ThemeProvider theme={theme}>
      {globalStyles}
      <section style={{ marginTop: "2em" }}>
        <Container maxWidth="md">
          <Card sx={{ boxShadow: 1, maxWidth: "md" }}>
            <CardContent>
              <Container maxWidth="sm">
                <Typography variant="h2" color="text.primary" gutterBottom>
                  Sign Up
                </Typography>
                {errors.length > 0 ? (
                  <Alert severity="error" aria-live="assertive">
                    {errors.map((error, index) => {
                      return <p key={`alert-${index}`}>{error}</p>;
                    })}
                  </Alert>
                ) : (
                  <></>
                )}
                <form onSubmit={handleSubmit}>
                  <FormGroup
                    row={true}
                    id="email-group"
                    sx={{ marginTop: "1em" }}
                  >
                    <FormControl fullWidth>
                      <InputLabel required htmlFor="email" id="email-label">
                        Email Address
                      </InputLabel>
                      <Input id="email" type="email" inputRef={emailRef} />
                      <FormHelperText id="email-helper-text">
                        We&apos;ll never share your email.
                      </FormHelperText>
                    </FormControl>
                  </FormGroup>
                  <FormGroup
                    row={true}
                    id="username-group"
                    sx={{ marginTop: "1em" }}
                  >
                    <FormControl fullWidth>
                      <InputLabel
                        required
                        htmlFor="username"
                        id="username-label"
                      >
                        Username
                      </InputLabel>
                      <Input id="username" type="text" inputRef={usernameRef} />
                    </FormControl>
                  </FormGroup>
                  <FormGroup
                    row={true}
                    id="password-group"
                    sx={{ marginTop: "1em" }}
                  >
                    <FormControl fullWidth>
                      <InputLabel
                        required
                        htmlFor="password"
                        id="password-label"
                      >
                        Password
                      </InputLabel>
                      {passwordInput}
                    </FormControl>
                  </FormGroup>
                  <FormGroup
                    row={true}
                    id="password-confirmation-group"
                    sx={{ marginTop: "1em" }}
                  >
                    <FormControl fullWidth>
                      <InputLabel
                        required
                        htmlFor="password-confirmation"
                        id="password-confirmation-label"
                      >
                        Password Confirmation
                      </InputLabel>
                      {passwordConfirmationInput}
                    </FormControl>
                  </FormGroup>
                  <FormGroup
                    row={true}
                    id="submit-group"
                    sx={{ marginTop: "1em" }}
                  >
                    <FormControl fullWidth>
                      <Button
                        disabled={loading}
                        variant="contained"
                        color="primary"
                        type="submit"
                        id="submit-button"
                      >
                        Create Account
                      </Button>
                    </FormControl>
                  </FormGroup>
                </form>
              </Container>
            </CardContent>
            <Divider light={false} />
            <CardActions
              sx={{ marginTop: "1em", justifyContent: "center" }}
              disableSpacing
            >
              <Box>
                Already have an account? <Link to="/login">Login!</Link>
              </Box>
            </CardActions>
          </Card>
        </Container>
      </section>
    </ThemeProvider>
  );
}

export default Signup;
