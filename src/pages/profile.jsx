import React, { useEffect, useState } from 'react';
import { Button, Typography, Card, CardContent, CardActions, Container, Box, Grid, Snackbar, IconButton, SnackbarContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileEditor from '../component/ProfileEditor/ProfileEditor';
import TypographyInfo from '../component/TypographyInfo/TypographyInfo';
import API_ENDPOINTS from '../config/apiConfig';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.FETCH_USERS);
      setProfile(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setErrorMessage('Failed to fetch user profile. Please try again later.');
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedProfile) => {
    try {
      const response = await axios.put(API_ENDPOINTS.UPDATE_USER(profile.id), updatedProfile);
      setProfile(response.data.data);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully.');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to update user profile. Please try again later.');
      setSuccessMessage('');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleCloseSnackbar = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

 

  return (
    <Container sx={{ maxWidth: 600,  justifyContent: 'center', alignItems: 'center',}}>
      <Box mt={4}>
        <Card sx={{ maxWidth: 600, margin: 'auto', mt: 10, p: 10 }}>
          <CardContent>
            <h1>Personal Information</h1>
            {isEditing ? (
              <ProfileEditor profile={profile} onSave={handleSave} onCancel={handleCancel} />
            ) : (
              <div style={{display:'inline-grid'}}>
               <TypographyInfo label="Name" value={profile && profile.name} loading={loading} />
               <TypographyInfo label="Email" value={profile && profile.email} loading={loading} />
               <TypographyInfo label="Phone" value={profile && profile.phone} loading={loading} />
              </div>
            )}
          </CardContent>
          <CardActions>
            {!isEditing && (
              <Grid container justifyContent="center" spacing={2}>
                <Grid item>
                  <Button  variant="contained"  onClick={handleEdit}>Edit</Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={() => navigate('/')}>Back Home</Button>
                </Grid>
              </Grid>
            )}
          </CardActions>
        </Card>
      </Box>
      <Snackbar
        open={!!errorMessage || !!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <SnackbarContent
          message={errorMessage || successMessage}
          style={{ backgroundColor: errorMessage ? '#f44336' : '#4caf50' }}
        />
      </Snackbar>
    </Container>
  );
};

export default Profile;
