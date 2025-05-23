import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepButton,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Container,
  Grid,
  Input,
} from "@mui/material";
import {
  Visibility,
  Delete,
  Add as AddIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const steps = [
  "Select Event Type",
  "Event Creation",
  "Event Details",
  "Form Creation",
  "Email Template",
  "Volunteer Management",
];

const customFields = [
  "First Name",
  "Last Name",
  "Email",
  "Phone Number",
  "Address",
  "City",
  "State",
  "Country",
  "Zip Code",
  "Company Name",
  "Job Title",
  "Date of Birth",
  "Gender",
  "Marital Status",
  "Notes",
];

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
];

const genderOptions = ["Male", "Female", "Other"];

const fieldTypes = [
  { label: "Text", value: "text" },
  { label: "Date", value: "date" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Paragraph", value: "paragraph" },
];

const Events = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [eventType, setEventType] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [eventData, setEventData] = useState({
    name: "",
    startDateTime: "",
    volunteersRequired: "",
    eventLocation: "",
    numberOfSteps: "",
    date: "",
    venue: "",
    descriptions: "",
    time: "",
    guestLevel: "",
    formType: "",
    formName: "",
    logo: null,
    emailTemplateType: "",
    emailContent: "",
    socialMedia: {
      facebook: false,
      twitter: false,
      instagram: false,
      linkedin: false,
    },
    volunteers: [],
  });
  const [selectedFields, setSelectedFields] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [savedForms, setSavedForms] = useState({});
  const [customFormFields, setCustomFormFields] = useState([]);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [eventId, setEventId] = useState(null);

  // Fetch events from backend on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost/events/get_events.php");
        const data = await response.json();
        if (data.status === "success") {
          setEvents(data.events);
        } else {
          console.error("Failed to fetch events:", data.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;

  const validateStep = () => {
    const newErrors = {};
    if (activeStep === 0) {
      if (!eventType) newErrors.eventType = "Event type is required";
    }
    // else if (activeStep === 1) {
    //   if (!eventData.name) newErrors.name = "Event name is required";
    //   if (!eventData.startDateTime)
    //     newErrors.startDateTime = "Start date and time are required";
    //   if (!eventData.volunteersRequired || eventData.volunteersRequired < 1)
    //     newErrors.volunteersRequired = "Number of checkpoints must be at least 1";
    //   if (!eventData.eventLocation)
    //     newErrors.eventLocation = "Event location is required";
    //   if (
    //     !eventData.numberOfSteps ||
    //     eventData.numberOfSteps < 1 ||
    //     eventData.numberOfSteps > 5
    //   )
    //     newErrors.numberOfSteps = "Number of steps must be between 1 and 5";
    // }
    else if (activeStep === 2) {
      if (!eventId) newErrors.eventId = "Please select an event";
      if (!eventData.date) newErrors.date = "End date is required";
      if (!eventData.descriptions)
        newErrors.descriptions = "Description is required";
      if (!eventData.venue) newErrors.venue = "Venue is required";
      if (!eventData.time) newErrors.time = "Time is required";
      if (!eventData.guestLevel)
        newErrors.guestLevel = "Guest level is required";
    }
    // else if (activeStep === 3) {
    //   if (!eventData.formType) newErrors.formType = "Form type is required";
    //   if (!eventData.formName) newErrors.formName = "Form name is required";
    // }
    // else if (activeStep === 4) {
    //   if (!eventData.emailTemplateType)
    //     newErrors.emailTemplateType = "Email template type is required";
    //   if (!eventData.emailContent)
    //     newErrors.emailContent = "Email content is required";
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 1 && events.length === 0) {
      toast.error("Please create at least one event before proceeding.");
      return;
    }
    if (validateStep()) {
      const newActiveStep =
        isLastStep() && completedSteps() !== totalSteps()
          ? steps.findIndex((step, i) => !(i in completed))
          : activeStep + 1;
      setActiveStep(newActiveStep);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    if (step > 1 && events.length === 0) {
      toast.error(
        "Please create at least one event before accessing later steps."
      );
      return;
    }
    setActiveStep(step);
  };

  const handleComplete = () => {
    if (validateStep()) {
      setCompleted({ ...completed, [activeStep]: true });
      handleNext();
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setEventType(null);
    setEvents([]);
    setErrors({});
    setEventData({
      name: "",
      startDateTime: "",
      volunteersRequired: "",
      eventLocation: "",
      numberOfSteps: "",
      date: "",
      venue: "",
      descriptions: "",
      time: "",
      guestLevel: "",
      formType: "",
      formName: "",
      logo: null,
      emailTemplateType: "",
      emailContent: "",
      socialMedia: {
        facebook: false,
        twitter: false,
        instagram: false,
        linkedin: false,
      },
      volunteers: [],
    });
    setSelectedFields([]);
    setFormFields([]);
    setSubmitted(false);
    setSavedForms({});
    setCustomFormFields([]);
    setGeneratedUrl("");
    setEventId(null);
  };

  const handleEventType = (event, newType) => {
    if (newType !== null) {
      setEventType(newType);
      setErrors({ ...errors, eventType: "" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file && file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, logo: "File size exceeds 2MB" });
        return;
      }
      setEventData({ ...eventData, [name]: file });
    } else if (type === "checkbox") {
      setEventData({
        ...eventData,
        socialMedia: { ...eventData.socialMedia, [name]: checked },
      });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const addVolunteer = () => {
    const newVolunteer = {
      id: Math.random().toString(36).substr(2, 9),
      password: Math.random().toString(36).substr(2, 8),
      level: "",
    };
    setEventData({
      ...eventData,
      volunteers: [...eventData.volunteers, newVolunteer],
    });
  };

  const handleVolunteerChange = (index, field, value) => {
    const updatedVolunteers = [...eventData.volunteers];
    updatedVolunteers[index][field] = value;
    setEventData({ ...eventData, volunteers: updatedVolunteers });
  };

  const saveEventsToLocalStorage = (updatedEvents) => {
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const handleCreateEvent = async () => {
    if (!validateStep()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }
    setLoading(true);
    try {
      const formData = {
        name: eventData.name.trim(),
        type: eventType,
        startDateTime: eventData.startDateTime,
        volunteersRequired: parseInt(eventData.volunteersRequired, 10),
        eventLocation: eventData.eventLocation.trim(),
        numberOfSteps: parseInt(eventData.numberOfSteps, 10),
      };

      if (
        !formData.name ||
        !formData.type ||
        !formData.startDateTime ||
        isNaN(formData.volunteersRequired) ||
        !formData.eventLocation ||
        isNaN(formData.numberOfSteps)
      ) {
        toast.error("Invalid input data. Please check all fields.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost/events/save_event.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      const event_id = result.id;
      setEventId(event_id);

      if (result.status === "success") {
        const newEvent = {
          id: result.id,
          ...formData,
          date: new Date().toLocaleString(),
        };
        const updatedEvents = [newEvent, ...events];
        setEvents(updatedEvents);
        saveEventsToLocalStorage(updatedEvents);
        setEventData({
          ...eventData,
          name: "",
          startDateTime: "",
          volunteersRequired: "",
          eventLocation: "",
          numberOfSteps: "",
        });
        setEventType(null);
        setCompleted({ ...completed, [activeStep]: true });
        toast.success(result.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.error("API Error:", result);
        toast.error(result.message || "Failed to create event", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error(`Error creating event: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvent = (event) => {
    toast.info(
      `Viewing event: ${event.name}\nType: ${event.type}\nDate: ${event.date}\nLocation: ${event.eventLocation}\nCheckpoints: ${event.volunteersRequired}\nSteps: ${event.numberOfSteps}`,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const handleRemoveEvent = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/events/delete_event.php?id=${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        const updatedEvents = events.filter((event) => event.id !== id);
        setEvents(updatedEvents);
        saveEventsToLocalStorage(updatedEvents);
        if (eventId === id) setEventId(null);
        toast.success("Event removed successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error("Failed to delete event", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(`Error deleting event: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Dynamic Form Handlers
  const handleFieldSelection = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleSubmitSelection = () => {
    setFormFields(selectedFields);
    setSubmitted(true);
  };

  const handleSaveForm = async (eventId) => {
    if (!eventId || selectedFields.length === 0) {
      toast.error("Please select an event and at least one field.");
      return;
    }

    const newForm = {
      id: Date.now(),
      fields: formFields,
      eventId,
      formType: eventData.formType,
      formName: eventData.formName,
    };

    try {
      const response = await fetch("http://localhost/events/save_form.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });

      const result = await response.json();

      if (result.status === "success") {
        const updatedForms = { ...savedForms };
        if (!updatedForms[eventId]) updatedForms[eventId] = [];
        updatedForms[eventId].push(newForm);
        setSavedForms(updatedForms);
        localStorage.setItem("savedForms", JSON.stringify(updatedForms));
        setSubmitted(false);
        setSelectedFields([]);
        setCustomFormFields([]);
        toast.success("Form saved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(result.message || "Failed to save form", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error(`Error saving form: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleLaunchForm = async (eventId, formId, eventName) => {
    try {
      const response = await fetch(
        "http://localhost/events/update_form_status.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, formId }),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        const newUrl = `${window.location.origin}/events-form?e-name=${encodeURIComponent(eventName)}&ed=${eventId}&fid=${formId}`;
        setGeneratedUrl(newUrl);
        toast.success("Form launched successfully! URL generated.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(result.message || "Failed to launch form", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error launching form:", error);
      toast.error(`Error launching form: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCancel = () => {
    setSubmitted(false);
    setSelectedFields([]);
    setCustomFormFields([]);
  };

  const addCustomField = () => {
    setCustomFormFields([...customFormFields, { name: "", type: "text" }]);
  };

  const handleCustomFieldChange = (index, key, value) => {
    const newFields = [...customFormFields];
    newFields[index][key] = value;
    setCustomFormFields(newFields);
    if (
      key === "name" &&
      value.trim() !== "" &&
      !selectedFields.includes(value)
    ) {
      setSelectedFields([...selectedFields, value]);
    }
  };

  const handleSubmitEventDetails = async (event) => {
    event.preventDefault();

    // Client-side validation
    const newErrors = {};
    if (!eventId) newErrors.eventId = "Please select an event";
    if (!eventData.date) newErrors.date = "End date is required";
    if (!eventData.descriptions)
      newErrors.descriptions = "Description is required";
    if (!eventData.venue) newErrors.venue = "Venue is required";
    if (!eventData.time) newErrors.time = "Time is required";
    if (!eventData.guestLevel) newErrors.guestLevel = "Guest level is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const formData = {
        event_id: eventId,
        date: eventData.date,
        descriptions: eventData.descriptions.trim(),
        venue: eventData.venue.trim(),
        time: eventData.time,
        guestLevel: eventData.guestLevel,
      };

      const response = await fetch(
        "http://localhost/events/save_events-details.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Event details submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setEventData({
          ...eventData,
          date: "",
          descriptions: "",
          venue: "",
          time: "",
          guestLevel: "",
        });
        setErrors({});
        setCompleted({ ...completed, [activeStep]: true });
      } else {
        toast.error(data.message || "Failed to submit event details", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error submitting event details:", error);
      toast.error(`Error submitting event details: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              textAlign="center"
              sx={{ fontWeight: 600, color: "#1976d2", marginBottom: 3 }}
            >
              Select Event Type
            </Typography>
            <ToggleButtonGroup
              value={eventType}
              exclusive
              onChange={handleEventType}
              fullWidth
              color="primary"
              sx={{
                "& .MuiToggleButton-root": {
                  border: "2px solid #1976d2",
                  borderRadius: "8px",
                  margin: "0 8px",
                  transition: "all 0.2s",
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "white",
                    "&:hover": { backgroundColor: "#1565c0" },
                  },
                },
              }}
            >
              <ToggleButton
                value="free"
                sx={{ padding: "12px 24px", fontWeight: "bold" }}
              >
                Free
              </ToggleButton>
              <ToggleButton
                value="paid"
                sx={{ padding: "12px 24px", fontWeight: "bold" }}
              >
                Paid
              </ToggleButton>
            </ToggleButtonGroup>
            {errors.eventType && (
              <Typography color="error" sx={{ mt: 2 }}>
                {errors.eventType}
              </Typography>
            )}
          </CardContent>
        );
      case 1:
        return (
          <>
            <Card
              sx={{
                maxWidth: "600px",
                width: "90%",
                marginTop: 4,
                marginLeft: "auto",
                marginRight: "auto",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                borderRadius: "16px",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ padding: 4 }}>
                <Typography
                  variant="h6"
                  textAlign="center"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "#1976d2", marginBottom: 3 }}
                >
                  Create New{" "}
                  {eventType
                    ? eventType.charAt(0).toUpperCase() + eventType.slice(1)
                    : ""}{" "}
                  Event
                </Typography>
                <TextField
                  label="Event Name"
                  variant="outlined"
                  fullWidth
                  value={eventData.name}
                  onChange={handleInputChange}
                  name="name"
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{
                    marginBottom: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
                <TextField
                  label="Start Date & Time"
                  type="datetime-local"
                  variant="outlined"
                  fullWidth
                  value={eventData.startDateTime}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const now = new Date();
                    if (selectedDate < now) {
                      toast.error("Cannot select past dates.");
                      setEventData({ ...eventData, startDateTime: "" });
                    } else {
                      setEventData({
                        ...eventData,
                        startDateTime: e.target.value,
                      });
                    }
                    setErrors({ ...errors, startDateTime: "" });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().slice(0, 16) }}
                  error={!!errors.startDateTime}
                  helperText={errors.startDateTime}
                  sx={{
                    marginBottom: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
                <TextField
                  label="Number of Checkpoints"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={eventData.volunteersRequired}
                  onChange={handleInputChange}
                  name="volunteersRequired"
                  error={!!errors.volunteersRequired}
                  helperText={errors.volunteersRequired}
                  inputProps={{ min: 1 }}
                  sx={{
                    marginBottom: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
                <TextField
                  label="Event Location"
                  variant="outlined"
                  fullWidth
                  value={eventData.eventLocation}
                  onChange={handleInputChange}
                  name="eventLocation"
                  error={!!errors.eventLocation}
                  helperText={errors.eventLocation}
                  sx={{
                    marginBottom: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
                <TextField
                  label="Type Of Guest Registrations"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={eventData.numberOfSteps}
                  onChange={handleInputChange}
                  name="numberOfSteps"
                  error={!!errors.numberOfSteps}
                  helperText={
                    errors.numberOfSteps ||
                    "Enter number of steps (1-5) to complete the event"
                  }
                  inputProps={{ min: 1, max: 5 }}
                  sx={{
                    marginBottom: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCreateEvent}
                  disabled={loading || !eventType}
                  sx={{
                    marginTop: 2,
                    padding: "12px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#1565c0" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </CardContent>
            </Card>
            {events.length > 0 && (
              <Card
                sx={{
                  maxWidth: "600px",
                  width: "90%",
                  marginTop: 4,
                  marginBottom: 4,
                  marginLeft: "auto",
                  marginRight: "auto",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  borderRadius: "16px",
                }}
              >
                <CardContent sx={{ padding: 4 }}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    gutterBottom
                    sx={{ fontWeight: 600, color: "#1976d2", marginBottom: 3 }}
                  >
                    Created Events
                  </Typography>
                  <List sx={{ width: "100%" }}>
                    {events.map((event) => (
                      <ListItem
                        key={event.id}
                        divider
                        sx={{
                          borderRadius: "8px",
                          marginBottom: 1,
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography sx={{ fontWeight: 500 }}>
                              #{event.id} - {event.name} (
                              {event.type.charAt(0).toUpperCase() +
                                event.type.slice(1)}
                              )
                            </Typography>
                          }
                          secondary={`Created on: ${event.date}`}
                        />
                        <IconButton
                          color="primary"
                          onClick={() => handleViewEvent(event)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.1)",
                            },
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleRemoveEvent(event.id)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(211, 47, 47, 0.1)",
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </>
        );
      case 2:
        return (
          <Card>
            <CardContent sx={{ padding: 4 }}>
              <Typography
                variant="h6"
                textAlign="center"
                gutterBottom
                sx={{ fontWeight: 600, color: "#1976d2", marginBottom: 3 }}
              >
                Event Details
              </Typography>

              <form onSubmit={handleSubmitEventDetails} noValidate>
                <FormControl
                  fullWidth
                  sx={{ marginBottom: 3 }}
                  error={!!errors.eventId}
                >
                  <InputLabel>Select Event</InputLabel>
                  <TextField
                    // label="Selected Event ID"
                    value={eventId}
                    fullWidth
                    disabled
                    sx={{
                      marginBottom: 3,
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                    }}
                  />
                 
                </FormControl>

                <TextField
                  label="End Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={eventData.date}
                  onChange={handleInputChange}
                  name="date"
                  helperText={errors.date}
                  error={!!errors.date}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    marginBottom: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />

                <TextField
                  label="Descriptions"
                  variant="outlined"
                  fullWidth
                  value={eventData.descriptions}
                  onChange={handleInputChange}
                  name="descriptions"
                  helperText={errors.descriptions}
                  error={!!errors.descriptions}
                  sx={{
                    marginBottom: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />

                <TextField
                  label="Venue"
                  variant="outlined"
                  fullWidth
                  value={eventData.venue}
                  onChange={handleInputChange}
                  name="venue"
                  helperText={errors.venue}
                  error={!!errors.venue}
                  sx={{
                    marginBottom: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />

                <TextField
                  label="Time"
                  type="time"
                  variant="outlined"
                  fullWidth
                  value={eventData.time}
                  onChange={handleInputChange}
                  name="time"
                  helperText={errors.time}
                  error={!!errors.time}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    marginBottom: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />

                <FormControl
                  fullWidth
                  sx={{ marginBottom: 3 }}
                  error={!!errors.guestLevel}
                >
                  <InputLabel>Guest Level</InputLabel>
                  <Select
                    name="guestLevel"
                    value={eventData.guestLevel}
                    onChange={handleInputChange}
                    label="Guest Level"
                  >
                    <MenuItem value="VIP">VIP</MenuItem>
                    <MenuItem value="General">General</MenuItem>
                  </Select>
                  {errors.guestLevel && (
                    <Typography color="error" variant="body2">
                      {errors.guestLevel}
                    </Typography>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ borderRadius: "8px" }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <CardContent sx={{ padding: 4 }}>
            <Typography
              variant="h6"
              textAlign="center"
              gutterBottom
              sx={{ fontWeight: 600, color: "#1976d2", marginBottom: 3 }}
            >
              Form Creation
            </Typography>
            <AccordionGroup
              sx={{
                maxWidth: 800,
                marginTop: 4,
                [`& .${accordionSummaryClasses.indicator}`]: {
                  transition: "0.2s",
                },
                [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]:
                  {
                    transform: "rotate(45deg)",
                  },
              }}
            >
              <Container>
                {events.length > 0 ? (
                  events.map((event) => (
                    <Card
                      key={event.id}
                      sx={{
                        maxWidth: 600,
                        marginBottom: 3,
                        borderRadius: "16px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      <CardContent>
                        <Accordion>
                          <AccordionSummary indicator={<AddIcon />}>
                            <Typography
                              variant="h6"
                              textAlign="center"
                              gutterBottom
                            >
                              {event.name} -{" "}
                              {event.type.charAt(0).toUpperCase() +
                                event.type.slice(1)}
                            </Typography>
                            <List>
                              <ListItem divider>
                                <ListItemText
                                  primary={`Created on: ${event.date}`}
                                />
                              </ListItem>
                            </List>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="h6">
                              Select Fields for {event.name}
                            </Typography>
                            <Container maxWidth="sm" sx={{ marginTop: 2 }}>
                              {!submitted ? (
                                <>
                                  <Typography variant="h5" gutterBottom>
                                    Select Fields for the Form
                                  </Typography>
                                  <Grid container spacing={1}>
                                    {customFields.map((field, index) => (
                                      <Grid item xs={6} key={index}>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={selectedFields.includes(
                                                field
                                              )}
                                              onChange={() =>
                                                handleFieldSelection(field)
                                              }
                                            />
                                          }
                                          label={field}
                                        />
                                      </Grid>
                                    ))}
                                    <Typography
                                      variant="h6"
                                      gutterBottom
                                      sx={{ width: "100%", mt: 2 }}
                                    >
                                      Custom Fields
                                    </Typography>
                                    {customFormFields.map((field, index) => (
                                      <Grid
                                        container
                                        spacing={1}
                                        key={index}
                                        sx={{ mb: 1 }}
                                      >
                                        <Grid item xs={6}>
                                          <TextField
                                            label="Field Name"
                                            variant="outlined"
                                            fullWidth
                                            value={field.name}
                                            onChange={(e) =>
                                              handleCustomFieldChange(
                                                index,
                                                "name",
                                                e.target.value
                                              )
                                            }
                                            required
                                          />
                                        </Grid>
                                        <Grid item xs={6}>
                                          <TextField
                                            select
                                            label="Field Type"
                                            variant="outlined"
                                            fullWidth
                                            value={field.type}
                                            onChange={(e) =>
                                              handleCustomFieldChange(
                                                index,
                                                "type",
                                                e.target.value
                                              )
                                            }
                                          >
                                            {fieldTypes.map((option) => (
                                              <MenuItem
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </MenuItem>
                                            ))}
                                          </TextField>
                                        </Grid>
                                      </Grid>
                                    ))}
                                    <Grid item xs={12}>
                                      <IconButton
                                        color="primary"
                                        onClick={addCustomField}
                                        disabled={
                                          customFormFields.length > 0 &&
                                          customFormFields[
                                            customFormFields.length - 1
                                          ].name.trim() === ""
                                        }
                                      >
                                        <AddIcon />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmitSelection}
                                    sx={{ mt: 2 }}
                                    disabled={selectedFields.length === 0}
                                  >
                                    Generate Form
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Typography variant="h5" gutterBottom>
                                    Generated Form
                                  </Typography>
                                  <Grid container spacing={2}>
                                    {formFields.map((field, index) => (
                                      <Grid item xs={12} key={index}>
                                        {field === "Date of Birth" ? (
                                          <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                          >
                                            <DatePicker
                                              label="Date of Birth"
                                              fullWidth
                                            />
                                          </LocalizationProvider>
                                        ) : field === "State" ? (
                                          <TextField
                                            fullWidth
                                            label="State"
                                            select
                                            variant="outlined"
                                          >
                                            {indianStates.map((state, i) => (
                                              <MenuItem key={i} value={state}>
                                                {state}
                                              </MenuItem>
                                            ))}
                                          </TextField>
                                        ) : field === "Gender" ? (
                                          <TextField
                                            fullWidth
                                            label="Gender"
                                            select
                                            variant="outlined"
                                          >
                                            {genderOptions.map((gender, i) => (
                                              <MenuItem key={i} value={gender}>
                                                {gender}
                                              </MenuItem>
                                            ))}
                                          </TextField>
                                        ) : field === "Zip Code" ||
                                          field === "Phone Number" ? (
                                          <TextField
                                            fullWidth
                                            label={field}
                                            variant="outlined"
                                            type="number"
                                          />
                                        ) : (
                                          <TextField
                                            fullWidth
                                            label={field}
                                            variant="outlined"
                                          />
                                        )}
                                      </Grid>
                                    ))}
                                  </Grid>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSaveForm(event.id)}
                                    sx={{ mt: 2, mr: 1 }}
                                  >
                                    Save Form for {event.name}
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleCancel}
                                    sx={{ mt: 2 }}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {savedForms[event.id] &&
                                savedForms[event.id].length > 0 && (
                                  <>
                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                      Saved Forms for {event.name}
                                    </Typography>
                                    {savedForms[event.id].map((form, index) => (
                                      <Card
                                        key={form.id}
                                        sx={{
                                          mt: 2,
                                          borderRadius: "8px",
                                          boxShadow:
                                            "0 2px 4px rgba(0,0,0,0.1)",
                                        }}
                                      >
                                        <CardContent>
                                          <Typography>
                                            Form {index + 1}:{" "}
                                            {form.fields.join(", ")}
                                          </Typography>
                                          <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            sx={{ mt: 1, mr: 1 }}
                                            onClick={() => {
                                              setFormFields(form.fields);
                                              setSubmitted(true);
                                            }}
                                          >
                                            View Form
                                          </Button>
                                          <Button
                                            variant="outlined"
                                            color="success"
                                            size="small"
                                            sx={{ mt: 1, mr: 1 }}
                                            onClick={() =>
                                              handleLaunchForm(
                                                event.id,
                                                form.id,
                                                event.name
                                              )
                                            }
                                          >
                                            Launch Form
                                          </Button>
                                          {generatedUrl &&
                                            generatedUrl.includes(
                                              `ed=${event.id}&fid=${form.id}`
                                            ) && (
                                              <IconButton
                                                onClick={() => {
                                                  navigator.clipboard.writeText(
                                                    generatedUrl
                                                  );
                                                  toast.success(
                                                    "URL copied to clipboard!",
                                                    {
                                                      position: "top-right",
                                                      autoClose: 3000,
                                                    }
                                                  );
                                                }}
                                                color="primary"
                                              >
                                                <ContentCopyIcon />
                                              </IconButton>
                                            )}
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </>
                                )}
                            </Container>
                          </AccordionDetails>
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>
                    No Events Created Yet
                  </Typography>
                )}
              </Container>
            </AccordionGroup>
          </CardContent>
        );
      case 4:
        return (
          <CardContent sx={{ padding: 4 }}>
            <Typography
              variant="h6"
              textAlign="center"
              gutterBottom
              sx={{ fontWeight: 600, color: "#1976d2", marginBottom: 3 }}
            >
              Email Template & Body
            </Typography>
            <FormControl
              fullWidth
              error={!!errors.emailTemplateType}
              sx={{ marginBottom: 3 }}
            >
              <InputLabel>Email Template Type</InputLabel>
              <Select
                name="emailTemplateType"
                value={eventData.emailTemplateType}
                onChange={handleInputChange}
              >
                <MenuItem value="text">Text Only</MenuItem>
                <MenuItem value="textWithImage">Text with Image</MenuItem>
              </Select>
              {errors.emailTemplateType && (
                <Typography color="error">
                  {errors.emailTemplateType}
                </Typography>
              )}
            </FormControl>
            <TextField
              label="Email Content"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={eventData.emailContent}
              onChange={handleInputChange}
              name="emailContent"
              error={!!errors.emailContent}
              helperText={errors.emailContent}
              sx={{
                marginBottom: 3,
                "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              }}
            />
            <div className="flex flex-wrap gap-4">
              {["facebook", "twitter", "instagram", "linkedin"].map(
                (social) => (
                  <FormControlLabel
                    key={social}
                    control={
                      <Checkbox
                        name={social}
                        checked={eventData.socialMedia[social]}
                        onChange={handleInputChange}
                      />
                    }
                    label={social.charAt(0).toUpperCase() + social.slice(1)}
                  />
                )
              )}
            </div>
          </CardContent>
        );
      case 5:
        return (
          <CardContent sx={{ padding: 4 }}>
            <Typography
              variant="h6"
              textAlign="center"
              gutterBottom
              sx={{ fontWeight: 600, color: "#1976d2", marginBottom: 3 }}
            >
              Volunteer Management
            </Typography>
            <Button
              variant="contained"
              onClick={addVolunteer}
              sx={{ marginBottom: 3 }}
            >
              Add Volunteer
            </Button>
            {eventData.volunteers.map((volunteer, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <TextField
                  fullWidth
                  label="Volunteer ID"
                  value={volunteer.id}
                  disabled
                  sx={{
                    marginBottom: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  value={volunteer.password}
                  disabled
                  sx={{
                    marginBottom: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel>Volunteer Level</InputLabel>
                  <Select
                    value={volunteer.level}
                    onChange={(e) =>
                      handleVolunteerChange(index, "level", e.target.value)
                    }
                  >
                    {[1, 2, 3, 4].map((level) => (
                      <MenuItem key={level} value={`Level ${level}`}>
                        Level {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            ))}
          </CardContent>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <Box
        sx={{
          maxWidth: "800px",
          margin: "auto",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          className="mb-4 text-center"
          sx={{ fontWeight: 600, color: "#1976d2" }}
        >
          Event Creation Wizard
        </Typography>
        <Stepper nonLinear activeStep={activeStep} sx={{ flexWrap: "wrap" }}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>
          {completedSteps() === totalSteps() ? (
            <>
              <Typography sx={{ mt: 2, mb: 1, textAlign: "center" }}>
                All steps completed - you're finished!
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </>
          ) : (
            <>
              <Typography sx={{ mt: 2, mb: 1, textAlign: "center" }}>
                Step {activeStep + 1}: {steps[activeStep]}
              </Typography>
              {loading ? (
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  {renderStepContent(activeStep)}
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleNext} sx={{ mr: 1 }}>
                      Next
                    </Button>
                    {activeStep !== steps.length &&
                      (completed[activeStep] ? (
                        <Typography
                          variant="caption"
                          sx={{ display: "inline-block" }}
                        >
                          Step {activeStep + 1} already completed
                        </Typography>
                      ) : (
                        <Button onClick={handleComplete}>
                          {isLastStep() ? "Finish" : "Complete Step"}
                        </Button>
                      ))}
                  </Box>
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </div>
  );
};
export default Events;
