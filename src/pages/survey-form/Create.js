import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

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

import axios from "../../components/api";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Create = (props) => {
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", highest_answer: "" },
  ]);
  const [errorCourse, setErrorCourse] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorQuestion, setErrorQuestion] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [cookies] = useCookies(["user"]);

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

  const handleChange = (event) => {
    setSelectedCourse(event.target.value);
  };

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

  const reset = () => {
    setSelectedCourse(0);
    setTitle("");
    setQuestions([{ question: "", highest_answer: "" }]);
  };

  const onSubmit = async () => {
    let error = false;

    if (!selectedCourse) {
      setErrorCourse(true);
      error = true;
    }

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
      const response = await axios.post(
        "/api/create-survey-form",
        {
          course_id: selectedCourse,
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
      );

      props.getData();
      reset();
      if (response.data.status) setOpenSuccess(true);
      else setOpenWarning(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (title) setErrorTitle(false);
  }, [title]);

  useEffect(() => {
    if (selectedCourse) setErrorCourse(false);
  }, [selectedCourse]);

  useEffect(() => {
    setErrorQuestion(false);
  }, [JSON.stringify(questions)]);

  return (
    <Box
      sx={{
        p: 4,
        border: 1,
        mt: 2,
        ml: 2,
        mb: 10,
        borderColor: "rgba(54, 162, 235, 0.2)",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        id="modal-modal-title"
        variant="h5"
        component="h2"
        sx={{
          fontWeight: "bold",
          mb: 2,
          display: "flex",
        }}
      >
        Create Form
      </Typography>
      <FormControl fullWidth error={errorCourse}>
        <InputLabel id="demo-simple-select-label">Course</InputLabel>
        <Select
          labelId="demo-simple-select-error-label"
          id="demo-simple-select-error"
          value={selectedCourse}
          label="Course"
          onChange={handleChange}
          helperText={errorCourse ? "Course is Required" : ""}
        >
          {props.courses &&
            props.courses.map((course, index) => (
              <MenuItem key={index} value={course.value}>
                {course.label}
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>
          {errorCourse ? "Course is Required" : ""}
        </FormHelperText>
      </FormControl>
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
        variant="h7"
        component="h3"
        sx={{ mb: 1, display: "flex" }}
      >
        Questions
      </Typography>
      <FormHelperText sx={{ ml: 2 }}>
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
                    { question: "", highest_answer: "" },
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
        sx={{
          borderColor: "#141962",
          mt: 2,
          fontWeight: 500,
          "&:hover": {
            color: "white",
            bgcolor: "#141962",
          },
        }}
        onClick={onSubmit}
      >
        SUBMIT
      </Button>
      <Snackbar
        open={openSuccess}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Successfully saved survey form.
        </Alert>
      </Snackbar>
      <Snackbar
        open={openWarning}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          Form was not saved.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Create;
