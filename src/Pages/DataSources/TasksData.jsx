import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '../../utils/AuthContent';

function TaskList({ onDataReceived }) {
    const [loading, setLoading] = useState(true); // Add loading state
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        // Fetch data only if user exists
        if (user) {
            fetchTasksData(user);
        }
    }, [user]);

    const fetchTasksData = async (user) => {
        try {
            let headers = {
                'Content-Type': 'application/json'
            };
            console.log(user.labels[0])
            if (user.labels[0] !== 'admin') {
                headers['user-id'] = user.name;
                headers['user-label'] = user.labels[0]
            }
    
            const response = await axios.get('https://reportcraft-backend.onrender.com/api/getTasksData', {
                headers: headers
            });
    
            if (!response.data) {
                throw new Error('No data received');
            }
    
            console.log("Fetched data:", response.data);
            setTasks(response.data);
            onDataReceived(response.data); // Call onDataReceived to pass data to the parent component
            setLoading(false); // Set loading to false after data is received
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false); // Set loading to false even if there's an error
        }
    };
    
    // You might want to render something here, even if it's just a placeholder or loading indicator
    if (loading) {
    }

    return null; // Render nothing if not loading and no tasks to display
}

export default TaskList;