import React, { useState, useEffect } from 'react';
import { ToggleButton, ToggleButtonGroup, TextField, Button, Box, Card, CardContent, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddNewEvents = () => {
    const [eventType, setEventType] = useState(null);
    const [eventName, setEventName] = useState('');
    const [events, setEvents] = useState([]);
    const [startDateTime, setStartDateTime] = useState('');
    const [volunteersRequired, setVolunteersRequired] = useState(1);
    const [eventLocation, setEventLocation] = useState('');
    const [numberOfSteps, setNumberOfSteps] = useState(1);

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        setEvents(storedEvents);
    }, []);

    const saveEventsToLocalStorage = (updatedEvents) => {
        localStorage.setItem('events', JSON.stringify(updatedEvents));
    };

    const handleChange = (event, newType) => {
        if (newType !== null) {
            setEventType(newType);
        }
    };

    const handleEventNameChange = (e) => {
        setEventName(e.target.value);
    };

    const handleCreateEvent = async (formData) => {
        if (eventName.trim()) {
            try {
                const response = await fetch("http://localhost/events/save_event.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: formData.name,
                        type: formData.type,
                        startDateTime: formData.startDateTime,
                        volunteersRequired: formData.volunteersRequired,
                        eventLocation: formData.eventLocation,
                        numberOfSteps: formData.numberOfSteps
                    })
                });

                const result = await response.json();

                if (result.status === "success") {
                    const updatedEvents = [{ ...formData, id: events.length + 1, date: new Date().toLocaleString() }, ...events];
                    setEvents(updatedEvents);
                    saveEventsToLocalStorage(updatedEvents);
                    setEventName("");
                    setStartDateTime("");
                    setVolunteersRequired(1);
                    setEventLocation("");
                    setNumberOfSteps(1);
                    setEventType(null);
                    toast.success(result.message || "Event created successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    toast.error(result.message || "Failed to create event", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } catch (error) {
                console.error("Error saving event:", error);
            }
        }
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
                window.location.reload();
            } else {
                alert("Failed to delete event");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

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
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            minHeight="100vh"
            paddingTop={5}
            sx={{
                backgroundColor: '#f5f5f5'
            }}
        >
            <Card sx={{
                maxWidth: '600px',
                width: '90%',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: '16px',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)'
                }
            }}>
                <CardContent sx={{ padding: 4 }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        textAlign="center"
                        sx={{
                            fontWeight: 600,
                            color: '#1976d2',
                            marginBottom: 3
                        }}
                    >
                        Select Event Type
                    </Typography>
                    <ToggleButtonGroup
                        value={eventType}
                        exclusive
                        onChange={handleChange}
                        fullWidth
                        color="primary"
                        sx={{
                            '& .MuiToggleButton-root': {
                                border: '2px solid #1976d2',
                                borderRadius: '8px',
                                margin: '0 8px',
                                transition: 'all 0.2s',
                                '&.Mui-selected': {
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#1565c0'
                                    }
                                }
                            }
                        }}
                    >
                        <ToggleButton value="free" sx={{ padding: '12px 24px', fontWeight: 'bold' }}>
                            Free
                        </ToggleButton>
                        <ToggleButton value="paid" sx={{ padding: '12px 24px', fontWeight: 'bold' }}>
                            Paid
                        </ToggleButton>
                    </ToggleButtonGroup>
                </CardContent>
            </Card>

            {eventType && (
                <Card sx={{
                    maxWidth: '600px',
                    width: '90%',
                    marginTop: 4,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    borderRadius: '16px',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px)'
                    }
                }}>
                    <CardContent sx={{ padding: 4 }}>
                        <Typography
                            variant="h6"
                            textAlign="center"
                            gutterBottom
                            sx={{
                                fontWeight: 600,
                                color: '#1976d2',
                                marginBottom: 3
                            }}
                        >
                            Create New {eventType.charAt(0).toUpperCase() + eventType.slice(1)} Event
                        </Typography>
                        <TextField
                            label="Event Name"
                            variant="outlined"
                            fullWidth
                            value={eventName}
                            onChange={handleEventNameChange}
                            sx={{
                                marginBottom: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                }
                            }}
                        />
                        <TextField
                            label="Start Date & Time"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            value={startDateTime}
                            onChange={(e) => {
                                const selectedDate = new Date(e.target.value);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0); // Reset time to start of day

                                if (selectedDate < today) {
                                    toast.error("Cannot select past dates. Please select a future date.");
                                    setStartDateTime(''); // Reset the date field
                                    return;
                                }
                                setStartDateTime(e.target.value);
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            // Set min attribute to today's date
                            inputProps={{
                                min: new Date().toISOString().slice(0, 16)
                            }}
                            error={startDateTime && new Date(startDateTime) < new Date()}
                            helperText={startDateTime && new Date(startDateTime) < new Date() ?
                                "Please select a future date and time" : ""}
                            sx={{
                                marginBottom: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                }
                            }}
                        />
                        <TextField
                            label="Number of Volunteers Required"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={volunteersRequired}
                            onChange={(e) => setVolunteersRequired(e.target.value)}
                            InputProps={{ inputProps: { min: 1 } }}
                            sx={{
                                marginBottom: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                }
                            }}
                        />
                        <TextField
                            label="Event Location"
                            variant="outlined"
                            fullWidth
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            sx={{
                                marginBottom: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                }
                            }}
                        />
                        <TextField
                            label="Number of Steps"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={numberOfSteps}
                            onChange={(e) => setNumberOfSteps(e.target.value)}
                            InputProps={{ inputProps: { min: 1, max: 5 } }}
                            helperText="Enter number of steps (1-5) to complete the event"
                            sx={{
                                marginBottom: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px'
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {
                                const formData = {
                                    name: eventName,
                                    type: eventType,
                                    startDateTime: startDateTime,
                                    volunteersRequired: volunteersRequired,
                                    eventLocation: eventLocation,
                                    numberOfSteps: numberOfSteps
                                };
                                handleCreateEvent(formData);
                            }}
                            sx={{
                                marginTop: 2,
                                padding: '12px',
                                borderRadius: '8px',
                                fontWeight: 600,
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0'
                                }
                            }}
                        >
                            Create Event
                        </Button>
                    </CardContent>
                </Card>
            )}

            {events.length > 0 && (
                <Card sx={{
                    maxWidth: '600px',
                    width: '90%',
                    marginTop: 4,
                    marginBottom: 4,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    borderRadius: '16px'
                }}>
                    <CardContent sx={{ padding: 4 }}>
                        <Typography
                            variant="h6"
                            textAlign="center"
                            gutterBottom
                            sx={{
                                fontWeight: 600,
                                color: '#1976d2',
                                marginBottom: 3
                            }}
                        >
                            Created Events
                        </Typography>
                        <List sx={{ width: '100%' }}>
                            {events.map((event) => (
                                <ListItem
                                    key={event.id}
                                    divider
                                    sx={{
                                        borderRadius: '8px',
                                        marginBottom: 1,
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography sx={{ fontWeight: 500 }}>
                                                #{event.id} - {event.name} ({event.type.charAt(0).toUpperCase() + event.type.slice(1)})
                                            </Typography>
                                        }
                                        secondary={`Created on: ${event.date}`}
                                    />
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleViewEvent(event)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(25, 118, 210, 0.1)'
                                            }
                                        }}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleRemoveEvent(event.id)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(211, 47, 47, 0.1)'
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
            <ToastContainer />
        </Box>
    );
};

export default AddNewEvents;