import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  stationChartFailure,
  stationChartStart,
  stationChartSuccess,
  stationFailure,
  stationStart,
  stationSuccess,
  stationTableFailure,
  stationTableStart,
  stationTableSuccess,
} from "../redux/station/stationSlice";
import { format, sub } from "date-fns";
import StationLineChart from "./StationLineChart";
import StationTable from "./StationTable";

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

const Station = () => {
  const dispatch = useDispatch();
  const { allStations, allStationsloading } = useSelector(
    (state) => state.station
  );

  const [expanded, setExpanded] = useState(null);

  const handleAccordionChange = (index) => {
    setExpanded((prevExpanded) => (prevExpanded === index ? null : index));
  };

  useEffect(() => {
    async function getReading() {
      try {
        dispatch(stationStart());
        await axios
          .get(
            `https://environment.data.gov.uk/flood-monitoring/id/stations?_limit=100`
          )
          .then((res) => {
            if (res.status === 200) {
              const allStations = res?.data?.items;
              dispatch(stationSuccess(allStations));
            }
          })
          .catch((err) => {
            console.log(err);
            dispatch(stationFailure(err?.message));
          });
      } catch (error) {
        console.log(error);
      }
    }
    getReading();
  }, [dispatch]);

  const currentDate = new Date();

  const previousDate = sub(currentDate, { days: 1 });

  const dailyDate = format(previousDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

  async function handleStation(stationRef) {
    try {
      dispatch(stationTableStart());
      await axios
        .get(
          `http://environment.data.gov.uk/flood-monitoring/id/stations/${stationRef.notation}/readings?since=${dailyDate}`
        )
        .then((res) => {
          if (res.status === 200) {
            const filteringStation = res?.data?.items;
            dispatch(stationTableSuccess(filteringStation));
            dispatch(stationChartStart());
            const vals = stationRef.measures.map((data) => {
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
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        marginY: 5,
        marginX: "auto",
      }}
    >
      <Typography variant="h4" sx={{ padding: 2, color: "#154360" }}>
        Station Selection
      </Typography>
      {!allStationsloading && allStations && allStations.length > 0 ? (
        allStations.map((res, index) => {
          if (res?.notation && res?.label) {
            return (
              <Fragment key={index}>
                <Accordion
                  expanded={expanded === index}
                  onChange={() => handleAccordionChange(index)}
                  onClick={() => handleStation(res)}
                  sx={{ marginBottom: 0 }}
                >
                  <AccordionSummary
                    expandIcon={
                      expanded === index ? (
                        <RemoveIcon
                          sx={{
                            fontSize: "0.9rem",
                            color: expanded === index ? "#fff" : "none",
                          }}
                        />
                      ) : (
                        <AddIcon
                          sx={{
                            fontSize: "0.9rem",
                            color: expanded === index ? "none" : "#2C3E50",
                          }}
                        />
                      )
                    }
                    sx={{
                      backgroundColor: expanded === index ? "#85929E" : "#ccc",
                      color: expanded === index ? "#fff" : "#154360",
                    }}
                  >
                    <Typography>
                      {res?.label} - ({res?.notation})
                    </Typography>
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
                    {expanded === index && <StationLineChart />}
                    {expanded === index && <StationTable />}
                  </AccordionDetails>
                </Accordion>
              </Fragment>
            );
          }
          return null;
        })
      ) : (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginY: 5,
          }}
        >
          <CircularProgress disableShrink color="inherit" />
          <Typography sx={{ mt: 4 }}>Loading...Please Wait</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Station;
