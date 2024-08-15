import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import axios from "../components/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const Result = () => {
  const [preSurveyResults, setPreSurveyResults] = useState();
  const [postSurveyResults, setPostSurveyResults] = useState();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [preSurveyChartData, setPreSurveyChartData] = useState({
    labels: ["APPROPRIATE", "INAPPROPRIATE"],
    text: "PRE-SURVEY",
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["rgb(38, 37, 77)", "rgba(54, 162, 235, 0.2)"],
      },
    ],
  });
  const [postSurveyChartData, setPostSurveyChartData] = useState({
    labels: ["APPROPRIATE", "INAPPROPRIATE"],
    text: "POST-SURVEY",
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["rgb(38, 37, 77)", "rgba(54, 162, 235, 0.2)"],
      },
    ],
  });

  const { email, form } = useParams();

  const getData = async () => {
    try {
      const response = await axios.get(`/api/survey-result/${parseInt(form)}`, {
        params: {
          email: email,
        },
      });

      if (response.data.status) {
        setPreSurveyResults(response.data.pre_survey_result);
        setPostSurveyResults(response.data.post_survey_result);
        setError(false);
      } else {
        setError(true);
        if (email) setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (preSurveyResults) {
      setPreSurveyChartData({
        labels: ["APPROPRIATE", "INAPPROPRIATE"],
        text: "PRE",
        datasets: [
          {
            data: [preSurveyResults, 100 - preSurveyResults],
            backgroundColor: ["#23C552", "#F84F31"],
          },
        ],
      });
    }
  }, [preSurveyResults]);

  useEffect(() => {
    if (postSurveyResults) {
      setPostSurveyChartData({
        labels: ["APPROPRIATE", "INAPPROPRIATE"],
        text: "POST",
        datasets: [
          {
            data: [postSurveyResults, 100 - postSurveyResults],
            backgroundColor: ["#23C552", "#F84F31"],
          },
        ],
      });
    }
  }, [postSurveyResults]);

  const plugins = (text) => {
    return [
      {
        beforeDraw(chart) {
          const { width } = chart;
          const { height } = chart;
          const { ctx } = chart;
          ctx.restore();
          const fontSize = (height / 160).toFixed(2);
          ctx.font = `${fontSize}em sans-serif`;
          ctx.textBaseline = "top";
          const textX = Math.round((width - ctx.measureText(text).width) / 2);
          const textY = height / 2;
          ctx.fillText(text, textX, textY);
          ctx.save();
        },
      },
    ];
  };

  return (
    <Container maxWidth="xl">
      {error ? (
        <Typography variant="h4" gutterBottom align="left" sx={{ mt: 5 }}>
          {errorMessage}
        </Typography>
      ) : (
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <Doughnut data={preSurveyChartData} plugins={plugins("PRE")} />
          </Grid>
          <Grid item xs={6}>
            <Doughnut data={postSurveyChartData} plugins={plugins("POST")} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Result;
