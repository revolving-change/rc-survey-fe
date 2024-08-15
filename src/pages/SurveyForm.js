import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import axios from "../components/api";

const SurveyForm = () => {
  const { email, type, form } = useParams();
  const [questions, setQuestions] = useState([]);
  const [surveyForm, setSurveyForm] = useState({});
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState(false);

  const handleAnswer = (event, index) => {
    let newArr = [...answers];
    newArr[index]["answer"] = event.target.value;
    setAnswers(newArr);
  };

  const getData = async () => {
    try {
      await axios
        .get(`/api/form/${parseInt(form)}`, {
          params: {
            email: email,
            type: type,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setQuestions(response.data.survey_questions);
            setSurveyForm(response.data.survey_form);
            response.data.survey_questions.forEach((question) => {
              setAnswers((answers) => [
                ...answers,
                { question_id: question.id, answer: "" },
              ]);
            });
            setStatus(false);
          } else setStatus(true);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const submit = async () => {
    console.log(
      JSON.stringify({
        email: email,
        status: "submitted",
        type: type,
        answers: answers,
      })
    );
    try {
      const response = await axios
        .post(`/api/answer-survey/${parseInt(form)}`, {
          email: email,
          status: "submitted",
          type: type,
          answers: answers,
        })
        .then((response) => {
          if (response.data.status) {
            setStatus(true);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container maxWidth="xl">
      {status ? (
        <Typography variant="h4" gutterBottom align="left" sx={{ mt: 5 }}>
          Thank you for taking the survey!
        </Typography>
      ) : (
        <>
          <Typography gutterBottom align="left" sx={{ mt: 5, fontSize: 32 }}>
            {surveyForm.form_title}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={2.4}>
              <Typography variant="overline" display="block" align="left">
                SA = STRONGLY AGREE
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="overline" display="block" align="left">
                A = AGREE
              </Typography>
            </Grid>
            <Grid item xs={3.2}>
              <Typography variant="overline" display="block" align="left">
                U = UNCERTAIN/UNDECIDED
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="overline" display="block" align="left">
                D = DISAGREE
              </Typography>
            </Grid>
            <Grid item xs={2.4}>
              <Typography variant="overline" display="block" align="left">
                SD = STRONGLY DISAGREE
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {questions.map((question, index) => {
              return (
                <Box
                  key={question.id}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    border: 1,
                    p: 2,
                    borderColor: "primary.main",
                    borderRadius: "16px",
                    mb: 1,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={7}>
                      <Typography align="left" sx={{ fontSize: 20 }}>
                        {index + 1}. {question.question}
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          alignItems="flex-end"
                          onChange={(e) => handleAnswer(e, index)}
                        >
                          <FormControlLabel
                            labelPlacement="top"
                            value="SA"
                            control={<Radio size="small" />}
                            label="SA"
                          />
                          <FormControlLabel
                            labelPlacement="top"
                            value="A"
                            control={<Radio size="small" />}
                            label="A"
                          />
                          <FormControlLabel
                            labelPlacement="top"
                            value="U"
                            control={<Radio size="small" />}
                            label="U"
                          />
                          <FormControlLabel
                            labelPlacement="top"
                            value="D"
                            control={<Radio size="small" />}
                            label="D"
                          />
                          <FormControlLabel
                            labelPlacement="top"
                            value="SD"
                            control={<Radio size="small" />}
                            label="SD"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
            <Button
              variant="contained"
              sx={{ mb: 5, mt: 3, fontSize: 18 }}
              onClick={submit}
              color="primary"
            >
              Submit
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default SurveyForm;
