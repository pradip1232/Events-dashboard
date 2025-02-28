import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button } from "@mui/material";





const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"];

const genderOptions = ["Male", "Female", "Other"];

const ViewForm = () => {

    const [formFields, setFormFields] = useState([]);
    const location = useLocation();
    const [eventName, setEventName] = useState("");
    const [eventId, setEventId] = useState("");
    const [formId, setFormId] = useState("");
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({});


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const eName = queryParams.get("e-name");
        const ed = queryParams.get("ed");
        const fid = queryParams.get("fid");

        setEventName(eName || "");  // Default to empty string if not found
        setEventId(ed || "");
        setFormId(fid || "");
        if (ed && fid) {
            fetchFormData(ed, fid);
        }

        // Debugging: Log values to check if they are correctly extracted
        console.log("Extracted Event Name:", eName);
        console.log("Extracted Event ID:", ed);
        console.log("Extracted Form ID:", fid);
    }, [location.search]);


    // Fetch form data from API
    const fetchFormData = async (eventId, formId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost/events/get_form_data.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ eventId, formId }),
            });

            const result = await response.json();

            if (result.success) {
                setFormData(result.data); // Store received data in state
                initializeFormValues(result.data.form_data);
            } else {
                setError(result.message || "Failed to fetch form data.");
            }
        } catch (err) {
            setError("Server error, please try again.");
            console.error("Error fetching form data:", err);
        } finally {
            setLoading(false);
        }
    };

    // const handleSubmitSelection = () => {
    //     setFormFields(selectedFields);
    //     setSubmitted(true);
    // };

    // Initialize state for form values
    const initializeFormValues = (fields) => {
        let initialValues = {};
        fields.forEach((field) => {
            initialValues[field] = ""; // Default empty value
        });
        setFormValues(initialValues);
    };

    // Handle input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if (!formData || !formData.form_data) {
            alert("No form data available to submit.");
            return;
        }

        console.log("Raw formData:", formData);
        console.log("Raw formValues:", formValues);

        // Extract only the fields that exist in `formData.form_data`
        const filteredFormValues = {};
        formData.form_data.forEach((field) => {
            if (formValues[field]) {
                filteredFormValues[field] = formValues[field];
            } else {
                console.log(`Skipping empty field: ${field}`);
            }
        });

        console.log("Filtered formValues to send:", filteredFormValues);

        const formDataToSend = {
            eventId,
            formId,
            formValues: filteredFormValues, // Send only required fields
        };

        console.log("Final formDataToSend:", formDataToSend);


        fetch("http://localhost/events/submit_form.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formDataToSend),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    alert("Form submitted successfully!");
                    window.location.reload();
                } else {
                    alert("Error submitting form: " + data.message);
                }
            })
            .catch((error) => console.error("Error submitting form:", error));
    };


    return (
        <div>
            {/* hello */}
            {/* Display fetched form data */}
            {/* {formData && (
                <div>
                    <h3>Form Data</h3>
                    <pre>{JSON.stringify(formData, null, 2)}</pre>
                </div>
            )} */}
            <div style={{ padding: "20px" }}>
                <h2>Fill the Form</h2>

                {formData && formData.form_data.map((field, index) => (
                    <div key={index} style={{ marginBottom: "15px" }}>
                        {/* Text Fields */}
                        {["First Name", "Last Name", "Phone Number", "Company Name", "City", "Job Title", "Notes"].includes(field) && (
                            <TextField
                                fullWidth
                                label={field}
                                name={field}
                                value={formValues[field] || ""}
                                onChange={handleInputChange}
                            />
                        )}
                        {/* Email Field */}
                        {field === "Email" && (
                            <TextField
                                fullWidth
                                type="email"
                                label={field}
                                name="email"
                                value={formValues["email"] || ""}
                                onChange={handleInputChange}
                            />
                        )}

                        {/* Select Fields */}
                        {field === "Country" && (
                            <FormControl fullWidth>
                                <InputLabel>Country</InputLabel>
                                <Select name="Country" value={formValues["Country"] || ""} onChange={handleInputChange}>
                                    <MenuItem value="India">India</MenuItem>
                                    <MenuItem value="USA">USA</MenuItem>
                                    <MenuItem value="UK">UK</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                        {/* State Dropdown */}
                        {field === "State" && (
                            <FormControl fullWidth>
                                <InputLabel>State</InputLabel>
                                <Select name="State" value={formValues["State"] || ""} onChange={handleInputChange}>
                                    {indianStates.map((state, i) => (
                                        <MenuItem key={i} value={state}>{state}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {field === "Gender" && (
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select name="Gender" value={formValues["Gender"] || ""} onChange={handleInputChange}>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {/* Date Field */}
                        {field === "Date of Birth" && (
                            <TextField
                                fullWidth
                                type="date"
                                name="Date of Birth"
                                value={formValues["Date of Birth"] || ""}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                ))}

                {/* Submit Button */}
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </div>
    )
}

export default ViewForm
