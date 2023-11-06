import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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

const StationTable = () => {
  const { allStations, stationTableData, stationTableDataloading } =
    useSelector((state) => state.station);

  const stationFind = (value) => {
    const val =
      allStations &&
      allStations.length > 0 &&
      allStations.filter((item) => {
        if (item && item?.measures) {
          return item?.measures.find((itm) => {
            if (itm) {
              return itm["@id"] === value;
            }
            return null;
          });
        }
        return null;
      });

    const qualifier =
      val !== undefined &&
      val &&
      val.length > 0 &&
      val.map((item) => {
        if (item && item?.measures) {
          return item?.measures.map((itm) => {
            if (itm && itm["@id"] === value) {
              return itm.qualifier;
            }
            return null;
          });
        }
        return null;
      });

    return qualifier;
  };

  const formatTime = (value) => {
    const parsedDate = parseISO(value);
    const formattedTime = format(parsedDate, "dd-MM-yyyy HH:mm");
    return formattedTime;
  };

  return (
    <>
      {!stationTableDataloading && stationTableData ? (
        stationTableData.length > 0 ? (
          <>
            <Typography variant="h6" sx={{ marginTop: 4 }}>
              Flood Station Table Data Showing Last 24 hours Readings
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 4,
                width: "100%",
                display: "flex",
              }}
            >
              <Table sx={{ minWidth: 500 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Date Time</StyledTableCell>
                    <StyledTableCell align="center">Qualifier</StyledTableCell>
                    <StyledTableCell align="center">Value</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stationTableData.map((row, index) => {
                    if (row) {
                      // console.log("row", row);
                      return (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {formatTime(row?.dateTime)}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {stationFind(row?.measure)}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row?.value}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    }
                    return null;
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Typography>No Readings Available</Typography>
        )
      ) : (
        <Box>
          <Typography>Loading Table Data...Please Wait</Typography>
        </Box>
      )}
    </>
  );
};

export default StationTable;
