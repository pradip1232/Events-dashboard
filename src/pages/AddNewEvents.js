import React, { useState, useEffect } from 'react';
import { ToggleButton, ToggleButtonGroup, TextField, Button, Box, Card, CardContent, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const AddNewEvents = () => {
    const [eventType, setEventType] = useState(null);
    const [eventName, setEventName] = useState('');
    const [events, setEvents] = useState([]);

    // Load events from localStorage on component mount
    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        setEvents(storedEvents);
    }, []);

    // Save events to localStorage
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

    // const handleCreateEvent = () => {
    //     if (eventName.trim()) {
    //         const newEvent = {
    //             id: events.length + 1,
    //             name: eventName,
    //             type: eventType,
    //             date: new Date().toLocaleString(),
    //         };
    //         const updatedEvents = [newEvent, ...events];
    //         setEvents(updatedEvents);
    //         saveEventsToLocalStorage(updatedEvents);
    //         setEventName('');
    //     }
    // };


    const handleCreateEvent = async () => {
        if (eventName.trim()) {
            const newEvent = {
                name: eventName,
                type: eventType,
            };

            // Save event to database
            try {
                const response = await fetch("http://localhost/events/save_event.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newEvent),
                });

                const result = await response.json();

                if (result.status === "success") {
                    const updatedEvents = [{ ...newEvent, id: events.length + 1, date: new Date().toLocaleString() }, ...events];
                    setEvents(updatedEvents);
                    saveEventsToLocalStorage(updatedEvents);
                    setEventName("");
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error("Error saving event:", error);
            }
        }
    };


    const handleViewEvent = (event) => {
        alert(`Event: ${event.name}\nType: ${event.type}\nCreated on: ${event.date}`);
    };

    // const handleRemoveEvent = (id) => {
    //     const updatedEvents = events.filter((event) => event.id !== id);
    //     setEvents(updatedEvents);
    //     saveEventsToLocalStorage(updatedEvents);
    // };


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
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" minHeight="100vh" paddingTop={5}>
            <Card className="max-w-md shadow-lg rounded-2xl">
                <CardContent>
                    <Typography variant="h5" gutterBottom textAlign="center">
                        Select Event Type
                    </Typography>
                    <ToggleButtonGroup
                        value={eventType}
                        exclusive
                        onChange={handleChange}
                        fullWidth
                        color="primary"
                    >
                        <ToggleButton value="free" sx={{ padding: '10px 20px', fontWeight: 'bold' }}>
                            Free
                        </ToggleButton>
                        <ToggleButton value="paid" sx={{ padding: '10px 20px', fontWeight: 'bold' }}>
                            Paid
                        </ToggleButton>
                    </ToggleButtonGroup>
                </CardContent>
            </Card>

            {eventType && (
                <Card className="max-w-md shadow-lg rounded-2xl mt-5">
                    <CardContent>
                        <Typography variant="h6" textAlign="center" gutterBottom>
                            Create New {eventType.charAt(0).toUpperCase() + eventType.slice(1)} Event
                        </Typography>
                        <TextField
                            label="Event Name"
                            variant="outlined"
                            fullWidth
                            value={eventName}
                            onChange={handleEventNameChange}
                            sx={{ marginBottom: 2 }}
                        />
                        <Button variant="contained" color="primary" fullWidth onClick={handleCreateEvent}>
                            Create Event
                        </Button>
                    </CardContent>
                </Card>
            )}

            {events.length > 0 && (
                <Card className="max-w-md shadow-lg rounded-2xl mt-5">
                    <CardContent>
                        <Typography variant="h6" textAlign="center" gutterBottom>
                            Created Events
                        </Typography>
                        <List>
                            {events.map((event) => (
                                <ListItem key={event.id} divider>
                                    <ListItemText
                                        primary={`#${event.id} - ${event.name} (${event.type.charAt(0).toUpperCase() + event.type.slice(1)})`}
                                        secondary={`Created on: ${event.date}`}
                                    />
                                    <IconButton color="primary" onClick={() => handleViewEvent(event)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleRemoveEvent(event.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default AddNewEvents;