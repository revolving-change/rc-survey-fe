import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import Tooltip from "@mui/material/Tooltip";
import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";
import Zoom from "@mui/material/Zoom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { Chart as ChartJS, ArcElement, Tooltip as tp, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import Header from "../components/Header";
import axios from "../components/api";

ChartJS.register(ArcElement, tp, Legend);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#141962",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

const Takers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openDetails, setOpenDetails] = useState(false);
  const [takers, setTakers] = useState([]);
  const [form, setForm] = useState();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(id);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [preSurveyResults, setPreSurveyResults] = useState();
  const [postSurveyResults, setPostSurveyResults] = useState();
  const [preSurveyAnswers, setPreSurveyAnswers] = useState([]);
  const [postSurveyAnswers, setPostSurveyAnswers] = useState([]);
  const [formPreSurvey, setFormPreSurvey] = useState(0);
  const [formPostSurvey, setFormPostSurvey] = useState(0);
  const [courseId, setCourseId] = useState(null);
  const [openWarning, setOpenWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [expanded, setExpanded] = useState(false);
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
      Entries
    </Typography>,
  ];

  const [preSurveyChartData, setPreSurveyChartData] = useState({
    labels: [],
    text: "PRE-SURVEY",
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#23C552", "#F84F31"],
      },
    ],
  });
  const [postSurveyChartData, setPostSurveyChartData] = useState({
    labels: [],
    text: "POST-SURVEY",
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#23C552", "#F84F31"],
      },
    ],
  });

  const [coursePreSurveyChartData, setCoursePreSurveyChartData] = useState({
    labels: [],
    text: "PRE-SURVEY",
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#23C552", "#F84F31"],
      },
    ],
  });
  const [coursePostSurveyChartData, setCoursePostSurveyChartData] = useState({
    labels: ["APPROPRIATE", "INAPPROPRIATE"],
    text: "POST-SURVEY",
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#23C552", "#F84F31"],
      },
    ],
  });

  const handleChange = (event) => {
    setSelectedForm(event.target.value);
    navigate(`/form-entries/${event.target.value}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const getData = async () => {
    try {
      await axios
        .get(`/api/taker-list/${selectedForm}`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        })
        .then(async (response) => {
          setTakers(response.data.data);
          setForm(response.data.form);

          let pre = 0;
          let post = 0;

          response.data.data.map((data) => {
            pre += data.pre_survey;
            post += data.post_survey;
          });

          setFormPreSurvey((pre / response.data.data.length).toFixed(2));
          setFormPostSurvey((post / response.data.data.length).toFixed(2));

          setCourseId(response.data.form.course_id);

          try {
            await axios
              .get(`/api/forms/${response.data.form.course_id}`, {
                headers: {
                  Authorization: `Bearer ${cookies.token}`,
                },
              })
              .then((response) => {
                setForms(response.data.survey_forms);
              });
          } catch (error) {
            console.log(error);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getResult = async (email) => {
    try {
      await axios
        .get(`/api/survey-result/${id}`, {
          params: {
            email: email,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setPreSurveyResults(response.data.pre_survey_result);
            setPostSurveyResults(response.data.post_survey_result);
            setPreSurveyAnswers(response.data.pre_answers);
            setPostSurveyAnswers(response.data.post_answers);
            handleOpenDetails();
          } else {
            setWarningMessage(response.data.message);
            setOpenWarning(true);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getCourseResult = async () => {
    try {
      await axios
        .get(`/api/course-result/${courseId}`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setCoursePostSurveyChartData({
              labels: ["APPROPRIATE", "INAPPROPRIATE"],
              text: "PRE",
              datasets: [
                {
                  data: [
                    response.data.post_survey,
                    100 - response.data.post_survey,
                  ],
                  backgroundColor: ["#23C552", "#F84F31"],
                },
              ],
            });

            setCoursePreSurveyChartData({
              labels: ["APPROPRIATE", "INAPPROPRIATE"],
              text: "PRE",
              datasets: [
                {
                  data: [
                    response.data.pre_survey,
                    100 - response.data.pre_survey,
                  ],
                  backgroundColor: ["#23C552", "#F84F31"],
                },
              ],
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

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

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    if (courseId) getCourseResult();
  }, [courseId]);

  useEffect(() => {
    if (formPreSurvey) {
      setPreSurveyChartData({
        labels: ["APPROPRIATE", "INAPPROPRIATE"],
        text: "PRE",
        datasets: [
          {
            data: [formPreSurvey, 100 - formPreSurvey],
            backgroundColor: ["#23C552", "#F84F31"],
          },
        ],
      });
    }
  }, [formPreSurvey]);

  useEffect(() => {
    if (formPostSurvey) {
      setPostSurveyChartData({
        labels: ["APPROPRIATE", "INAPPROPRIATE"],
        text: "POST",
        datasets: [
          {
            data: [formPostSurvey, 100 - formPostSurvey],
            backgroundColor: ["#23C552", "#F84F31"],
          },
        ],
      });
    }
  }, [formPostSurvey]);

  useEffect(() => {
    if (cookies.token) getData();
    else navigate("/");
  }, [selectedForm]);

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
            mt: 2,
            backgroundColor: "rgba(54, 162, 235, 0.1)",
            borderRadius: 2,
          }}
          display="flex"
          justifyContent="center"
          setSelectedForm="center"
        >
          <Box sx={{ my: 2, width: "80%" }}>
            <Grid container spacing={5}>
              <Grid item xs={2.75}>
                <Doughnut
                  data={coursePreSurveyChartData}
                  plugins={plugins("PRE")}
                  options={options}
                />
              </Grid>
              <Grid item xs={2.75}>
                <Doughnut
                  data={coursePostSurveyChartData}
                  plugins={plugins("POST")}
                  options={options}
                />
              </Grid>
              <Grid item xs={1}>
                <Divider
                  flexItem
                  sx={{
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    width: 2,
                    height: "100%",
                    ml: "50%",
                  }}
                />
              </Grid>
              <Grid item xs={2.75}>
                <Doughnut
                  data={preSurveyChartData}
                  plugins={plugins("PRE")}
                  options={options}
                />
              </Grid>
              <Grid item xs={2.75}>
                <Doughnut
                  data={postSurveyChartData}
                  plugins={plugins("POST")}
                  options={options}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: "bold" }}
                >
                  COURSE
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: "bold" }}
                >
                  LESSON
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="flex-start"
          sx={{ mt: 4, w: "100%" }}
        >
          <Grid container>
            <Grid item xs={6}>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ fontWeight: "bold" }}
              >
                {form &&
                  `${form.form_title}'s entries for course ID ${form.course_id}`}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl sx={{ width: "50%", ml: 1 }}>
                <InputLabel id="demo-simple-select-label" size="small">
                  Forms
                </InputLabel>
                <Select
                  value={selectedForm}
                  label="Forms"
                  size="small"
                  onChange={handleChange}
                >
                  {forms &&
                    forms.map((item, index) => (
                      <MenuItem key={index} value={item.id}>
                        {item.form_title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Pre-Survey</StyledTableCell>
                <StyledTableCell>Post-Survey</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Divider />
              {takers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((taker) => (
                  <StyledTableRow key={taker.id}>
                    <StyledTableCell component="th" scope="row">
                      {taker.id}
                    </StyledTableCell>
                    <StyledTableCell>{taker.email}</StyledTableCell>
                    <StyledTableCell>{taker.pre_survey}</StyledTableCell>
                    <StyledTableCell>{taker.post_survey}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Tooltip
                        title="Results"
                        placement="top"
                        TransitionComponent={Zoom}
                      >
                        <IconButton
                          onClick={() => {
                            getResult(taker.email);
                          }}
                        >
                          <EqualizerRoundedIcon
                            sx={{
                              color: "rgb(38, 37, 77)",
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={takers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ mb: 8 }}
        />
        <Modal
          open={openDetails}
          onClose={handleCloseDetails}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography sx={{ mb: 1 }}>RESULTS</Typography>
            <Accordion
              expanded={expanded === "pre-survey"}
              onChange={handleExpand("pre-survey")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>PRE SURVEY</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
                      Questions
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
                      Answer
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
                      Score
                    </Typography>
                  </Grid>
                </Grid>
                {preSurveyAnswers.map((answer, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                    <Grid item xs={8}>
                      {index + 1}. {answer.question}
                    </Grid>
                    <Grid item xs={2}>
                      {answer.answer}
                    </Grid>
                    <Grid item xs={2}>
                      {answer.score}
                    </Grid>
                  </Grid>
                ))}
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "post-survey"}
              onChange={handleExpand("post-survey")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>POST SURVEY</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
                      Questions
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
                      Answer
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
                      Score
                    </Typography>
                  </Grid>
                </Grid>
                {postSurveyAnswers.map((answer, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={8}>
                      {index + 1}. {answer.question}
                    </Grid>
                    <Grid item xs={2}>
                      {answer.answer}
                    </Grid>
                    <Grid item xs={2}>
                      {answer.score}
                    </Grid>
                  </Grid>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Modal>
        <Snackbar
          open={openWarning}
          autoHideDuration={3000}
          onClose={() => setOpenWarning(false)}
        >
          <Alert
            onClose={() => setOpenWarning(false)}
            severity="warning"
            sx={{ width: "100%" }}
          >
            {warningMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Takers;
