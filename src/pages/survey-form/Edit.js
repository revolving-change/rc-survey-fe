import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import axios from "../../components/api";
import Header from "../../components/Header";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorQuestion, setErrorQuestion] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [surveyForm, setSurveyForm] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [cookies] = useCookies(["user"]);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={() => navigate("/forms")}
    >
      Forms
    </Link>,
    <Typography key="2" color="text.primary">
      Edit
    </Typography>,
  ];

  const getData = async () => {
    try {
      await axios
        .get(`/api/view-form/${parseInt(id)}`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setQuestions(response.data.survey_questions);
            setSurveyForm(response.data.survey_form);
            setTitle(response.data.survey_form.form_title);
          }
        });
      setQuestions((questions) => [
        ...questions,
        { question: "", highest_answer: "", id: null },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (cookies.token) getData();
    else navigate("/");
  }, []);

  const highestOption = [
    {
      label: "SA",
      value: "SA",
    },
    {
      label: "SD",
      value: "SD",
    },
  ];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccess(false);
    setOpenWarning(false);
  };

  const handleSetQuestion = (index) => (e) => {
    let newData = [...questions];
    newData[index]["question"] = e.target.value;
    setQuestions(newData);
  };

  const handleSetHighest = (index) => (e) => {
    let newData = [...questions];
    newData[index]["highest_answer"] = e.target.value;
    setQuestions(newData);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, _index) => _index !== index));
  };

  const onSubmit = async () => {
    let error = false;

    setSubmitted(true);

    if (!title) {
      setErrorTitle(true);
      error = true;
    }

    if (
      (questions.length > 0 && !questions[0].question) ||
      !questions[0].highest_answer
    ) {
      setErrorQuestion(true);
      error = true;
    }

    if (error) {
      return;
    }

    try {
      const response = await axios
        .post(
          `/api/edit-form/${id}`,
          {
            form_title: title,
            questions: questions.filter(
              ({ question, highest_answer }) =>
                question !== "" && highest_answer !== ""
            ),
          },
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        )
        .then(() => {
          setSubmitted(false);
          getData();
          setOpenSuccess(true);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (title) setErrorTitle(false);
  }, [title]);

  useEffect(() => {
    setErrorQuestion(false);
  }, [JSON.stringify(questions)]);

  return (
    <>
      <Header />

      <Container maxWidth="xl">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mt: 2 }}
        >
          {breadcrumbs}
        </Breadcrumbs>
        <Box
          sx={{
            p: 4,
            mb: 10,
          }}
        >
          <Typography
            id="modal-modal-title"
            sx={{
              fontWeight: "bold",
              fontSize: 24,
              mb: 1,
              display: "flex",
            }}
          >
            Edit Form: {surveyForm.form_title}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
              display: "flex",
            }}
          >
            Course ID: {surveyForm.course_id}
          </Typography>
          <TextField
            fullWidth
            id="outlined-multiline-flexible"
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            error={errorTitle}
            helperText={errorTitle ? "Title is required" : ""}
            sx={{ mb: 2, mt: 2 }}
          />
          <Typography
            id="modal-modal-title"
            component="h3"
            sx={{ mb: 1, display: "flex", fontWeight: 700 }}
          >
            Questions
          </Typography>
          <FormHelperText sx={{ ml: 2, color: "green", fontSize: 14 }}>
            Requires at least 1 survey question
          </FormHelperText>
          {questions.map(({ question, highest_answer }, index) => (
            <Grid container spacing={1} sx={{ mt: 0.5 }} key={index}>
              <Grid item xs={8.5}>
                <TextField
                  fullWidth
                  id="outlined-multiline-flexible"
                  label={`Question #${index + 1}`}
                  value={question}
                  onChange={handleSetQuestion(index)}
                />
              </Grid>
              <Grid item xs={2.5}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Highest</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={highest_answer}
                    label="Highest"
                    onChange={handleSetHighest(index)}
                  >
                    {highestOption.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {index === questions.length - 1 ? (
                  <IconButton
                    onClick={() =>
                      setQuestions((questions) => [
                        ...questions,
                        { question: "", highest_answer: "", id: null },
                      ])
                    }
                  >
                    <AddCircleOutlineIcon
                      fontSize="medium"
                      sx={{
                        "&:hover": { color: "green" },
                        color: "rgb(38, 37, 77)",
                      }}
                    />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleRemoveQuestion(index)}>
                    <HighlightOffIcon
                      fontSize="medium"
                      sx={{
                        "&:hover": { color: "green" },
                        color: "rgb(207, 36, 49)",
                      }}
                    />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          <FormHelperText sx={{ ml: 2, color: "#d32f2f" }}>
            {errorQuestion ? "Question is Required" : ""}
          </FormHelperText>
          <Button
            variant="outlined"
            sx={{ borderColor: "rgb(38, 37, 77)", mt: 2 }}
            onClick={onSubmit}
          >
            {submitted && <CircularProgress size="2vh" sx={{ mr: 1 }} />}
            <Typography
              id="modal-modal-title"
              variant="h7"
              component="h3"
              sx={{ color: "rgb(38, 37, 77)" }}
            >
              SUBMIT
            </Typography>
          </Button>
          <Snackbar
            open={openSuccess}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Successfully saved survey form.
            </Alert>
          </Snackbar>
          <Snackbar
            open={openWarning}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="warning"
              sx={{ width: "100%" }}
            >
              Form was not saved.
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </>
  );
};

export default Edit;
