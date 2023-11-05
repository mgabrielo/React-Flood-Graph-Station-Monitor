import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allStations: [],
    stationTableData: [],
    stationChartData: [],
    allStationsloading: false,
    stationTableDataloading: false,
    stationChartDataloading: false,
    allStationserror: null,
    stationTableDataerror: null,
    stationChartDataerror: null,
}

const stationSlice = createSlice({
    name: 'station',
    initialState,
    reducers: {
        stationStart: (state) => {
            state.allStationsloading = true
            state.allStationserror = null
        },
        stationSuccess: (state, action) => {
            state.allStationsloading = false
            state.allStations = action.payload
            state.allStationserror = null
        },
        stationFailure: (state, action) => {
            state.allStationsloading = false
            state.allStations = []
            state.allStationserror = action.payload
        },
        stationTableStart: (state) => {
            state.stationTableDataloading = true
            state.stationTableData = []
            state.stationTableDataerror = null
        },
        stationTableSuccess: (state, action) => {
            state.stationTableDataloading = false
            state.stationTableData = action.payload
            state.stationTableDataerror = null
        },
        stationTableFailure: (state, action) => {
            state.stationTableDataloading = false
            state.stationTableData = []
            state.stationTableDataerror = action.payload
        },
        stationChartStart: (state) => {
            state.stationChartDataloading = true
            state.stationChartData = []
            state.stationChartDataerror = null
        },
        stationChartSuccess: (state, action) => {
            state.stationChartDataloading = false
            state.stationChartData = action.payload
            state.stationChartDataerror = null
        },
        stationChartFailure: (state, action) => {
            state.stationChartDataloading = false
            state.stationChartData = []
            state.stationChartDataerror = action.payload
        },
    }
});


export const {
    stationStart,
    stationSuccess,
    stationFailure,
    stationTableStart,
    stationTableSuccess,
    stationTableFailure,
    stationChartStart,
    stationChartSuccess,
    stationChartFailure,
} = stationSlice.actions

export default stationSlice.reducer