import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import axios from "../components/api";

const Header = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  let navigate = useNavigate();

  const onLogout = async (e) => {
    e.preventDefault();

    try {
      await axios
        .post(
          "/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        )
        .then(() => {
          removeCookie("user", { path: "/" });
          removeCookie("token", { path: "/" });
          navigate("/");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ bgcolor: "#141962", color: "white" }}
    >
      <Toolbar>
        <Typography
          align="left"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1, fontSize: 24 }}
        >
          REVOLVING CHANGE | Survey Forms
        </Typography>
        <nav>
          <Link
            variant="button"
            color="text.primary"
            href="/"
            underline="none"
            onClick={onLogout}
            sx={{
              my: 1,
              mx: 1.5,
              color: "white",
              "&:hover": {
                color: "#BB6464",
              },
            }}
          >
            Logout
          </Link>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
