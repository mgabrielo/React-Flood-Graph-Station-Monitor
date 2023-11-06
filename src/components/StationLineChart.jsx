import { Line } from "react-chartjs-2";
import { format, parseISO } from "date-fns";
import { Chart as ChartJs } from "chart.js/auto";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const StationLineChart = () => {
  const { stationChartData, allStations, stationChartDataloading } =
    useSelector((state) => state.station);

  function formatTime(value) {
    const date = parseISO(value);
    const formattedTime = format(date, "HH:mm");
    return formattedTime;
  }

  const stationFind = (value) => {
    var stationQualifier;

    allStations.length > 0 &&
      allStations.find((item) => {
        if (item) {
          item?.measures &&
            item?.measures.length > 0 &&
            item?.measures.find((itm) => {
              if (itm && itm?.qualifier) {
                const getVal =
                  value.length > 0 &&
                  value.find((data) => {
                    if (data?.measure === itm["@id"]) {
                      stationQualifier = itm?.qualifier;
                    }
                    return null;
                  });

                return getVal;
              }
              return null;
            });
          return null;
        }
        return null;
      });

    return stationQualifier;
  };

  return (
    <Box
      sx={{
        padding: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" sx={{ mt: 1 }}>
        Flood Station Monitoring Graph(s) Showing Last 24 hours Readings
      </Typography>
      {!stationChartDataloading &&
      stationChartData &&
      stationChartData.length > 0 ? (
        stationChartData.map((data, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              marginTop: 5,
              width: "100%",
              flexDirection: "column",
            }}
          >
            <Line
              data={{
                labels: data.map((point) => {
                  if (point) {
                    return formatTime(point.dateTime);
                  }
                  return null;
                }),
                datasets: [
                  {
                    label: `Graph ${index + 1} - Qualifier :  (${stationFind(
                      data
                    )})`,
                    data: data.map((point) => {
                      if (point) {
                        return point.value;
                      }
                      return null;
                    }),
                    borderColor: "rgba(0, 0, 255, 0.5)",
                    borderWidth: 1,
                    fill: false,
                    tension: 0.5,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Level",
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Time",
                    },
                    ticks: {
                      maxTicksLimit: 24,
                    },
                  },
                },
              }}
              style={{
                display: "flex",
                marginTop: 10,
                marginBottom: 10,
                width: "100%",
              }}
            />
          </Box>
        ))
      ) : (
        <Box>
          <Typography>Loading Data Chart...Please Wait</Typography>
        </Box>
      )}
    </Box>
  );
};

export default StationLineChart;
