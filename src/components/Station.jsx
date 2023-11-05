import { useEffect } from "react";
import axios from "axios";
import { Box, CircularProgress, Typography } from "@mui/material";
import StationAccordion from "./StationAccordion";
import { useDispatch, useSelector } from "react-redux";
import {
  stationFailure,
  stationStart,
  stationSuccess,
} from "../redux/station/stationSlice";

const Station = () => {
  const dispatch = useDispatch();
  const { allStations, allStationsloading } = useSelector(
    (state) => state.station
  );

  useEffect(() => {
    async function getReading() {
      try {
        dispatch(stationStart());
        await axios
          .get(
            `https://environment.data.gov.uk/flood-monitoring/id/stations?_limit=50`
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
          if (res?.notation) {
            return <StationAccordion key={index} stationData={res} />;
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
          <Typography sx={{ mt: 4 }}>
            Loading Data Table...Please Wait
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Station;
