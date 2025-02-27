import React, { useState, useEffect } from "react";
import { Container, FormControlLabel, Checkbox, Button, TextField, Grid, Typography, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const customFields = [
    "First Name", "Last Name", "Email", "Phone Number", "Address", "City", "State", "Country", "Zip Code",
    "Company Name", "Job Title", "Date of Birth", "Gender", "Marital Status", "Notes"
];

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
];

const genderOptions = ["Male", "Female", "Other"];

const DynamicForm = () => {
    const [selectedFields, setSelectedFields] = useState([]);
    const [formFields, setFormFields] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [savedForms, setSavedForms] = useState([]);

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

    const handleSaveForm = () => {
        const newForm = { id: Date.now(), fields: formFields };
        const updatedForms = [...savedForms, newForm];
        setSavedForms(updatedForms);
        localStorage.setItem("savedForms", JSON.stringify(updatedForms));
        setSubmitted(false);
        setSelectedFields([]);
    };

    const handleCancel = () => {
        setSubmitted(false);
        setSelectedFields([]);
    };

    return (
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
                                    <Button
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
                                    </Button>
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

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveForm}
                        style={{ marginTop: 20 }}
                    >
                        Save Form
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
    );
};

export default DynamicForm;
