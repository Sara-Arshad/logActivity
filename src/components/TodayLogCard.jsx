import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";

// Custom Styled Components
const StepperContainer = styled(Box)({
  width: "100%",
  maxWidth: 600,
  margin: "20px auto",
});

const StepLabelStyled = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-iconContainer": {
    color: theme.palette.primary.main,
  },
  "& .MuiStepLabel-label": {
    color: theme.palette.text.primary,
    fontSize: "1rem",
  },
}));

const TodayLogCard = ({ log }) => {
  const steps = [
    { label: "Checked In", time: log[0]?.checkIn },
    { label: "Break In", time: log[0]?.breakStartTime },
    { label: "Break Out", time: log[0]?.breakEndTime },
    { label: "Checked Out", time: log[0]?.checkOut },
  ];

  const formatTime = (time) =>
    time === "N/A" ? "N/A" : moment(time).format("hh:mm:ss A");

  // Determine the active step based on available log data
  const activeStep = steps.findIndex((step) => !step.time);

  return (
    <Box sx={{ maxWidth: 600, width: "100%", marginTop: "20px" }}>
      <Paper elevation={3} sx={{ padding: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Today's Activity
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {moment(log[0]?.checkIn).format("DD MMMM YYYY")}
        </Typography>
        <Divider sx={{ marginY: 2 }} />
        <StepperContainer>
          <Stepper
            activeStep={activeStep >= 0 ? activeStep : steps.length - 1}
            orientation="vertical"
          >
            {steps.map((step, index) => (
              <Step key={index} completed={!!step.time}>
                <StepLabelStyled>
                  <Typography variant="body1">{step.label}</Typography>
                  <Typography variant="caption">
                    {formatTime(step.time)}
                  </Typography>
                </StepLabelStyled>
              </Step>
            ))}
          </Stepper>
        </StepperContainer>
        <Divider sx={{ marginY: 2 }} />
      </Paper>
    </Box>
  );
};

export default TodayLogCard;
