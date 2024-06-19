import React, { useState, useMemo } from 'react';
import { TextField, Button, Card, CardContent, CardActions, Grid } from '@mui/material';

const ProfileEditor = ({ profile, onSave, onCancel }) => {
    const { name, email, phone } = profile;

    const [formData, setFormData] = useState({ name, email, phone });
    const [errors, setErrors] = useState({ name: '', email: '', phone: '' });

    const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
    const phoneRegex = useMemo(() => /^\+?[1-9]\d{9,13}$/, []);

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'email':
                if (!emailRegex.test(value)) {
                    error = 'Invalid email address';
                }
                break;
            case 'phone':
                if (!phoneRegex.test(value)) {
                    error = 'Invalid phone number';
                }
                break;
            default:
                if (!value) {
                    error = 'This field is required';
                }
                break;
        }

        return error;
    };

    const setError = (name, error) => {
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        setError(name, error);
    };

    const validateForm = () => {
        const { name, email, phone } = formData;
        let valid = true;

        if (!name) {
            setError('name', 'This field is required');
            valid = false;
        }
        if (!emailRegex.test(email)) {
            setError('email', 'Invalid email address');
            valid = false;
        }
        if (!phoneRegex.test(phone)) {
            setError('phone', 'Invalid phone number');
            valid = false;
        }

        return valid;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(formData);
        } else {
            alert('Please fill out all fields correctly.');
        }
    };

    return (
        <Card sx={{ maxWidth: '100%' }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            required
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleSave}>Save</Button>
                <Button size="small" onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    );
};

export default ProfileEditor;
