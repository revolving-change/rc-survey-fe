import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import Container from "@mui/material/Container";

import axios from "../components/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    yAxis: {
      min: 0,
      max: 100,
    },
  },
};

const CourseResult = () => {
  const { email, course } = useParams();

  const labels = ["Pre-survey", "Post-survey"];

  const [data, setData] = useState({
    labels,
    datasets: [
      {
        label: "APPROPRIATE",
        data: [],
        backgroundColor: "#23C552",
      },
      {
        label: "INAPPROPRIATE",
        data: [],
        backgroundColor: "#141962",
      },
    ],
  });

  const getData = async () => {
    try {
      const response = await axios.get(
        `/api/all-survey-result/${parseInt(course)}`,
        {
          params: {
            email: email,
          },
        }
      );

      if (response.data.status) {
        let preSurvey = 0;
        let preCount = 0;

        response.data.result.map((res) => {
          preSurvey += res.pre_survey_result;
          preCount++;
        });

        let postSurvey = 0;
        let postCount = 0;

        response.data.result.map((res) => {
          postSurvey += res.post_survey_result;
          postCount++;
        });

        setData({
          labels,
          datasets: [
            {
              label: "APPROPRIATE",
              data: [preSurvey / preCount, postSurvey / postCount],
              backgroundColor: "#23C552",
            },
            {
              label: "INAPPROPRIATE",
              data: [100 - preSurvey / preCount, 100 - postSurvey / postCount],
              backgroundColor: "#F84F31",
            },
          ],
        });
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Bar options={options} data={data} />
    </Container>
  );
  //   return <Bar options={options} data={data} />;
};

export default CourseResult;
