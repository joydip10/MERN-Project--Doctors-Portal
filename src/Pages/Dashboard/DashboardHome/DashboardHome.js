import { Grid } from '@mui/material';
import React,{useState} from 'react';
import Appointments from '../Apointments/Appointments';
import Calendar from './../../Shared/Calendar/Calendar';

const DashboardHome = () => {
    const [date, setDate] = useState(new Date());
    return (
        <Grid container spacing={2}>
                        <Grid item xs={12} sm={5}>
                            <Calendar
                                date={date}
                                setDate={setDate}
                            ></Calendar>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <Appointments date={date}></Appointments>
                        </Grid>
                    </Grid>
    );
};

export default DashboardHome;