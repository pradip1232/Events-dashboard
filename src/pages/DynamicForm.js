import React, { useState, useEffect } from "react";
import { Container, FormControlLabel, Checkbox, Button, TextField, Grid, Typography, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToggleButton, ToggleButtonGroup, Box, Card, CardContent, List, ListItem, ListItemText, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary, {
    accordionSummaryClasses,
} from '@mui/joy/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';


const customFields = [
    "First Name", "Last Name", "Email", "Phone Number", "Address", "City", "State", "Country", "Zip Code",
    "Company Name", "Job Title", "Date of Birth", "Gender", "Marital Status", "Notes"
];

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"];

const genderOptions = ["Male", "Female", "Other"];

const DynamicForm = () => {
    const [selectedFields, setSelectedFields] = useState([]);
    const [formFields, setFormFields] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [savedForms, setSavedForms] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const storedForms = JSON.parse(localStorage.getItem("savedForms")) || [];
        setSavedForms(storedForms);
    }, []);

    const handleFieldSelection = (field) => {
        setSelectedFields(prev =>
            prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
        );
    };

    const handleSubmitSelection = () => {
        setFormFields(selectedFields);
        setSubmitted(true);
    };

    const handleSaveForm = async (eventId) => {
        if (!eventId) return;

        const newForm = { id: Date.now(), fields: formFields, eventId };
        console.log("DATE IDDDDDDDDDD ", Date.now());
        // Save in LocalStorage (optional, for temporary storage)
        const updatedForms = { ...savedForms };
        if (!updatedForms[eventId]) {
            updatedForms[eventId] = [];
        }
        updatedForms[eventId].push(newForm);
        setSavedForms(updatedForms);
        localStorage.setItem("savedForms", JSON.stringify(updatedForms));

        // Send to Backend for Database Storage
        try {
            const response = await fetch("http://localhost/events/save_form.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newForm),
            });

            const result = await response.json();
            console.log("Server Response:", result);
        } catch (error) {
            console.error("Error saving form:", error);
        }

        setSubmitted(false);
        setSelectedFields([]);
    };


    const handleLaunchForm = async (eventId, formId) => {
        try {
            const response = await fetch("http://localhost/events/update_form_status.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ eventId, formId }),
            });

            const result = await response.json();
            if (result.success) {
                console.log("Form status updated successfully!");
            } else {
                console.error("Failed to update form status:", result.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };





    const handleCancel = () => {
        setSubmitted(false);
        setSelectedFields([]);
    };


    const handleViewEvent = (event) => {
        alert(`Event: ${event.name}\nType: ${event.type}\nCreated on: ${event.date}`);
    };

    const handleRemoveEvent = async (id) => {
        try {
            const response = await fetch(`http://localhost/events/delete_event.php?id=${id}`, {
                method: "DELETE",
            });

            const result = await response.json();
            if (result.status === "success") {
                setEvents(events.filter((event) => event.id !== id));
                window.reload();
            } else {
                alert("Failed to delete event");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    // view the created event from the DB 
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

    return (

        <>
            <AccordionGroup
                sx={{
                    maxWidth: 800,
                    [`& .${accordionSummaryClasses.indicator}`]: {
                        transition: '0.2s',
                    },
                    [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
                        transform: 'rotate(45deg)',
                    },
                }}
            >
                <Container>
                    {events.length > 0 ? (
                        events.map((event) => (
                            <Card key={event.id} className="max-w-md shadow-lg rounded-2xl mt-5">
                                <CardContent>
                                    <Accordion>


                                        <AccordionSummary indicator={<AddIcon />}>
                                            <Typography variant="h6" textAlign="center" gutterBottom>
                                                {event.name} - {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                            </Typography>
                                            <List>
                                                <ListItem divider>
                                                    <ListItemText primary={`Created on: ${event.date}`} />
                                                    {/* <IconButton color="secondary" onClick={() => console.log("Delete Event", event.id)}>
                                                        <DeleteIcon />
                                                    </IconButton> */}
                                                </ListItem>
                                            </List>
                                        </AccordionSummary>
                                        <AccordionDetails>

                                            <Typography variant="h6">Select Fields for {event.name}</Typography>
                                            {/* this is form creating code  */}

                                            <Container maxWidth="sm" style={{ marginTop: 20 }}>
                                                {!submitted ? (
                                                    <>
                                                        <Typography variant="h5" gutterBottom>Select Fields for the Form</Typography>
                                                        <Grid container spacing={1}>
                                                            {customFields.map((field, index) => (
                                                                <Grid item xs={6} key={index}>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={selectedFields.includes(field)}
                                                                                onChange={() => handleFieldSelection(field)}
                                                                            />
                                                                        }
                                                                        label={field}
                                                                    />
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSubmitSelection}
                                                            style={{ marginTop: 20 }}
                                                            disabled={selectedFields.length === 0}
                                                        >
                                                            Generate Form
                                                        </Button>

                                                        {savedForms.length > 0 && (
                                                            <>
                                                                <Typography variant="h6" style={{ marginTop: 20 }}>Saved Forms</Typography>
                                                                {savedForms.map((form, index) => (
                                                                    <div key={index} style={{ marginBottom: 10 }}>
                                                                        <Typography>Template {index + 1}: {form.fields.join(", ")}</Typography>
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="primary"
                                                                            size="small"
                                                                            style={{ marginRight: 10, marginTop: 5 }}
                                                                            onClick={() => {
                                                                                setFormFields(form.fields);
                                                                                setSubmitted(true);
                                                                            }}
                                                                        >
                                                                            View Created Form
                                                                        </Button>
                                                                        {/* <Button
                                                                            variant="outlined"
                                                                            color="secondary"
                                                                            size="small"
                                                                            style={{ marginTop: 5 }}
                                                                            onClick={() => {
                                                                                const updatedForms = savedForms.filter((_, i) => i !== index);
                                                                                setSavedForms(updatedForms);
                                                                                localStorage.setItem("savedForms", JSON.stringify(updatedForms));
                                                                            }}
                                                                        >
                                                                            Remove This Form
                                                                        </Button> */}
                                                                    </div>
                                                                ))}
                                                            </>
                                                        )}


                                                    </>
                                                ) : (
                                                    <>
                                                        <Typography variant="h5" gutterBottom>Generated Form</Typography>
                                                        <Grid container spacing={2}>
                                                            {formFields.map((field, index) => (
                                                                <Grid item xs={12} key={index}>
                                                                    {field === "Date of Birth" ? (
                                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                            <DatePicker label="Date of Birth" fullWidth />
                                                                        </LocalizationProvider>
                                                                    ) : field === "State" ? (
                                                                        <TextField fullWidth label="State" select variant="outlined">
                                                                            {indianStates.map((state, i) => (
                                                                                <MenuItem key={i} value={state}>{state}</MenuItem>
                                                                            ))}
                                                                        </TextField>
                                                                    ) : field === "Gender" ? (
                                                                        <TextField fullWidth label="Gender" select variant="outlined">
                                                                            {genderOptions.map((gender, i) => (
                                                                                <MenuItem key={i} value={gender}>{gender}</MenuItem>
                                                                            ))}
                                                                        </TextField>
                                                                    ) : field === "Zip Code" || field === "Phone Number" ? (
                                                                        <TextField fullWidth label={field} variant="outlined" type="number" />
                                                                    ) : (
                                                                        <TextField fullWidth label={field} variant="outlined" />
                                                                    )}
                                                                </Grid>
                                                            ))}
                                                        </Grid>

                                                        {/* 
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSaveForm}
                                                            style={{ marginTop: 20 }}
                                                        >
                                                            Save Form
                                                        </Button> */}

                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleSaveForm(event.id)}
                                                            style={{ marginTop: 20 }}
                                                        >
                                                            Save Form for {event.name}
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={handleCancel}
                                                            style={{ marginTop: 20, marginLeft: 10 }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </>
                                                )}
                                            </Container>

                                            {savedForms[event.id] && savedForms[event.id].length > 0 && (
                                                <>
                                                    <Typography variant="h6" style={{ marginTop: 20 }}>Saved Forms for {event.name}</Typography>
                                                    {savedForms[event.id].map((form, index) => (
                                                        <Card key={form.id} className="shadow-md rounded-xl mt-3">
                                                            <CardContent>
                                                                <Typography>Form {index + 1}::  {form.fields.join(", ")}</Typography>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    size="small"
                                                                    style={{ marginTop: 5 }}
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
                                                                    className="mx-3"
                                                                    style={{ marginTop: 5 }}
                                                                    onClick={() => handleLaunchForm(event.id, form.id)}
                                                                >
                                                                    Launch this form
                                                                </Button>
                                                                {/* <Button
                                                                    variant="outlined"
                                                                    color="secondary"
                                                                    size="small"
                                                                    style={{ marginTop: 5 }}
                                                                    onClick={() => {
                                                                        const updatedForms = savedForms.filter((_, i) => i !== index);
                                                                        setSavedForms(updatedForms);
                                                                        localStorage.setItem("savedForms", JSON.stringify(updatedForms));
                                                                    }}
                                                                >
                                                                    Remove This Form
                                                                </Button> */}
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="h6" textAlign="center" style={{ marginTop: 20 }}>
                            No Events Created Yet
                        </Typography>
                    )}
                </Container>












            </AccordionGroup>

        </>
    );
};

export default DynamicForm;
