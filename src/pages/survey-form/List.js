import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import Close from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import Tooltip from "@mui/material/Tooltip";
import FolderSharedRoundedIcon from "@mui/icons-material/FolderSharedRounded";
import Zoom from "@mui/material/Zoom";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import Create from "./Create";
import Header from "../../components/Header";
import axios from "../../components/api";

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

const List = () => {
  const navigate = useNavigate();
  const [formList, setFormList] = useState([]);
  const [filteredFormList, setFilteredFormList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentForm, setCurrentForm] = useState();
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searched, setSearched] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [cookies] = useCookies(["user"]);

  const handleChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpen = (id) => {
    getFormQuestions(id);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentForm();
    setQuestions([]);
  };

  const handleOpenCreate = () => {
    setOpenCreate(!openCreate);
  };

  const getData = async () => {
    try {
      await axios
        .get("/api/form-list", {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((response) => {
          setFormList(response.data);
        });
    } catch (error) {
      console.log(error);
    }

    // try {
    //   await fetch("https://api.thinkific.com/api/public/v1/courses", {
    //     method: "GET",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       "X-Auth-API-Key": "6e3eb8dfaa67a3c5044d79215541b668",
    //       "X-Auth-Subdomain": "revolvingchange",
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then(({ items }) => {
    //       setCourses((courses) => [...courses, { value: 0, label: "All" }]);

    //       items.map((item) => {
    //         setCourses((courses) => [
    //           ...courses,
    //           { value: item.id, label: item.name },
    //         ]);
    //       });
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const getCourses = async () => {
    try {
      await fetch("https://api.thinkific.com/api/public/v1/courses", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Auth-API-Key": "6e3eb8dfaa67a3c5044d79215541b668",
          "X-Auth-Subdomain": "revolvingchange",
        },
      })
        .then((response) => response.json())
        .then(({ items }) => {
          setCourses((courses) => [...courses, { value: 0, label: "All" }]);

          items.map((item) => {
            setCourses((courses) => [
              ...courses,
              { value: item.id, label: item.name },
            ]);
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getFormQuestions = async (id) => {
    try {
      await axios.get(`/api/form/${id}`).then((response) => {
        setQuestions(response.data.survey_questions);
        setCurrentForm(response.data.survey_form);
        setOpen(true);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (cookies.token) {
      getData();
      getCourses();
    } else navigate("/");
  }, []);

  useEffect(() => {
    let filteredRows = formList.filter((row) => {
      return row.form_title.toLowerCase().includes(searched.toLowerCase());
    });

    if (selectedCourse) {
      filteredRows = filteredRows.filter(
        (row) => row.course_id === selectedCourse
      );
    }

    setFilteredFormList(filteredRows);
  }, [searched, formList, selectedCourse]);

  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <Grid container sx={{ mt: 8 }}>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="flex-start">
              <TextField
                id="outlined-multiline-flexible"
                label="Search Form"
                value={searched}
                onChange={(event) => setSearched(event.target.value)}
                size="small"
                sx={{ width: "100%" }}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="flex-start">
              <FormControl sx={{ width: "90%", ml: 1 }}>
                <InputLabel id="demo-simple-select-label" size="small">
                  Filter by course
                </InputLabel>
                <Select
                  value={selectedCourse}
                  label="Filter by course"
                  size="small"
                  onChange={handleChange}
                >
                  {courses &&
                    courses.map((course, index) => (
                      <MenuItem key={index} value={course.value}>
                        {course.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{ backgroundColor: "#141962" }}
                onClick={handleOpenCreate}
              >
                {openCreate ? "CLOSE CREATE FORM" : "CREATE FORM"}
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={openCreate ? 7 : 12}>
            <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Form Title</StyledTableCell>
                    <StyledTableCell>Course ID</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFormList.length
                    ? filteredFormList
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((form) => (
                          <StyledTableRow key={form.id}>
                            <StyledTableCell component="th" scope="row">
                              {form.id}
                            </StyledTableCell>
                            <StyledTableCell>{form.form_title}</StyledTableCell>
                            <StyledTableCell>{form.course_id}</StyledTableCell>
                            <StyledTableCell align="center">
                              <Tooltip
                                title="View Questions"
                                placement="top"
                                TransitionComponent={Zoom}
                              >
                                <IconButton onClick={() => handleOpen(form.id)}>
                                  <VisibilityIcon
                                    sx={{
                                      color: "rgb(38, 37, 77)",
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title="Entries"
                                placement="top"
                                TransitionComponent={Zoom}
                              >
                                <IconButton
                                  onClick={() =>
                                    navigate(`/form-entries/${form.id}`)
                                  }
                                >
                                  <FolderSharedRoundedIcon
                                    sx={{
                                      color: "rgb(38, 37, 77)",
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                    : "NO DATA"}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={filteredFormList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ mb: 8 }}
            />
          </Grid>
          {openCreate && (
            <Grid item xs={5}>
              <Create
                getData={getData}
                courses={courses.filter((course) => course.value !== 0)}
                setCourses={setCourses}
              />
            </Grid>
          )}
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Grid container>
              <Grid item xs={6}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {currentForm && currentForm.form_title}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="flex-end">
                  <IconButton onClick={handleClose}>
                    <Close
                      fontSize="small"
                      sx={{
                        "&:hover": { color: "green" },
                        color: "rgb(38, 37, 77)",
                      }}
                    />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
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
                    <Grid container>
                      <Grid item xs={10}>
                        <Typography align="left">
                          {index + 1}. {question.question}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography align="right">
                          {question.highest_answer}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate(`/form-edit/${currentForm.id}`)}
                sx={{
                  color: "rgb(38, 37, 77)",
                  mt: 2,
                  borderColor: "rgb(38, 37, 77)",
                }}
              >
                EDIT
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default List;
