import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '../../utils/AuthContent';

function CandidateData ({ onDataReceived }) { // Accept a prop onDataReceived
    const [tasks, setTasks] = useState([]);

    const { user } = useAuth()
    

    useEffect(() => {
        fetchUserData(user); // Pass user as a parameter
    }, [user]); // Add user to the dependency array
    
    const fetchUserData = async (user) => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                'user-id': user.name,
            };
            if (user.labels[0]) {
                headers['user-label'] = user.labels[0];
            }
            const response = await axios.get('https://reportcraft-backend.onrender.com/api/getUserData', {
                headers: headers
            });
            if (!response.data) {
                throw new Error('No data received');
            }
            setTasks(response.data);
            onDataReceived(response.data); // Pass data to the parent component
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    return null;
}

export default CandidateData;