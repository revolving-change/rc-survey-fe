import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import axios from "../components/api";

const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const formValues = {
      email: email,
      password: password,
    };

    try {
      await axios.post("/api/login", formValues).then((response) => {
        if (response.data.token !== undefined) {
          setCookie("user", response.data.user, { path: "/" });
          setCookie("token", response.data.token, { path: "/" });
          navigate("/forms");
        }
      });
    } catch (error) {
      setErrorMessage("Unauthorized");
      console.log(error);
    }
  };

  useEffect(() => {
    if (cookies.token !== undefined) {
      navigate("/forms");
    }
  }, []);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <form onSubmit={onSubmit}>
          <Typography sx={{ mb: 5, fontSize: 24, fontWeight: 600 }}>
            Log in
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              color: "red",
            }}
          >
            {errorMessage}
          </Box>
          <Button
            onClick={onSubmit}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              mb: 2,
              "&:hover": {
                backgroundColor: "#edf5e1",
                color: "black",
              },
            }}
          >
            LOG IN
          </Button>
        </form>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
