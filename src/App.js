import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import SurveyForm from "./pages/SurveyForm";
import Result from "./pages/Result";
import CourseResult from "./pages/CourseResult";
import List from "./pages/survey-form/List";
import Takers from "./pages/Takers";
import Login from "./pages/Login";
import Edit from "./pages/survey-form/Edit";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "Gilroy",
      fontSize: 16,
    },
  },
  palette: {
    primary: createColor("#141962"),
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="forms" element={<List />} />
          <Route path="survey/:type/:email/:form" element={<SurveyForm />} />
          <Route path="result/:email/:form" element={<Result />} />
          <Route
            path="course-result/:email/:course"
            element={<CourseResult />}
          />
          <Route path="form-entries/:id" element={<Takers />} />
          <Route path="form-edit/:id" element={<Edit />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
