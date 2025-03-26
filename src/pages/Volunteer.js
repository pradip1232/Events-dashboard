import React from 'react';
import { Box, Card, Typography, LinearProgress, Button, TextField } from '@mui/material';
import { Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';


const Volunteer = () => {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [volunteerFields, setVolunteerFields] = React.useState({});

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost/events/get_events.php");
        const data = await response.json();
        if (data.status === "success") {
          setEvents(data.events);

          // Initialize volunteer fields for each event
          const fields = {};
          data.events.forEach(event => {
            fields[event.id] = Array(parseInt(event.volunteer_number)).fill('');
          });
          setVolunteerFields(fields);

          setLoading(false);
        } else {
          console.error("Failed to fetch events:", data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleVolunteerFieldChange = (eventId, index, field, value) => {
    setVolunteerFields(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [index]: {
          ...prev[eventId]?.[index],
          [field]: value
        }
      }
    }));
  };

  const handleSendInvite = async (eventId, index) => {
    try {
      const volunteerData = volunteerFields[eventId]?.[index];
      if (!volunteerData?.name || !volunteerData?.role || !volunteerData?.email) {
        alert('Please fill in all fields');
        return;
      }

      const response = await fetch('http://localhost/events/send_invite_volunteer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          name: volunteerData.name,
          role: volunteerData.role,
          email: volunteerData.email
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        alert('Invitation sent successfully!');
        // Clear the fields after successful submission
        handleVolunteerFieldChange(eventId, index, 'name', '');
        handleVolunteerFieldChange(eventId, index, 'role', '');
        handleVolunteerFieldChange(eventId, index, 'email', '');
      } else {
        alert('Failed to send invitation: ' + result.message);
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const getVolunteerLevel = (volunteerCount) => {
    if (!volunteerCount || volunteerCount < 5) return 'Entry Level';
    if (volunteerCount < 10) return 'Food Level 1';
    return 'Food Level 2';
  };

  const getProgressColor = (volunteerCount) => {
    if (!volunteerCount || volunteerCount < 5) return '#FFA726';  // Orange
    if (volunteerCount < 10) return '#66BB6A'; // Light Green
    return '#43A047'; // Green
  };

  const styles = {
    container: {
      padding: '20px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333'
    },
    description: {
      color: '#666',
      fontSize: '16px'
    },
    levelBadge: {
      padding: '8px 15px',
      borderRadius: '15px',
      color: '#fff',
      display: 'inline-block',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    stats: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto'
    },
    volunteerRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    },
    volunteerFields: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading events...</Typography>
      </Box>
    );
  }

  const totalVolunteers = events.reduce((total, event) => total + parseInt(event.volunteer_number), 0);

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.totalVolunteers}>
        Total Volunteer Positions Available: {totalVolunteers}
      </Typography>

      {events.map((event) => (
        <Container key={event.id} >
          <Typography sx={styles.title}>Event Name: {event.name}</Typography>
          <Typography sx={styles.description}>
            {Array(parseInt(event.volunteer_number)).fill(null).map((_, index) => (
              <Row className='mb-2 d-flex justify-content-center' key={index}>
                <Col md={3}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Name"
                    value={volunteerFields[event.id]?.[index]?.name || ''}
                    onChange={(e) => handleVolunteerFieldChange(event.id, index, 'name', e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <TextField
                    variant="outlined"
                    label="Role"
                    type="text"
                    placeholder="Role"
                    fullWidth
                    value={volunteerFields[event.id]?.[index]?.role || ''}
                    onChange={(e) => handleVolunteerFieldChange(event.id, index, 'role', e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <TextField
                    variant="outlined"
                    label="Email"
                    type="email"
                    fullWidth
                    value={volunteerFields[event.id]?.[index]?.email || ''}
                    onChange={(e) => handleVolunteerFieldChange(event.id, index, 'email', e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Button
                    variant="contained"
                    onClick={() => handleSendInvite(event.id, index)}
                    sx={{ mt: 1, mb: 2 }}
                  >
                    Send Invite
                  </Button>
                </Col>
              </Row>
            ))}
          </Typography>

          <Box sx={styles.volunteerRow}>
            <Typography>
              Current Volunteers: {event.volunteer_count}/{event.volunteers_required}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Typography>Role:</Typography>
              <Box
                sx={{
                  ...styles.levelBadge,
                  backgroundColor: getProgressColor(event.volunteer_count)
                }}
              >
                {getVolunteerLevel(event.volunteer_count)}
              </Box>
            </Box>

            <Box sx={styles.volunteerFields}>
              {Array(parseInt(event.volunteer_number)).fill(null).map((_, index) => (
                <TextField
                  key={index}
                  label={`Volunteer ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={volunteerFields[event.id]?.[index]?.name || ''}
                  onChange={(e) => handleVolunteerFieldChange(event.id, index, 'name', e.target.value)}
                />
              ))}
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleSendInvite(event.id, 0)}
            >
              Submit Application
            </Button>
          </Box>

          <LinearProgress
            variant="determinate"
            value={(event.volunteer_count / event.volunteers_required) * 100}
            sx={{
              height: '10px',
              borderRadius: '5px',
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getProgressColor(event.volunteer_count)
              }
            }}
          />
        </Container>
      ))}
    </Box>
  );
};

export default Volunteer;
