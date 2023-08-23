import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormGroup,
  GlobalStyles,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  ThemeProvider,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { createRef, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  resetErrorState,
  selectAccessToken,
  setAvatar,
  updateProfile,
} from "./sessionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { storage } from "../../../firebase.config";
import { globalStyles, theme } from "../../utils/Theme";

const FileInput = styled("input")({
  display: "none",
});

function UpdateProfile() {
  const emailRef = useRef<HTMLInputElement>();
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const passwordConfirmationRef = useRef<HTMLInputElement>();
  const currentPasswordRef = useRef<HTMLInputElement>();

  const accessToken = useAppSelector(selectAccessToken);
  const errorMessages = useAppSelector((state) => state.session.errorMessages);
  const currentUser = useAppSelector((state) => state.session.currentUser);

  const [errors, setErrors] = useState<Array<string>>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);

  const loading = false;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const fileInputRef = createRef<HTMLInputElement>();

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
    let hasErrors = false;

    if (
      currentPasswordRef?.current?.value === undefined ||
      currentPasswordRef?.current?.value === ""
    ) {
      setErrors(["Please enter your current password to confirm your changes"]);
      hasErrors = true;
    }

    if (
      passwordRef.current &&
      passwordConfirmationRef.current &&
      passwordRef.current.value !== passwordConfirmationRef.current.value
    ) {
      setErrors((errors) => [...errors, "Passwords do not match"]);
      hasErrors = true;
    }

    if (hasErrors) {
      return errors;
    }

    const payload = {
      currentPassword: currentPasswordRef!.current!.value,
      token: accessToken,
      email: emailRef?.current?.value,
      username: usernameRef?.current?.value,
      password: passwordRef?.current?.value,
      avatar_url: currentUser?.avatar_url,
    };

    const response = await dispatch(updateProfile(payload) as any);

    if (response.error) {
      return setErrors(response.payload);
    } else {
      navigate("/");
    }
  }

  const passwordInput = (
    <OutlinedInput
      id="password"
      label="New Password"
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
      label="New Password Confirmation"
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

  const currentPasswordInput = (
    <OutlinedInput
      label="Current Password"
      id="current-password"
      type={showCurrentPassword ? "text" : "password"}
      inputRef={currentPasswordRef}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            onMouseDown={() => setShowCurrentPassword(!showCurrentPassword)}
            edge="end"
          >
            {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      }
    />
  );

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          dispatch(setAvatar(downloadURL));
        });
      }
    );
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <ThemeProvider theme={theme}>
      {globalStyles}
      <section style={{ marginTop: "2em" }}>
        <Container maxWidth="md">
          <Card sx={{ boxShadow: 1, maxWidth: "md" }}>
            <CardContent>
              <Container maxWidth="sm">
                <Typography
                  variant="h2"
                  color="text.primary"
                  align="center"
                  gutterBottom
                >
                  Update Profile
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
                  <Grid container spacing={2} sx={{ mt: "10px" }}>
                    <Grid item xs={12} sm={6}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                      >
                        <Avatar
                          src={currentUser?.avatar_url}
                          alt="Profile"
                          style={{ width: "250px", height: "250px" }}
                        />
                        <FileInput
                          ref={fileInputRef}
                          accept="image/*"
                          type="file"
                          onChange={handleFileChange}
                        />
                        <Button onClick={handleFileClick} sx={{ mt: "5px" }}>
                          <Typography variant="body1">
                            Edit your profile picture
                          </Typography>
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <FormGroup id="email-group" sx={{ mt: "20px" }}>
                          <FormControl fullWidth>
                            <InputLabel htmlFor="email" id="email-label">
                              Email Address
                            </InputLabel>
                            <Input
                              id="email"
                              type="email"
                              inputRef={emailRef}
                              style={{ color: "#ffffff" }}
                              defaultValue={currentUser.email}
                            />
                          </FormControl>
                        </FormGroup>
                        <FormGroup id="username-group" sx={{ mt: "20px" }}>
                          <FormControl fullWidth>
                            <InputLabel htmlFor="username" id="username-label">
                              Username
                            </InputLabel>
                            <Input
                              id="username"
                              type="text"
                              inputRef={usernameRef}
                              defaultValue={currentUser.username}
                            />
                          </FormControl>
                        </FormGroup>
                      </Box>
                    </Grid>
                  </Grid>

                  <FormGroup
                    row={true}
                    id="current-password-group"
                    sx={{ marginTop: "1em" }}
                  >
                    <FormControl fullWidth>
                      <InputLabel
                        required
                        htmlFor="current-password"
                        id="current-password-label"
                      >
                        Current Password
                      </InputLabel>
                      {currentPasswordInput}
                    </FormControl>
                  </FormGroup>
                  <FormGroup
                    row={true}
                    id="password-group"
                    sx={{ marginTop: "1em" }}
                  >
                    <FormControl fullWidth>
                      <InputLabel htmlFor="password" id="password-label">
                        New Password
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
                        htmlFor="password-confirmation"
                        id="password-confirmation-label"
                      >
                        New Password Confirmation
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
                        sx={{ mt: "10px" }}
                      >
                        Save Changes
                      </Button>
                    </FormControl>
                  </FormGroup>
                </form>
              </Container>
            </CardContent>
            <Divider light={false} />
          </Card>
        </Container>
      </section>
    </ThemeProvider>
  );
}

export default UpdateProfile;
