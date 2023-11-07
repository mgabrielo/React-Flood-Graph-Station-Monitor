import { useState } from "react";
import { styled } from "@mui/material/styles";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import StationTable from "./StationTable";
import { format, sub } from "date-fns";
import StationLineChart from "./StationLineChart";
import { useDispatch } from "react-redux";
import {
  stationChartFailure,
  stationChartStart,
  stationChartSuccess,
  stationTableFailure,
  stationTableStart,
  stationTableSuccess,
} from "../redux/station/stationSlice";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
  ({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  })
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const StationAccordion = ({ stationData }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const currentDate = new Date();

  const previousDate = sub(currentDate, { days: 1 });

  const dailyDate = format(previousDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

  async function handleStation(stationRef) {
    try {
      dispatch(stationTableStart());
      await axios
        .get(
          `http://environment.data.gov.uk/flood-monitoring/id/stations/${stationRef}/readings?since=${dailyDate}`
        )
        .then((res) => {
          if (res.status === 200) {
            const filteringStation = res?.data?.items;
            dispatch(stationTableSuccess(filteringStation));
            dispatch(stationChartStart());
            const vals = stationData.measures.map((data) => {
              if (data) {
                return filteringStation.filter((ref) => {
                  if (ref) {
                    return ref?.measure === data["@id"];
                  }
                  return null;
                });
              }
              return null;
            });

            if (vals && vals.length > 0) {
              dispatch(stationChartSuccess(vals));
            } else {
              dispatch(stationChartFailure("No Chart Data Available"));
            }
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(stationTableFailure(err?.message));
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            expandIcon={
              expanded ? (
                <RemoveIcon
                  sx={{ fontSize: "0.9rem", color: expanded ? "#fff" : "none" }}
                />
              ) : (
                <AddIcon
                  sx={{
                    fontSize: "0.9rem",
                    color: expanded ? "none" : "#2C3E50",
                  }}
                />
              )
            }
            sx={{
              backgroundColor: expanded ? "#85929E" : "#ccc",
              color: expanded ? "#fff" : "#154360",
            }}
            onClick={() => handleStation(stationData?.notation)}
          >
            <Typography>{stationData?.notation}</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "auto",
              marginRight: "auto",
              width: "90%",
            }}
          >
            {expanded && <StationLineChart />}
            {expanded && <StationTable />}
          </AccordionDetails>
        </Accordion>
      }
    </>
  );
};

export default StationAccordion;
