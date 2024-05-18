import * as React from 'react';
import { useState, useEffect } from 'react';
// import * as React, { useState, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import TaskList from '../Pages/DataSources/TasksData';
import CandidateData from '../Pages/DataSources/CandidateData';
import { startOfToday, startOfWeek, startOfMonth, isSameDay, isWithinInterval, differenceInDays } from 'date-fns';

const MetricsBox = () => {
  const [metrics, setMetrics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [dateTimeInNewYork, setDateTimeInNewYork] = useState(null);

  const handleDataReceived = (tasks) => {
    setTasks(tasks);
  };

  const handleCandidateReceived = (candidates) => {
    setCandidates(candidates);
  };
  function convertToFormattedDate(inputString) {
    // Split the input string based on the 'T' separator
    let parts = inputString.split('T');
    
    // Extract the date part (before 'T')
    let datePart = parts[0];
    
    // Split the date part based on the '-' separator
    let dateParts = datePart.split('-');
    
    // Extract year, month, and day from the date parts
    let year = dateParts[0];
    let month = dateParts[1];
    let day = dateParts[2];
    
    // Concatenate the parts to form the formatted date string
    let formattedDate = `${year}-${month}-${day}`;
    
    return formattedDate;
}

  useEffect(() => {
    const fetchDateTime = async () => {
      try {
        const response = await fetch('http://worldtimeapi.org/api/timezone/America/New_York');
        const data = await response.json();
        const dateTimeInNewYork = convertToFormattedDate(data.datetime);
        setDateTimeInNewYork(dateTimeInNewYork);
      } catch (error) {
        console.error('Error fetching date and time:', error);
      }
    };

    fetchDateTime();
  }, []);

  const calculateMetrics = () => {
    if (!selectedBranch || !dateTimeInNewYork) return;

   
    const today = dateTimeInNewYork;

    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // assuming week starts on Monday
    const monthStart = startOfMonth(today);

    const branchTasks = tasks.filter(task =>
      candidates.some(candidate => candidate.Candidate === task.candidateName && candidate.Branch === selectedBranch)
    );
    console.log(branchTasks);
    const submissionsToday = branchTasks.filter(task => isSameDay(new Date(task.date), today)).length;
    const submissionsThisWeek = branchTasks.filter(task => isWithinInterval(new Date(task.date), { start: weekStart, end: today })).length;
    const submissionsThisMonth = branchTasks.filter(task => isWithinInterval(new Date(task.date), { start: monthStart, end: today })).length;

    const interviewsToday = branchTasks.filter(task => task.InterviewOrSubmission === 'Interview' && isSameDay(new Date(task.InterviewSchedule), today)).length;
    const interviewsThisWeek = branchTasks.filter(task => task.InterviewOrSubmission === 'Interview' && isWithinInterval(new Date(task.InterviewSchedule), { start: weekStart, end: today })).length;
    const interviewsThisMonth = branchTasks.filter(task => task.InterviewOrSubmission === 'Interview' && isWithinInterval(new Date(task.InterviewSchedule), { start: monthStart, end: today })).length;

    const totalSubmissions = branchTasks.length;
    const totalInterviews = branchTasks.filter(task => task.InterviewOrSubmission === 'Interview').length;
    const interviewConversionRate = totalSubmissions ? (totalInterviews / totalSubmissions) * 100 : 0;

    const averageTimeToInterview = totalInterviews ? branchTasks
      .filter(task => task.InterviewOrSubmission === 'Interview')
      .reduce((acc, task) => acc + differenceInDays(new Date(task.InterviewSchedule), new Date(task.date)), 0) / totalInterviews : 0;

    const employmentTypeDistribution = branchTasks.reduce((acc, task) => {
      acc[task.employmentType] = (acc[task.employmentType] || 0) + 1;
      return acc;
    }, {});

    const submissionStatusDistribution = branchTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    const visaTypeDistribution = candidates.reduce((acc, candidate) => {
      if (candidate.Branch === selectedBranch) {
        acc[candidate.Visa] = (acc[candidate.Visa] || 0) + 1;
      }
      return acc;
    }, {});

    const recruiterPerformance = branchTasks.reduce((acc, task) => {
      acc[task.recruiterName] = acc[task.recruiterName] || { submissions: 0, interviews: 0 };
      acc[task.recruiterName].submissions += 1;
      if (task.InterviewOrSubmission === 'Interview') {
        acc[task.recruiterName].interviews += 1;
      }
      return acc;
    }, {});

    const jobPositionDistribution = branchTasks.reduce((acc, task) => {
      acc[task.position] = (acc[task.position] || 0) + 1;
      return acc;
    }, {});

    const geographicalDistribution = candidates.reduce((acc, candidate) => {
      if (candidate.Branch === selectedBranch) {
        acc[candidate.Location] = (acc[candidate.Location] || 0) + 1;
      }
      return acc;
    }, {});
    console.log(geographicalDistribution);
    const submissionSourceDistribution = branchTasks.reduce((acc, task) => {
      acc[task.sourceOfSubmission] = (acc[task.sourceOfSubmission] || 0) + 1;
      return acc;
    }, {});

    setMetrics([
      { label: 'Submissions Today', value: submissionsToday, color: 'primary' },
      { label: 'Submissions This Week', value: submissionsThisWeek, color: 'success' },
      { label: 'Submissions This Month', value: submissionsThisMonth, color: 'warning' },
      { label: 'Interviews Today', value: interviewsToday, color: 'info' },
      { label: 'Interviews This Week', value: interviewsThisWeek, color: 'info' },
      { label: 'Interviews This Month', value: interviewsThisMonth, color: 'info' },
      { label: 'Total Submissions', value: totalSubmissions, color: 'primary' },
      { label: 'Total Interviews', value: totalInterviews, color: 'info' },
      { label: 'Interview Conversion Rate', value: `${interviewConversionRate.toFixed(2)}%`, color: 'success' },
      { label: 'Average Time to Interview (days)', value: averageTimeToInterview.toFixed(2), color: 'info' },
      { label: 'Full-Time Submissions', value: employmentTypeDistribution['Full-Time'] || 0, color: 'primary' },
      { label: 'W2 Submissions', value: employmentTypeDistribution['W2'] || 0, color: 'primary' },
      { label: 'Active Submissions', value: submissionStatusDistribution['Active'] || 0, color: 'success' },
      { label: 'Inactive Submissions', value: submissionStatusDistribution['Inactive'] || 0, color: 'warning' },
      { label: 'OPT Visa', value: visaTypeDistribution['OPT'] || 0, color: 'primary' },
      { label: 'H1B Visa', value: visaTypeDistribution['H1B'] || 0, color: 'primary' },
      { label: 'Other Visas', value: visaTypeDistribution['Other'] || 0, color: 'primary' },
    ]);

    // Additional metrics for recruiters and job positions
    const topRecruiterSubmissions = Object.keys(recruiterPerformance).map(recruiter => ({
      recruiter,
      submissions: recruiterPerformance[recruiter].submissions
    })).sort((a, b) => b.submissions - a.submissions)[0]?.recruiter || '';

    const topRecruiterInterviews = Object.keys(recruiterPerformance).map(recruiter => ({
      recruiter,
      interviews: recruiterPerformance[recruiter].interviews
    })).sort((a, b) => b.interviews - a.interviews)[0]?.recruiter || '';

    const topJobPosition = Object.keys(jobPositionDistribution).map(position => ({
      position,
      count: jobPositionDistribution[position]
    })).sort((a, b) => b.count - a.count)[0]?.position || '';

    const topLocation = Object.keys(geographicalDistribution).map(location => ({
      location,
      count: geographicalDistribution[location]
    })).sort((a, b) => b.count - a.count)[0]?.location || '';

    const topSubmissionSource = Object.keys(submissionSourceDistribution).map(source => ({
      source,
      count: submissionSourceDistribution[source]
    })).sort((a, b) => b.count - a.count)[0]?.source || '';

    setMetrics(metrics => [
      ...metrics,
      { label: 'Top Recruiter (Submissions)', value: topRecruiterSubmissions, color: 'primary' },
      { label: 'Top Recruiter (Interviews)', value: topRecruiterInterviews, color: 'info' },
      { label: 'Top Job Position', value: topJobPosition, color: 'primary' },
      { label: 'Top Location', value: topLocation, color: 'primary' },
      { label: 'Top Submission Source', value: topSubmissionSource, color: 'primary' },
    ]);
  };

  useEffect(() => {
    calculateMetrics();
  }, [tasks, candidates, selectedBranch]);


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper',
        minWidth: 300,
      }}
    >
      <Typography level="h4" fontWeight="lg" sx={{ mb: 2 }}>
        KPI Metrics
      </Typography>
      <select onChange={(e) => setSelectedBranch(e.target.value)} value={selectedBranch}>
        <option value="">Select Branch</option>
        {[...new Set(candidates.map(candidate => candidate.Branch))].map((branch, index) => (
          <option key={index} value={branch}>
            {branch}
          </option>
        ))}
      </select>
      {metrics.map((metric, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 1,
            borderRadius: 1,
            backgroundColor: 'background.level1',
          }}
        >
          <Typography level="body1">{metric.label}</Typography>
          <Chip
            size="sm"
            variant="soft"
            color={metric.color}
            sx={{ fontWeight: 'lg' }}
          >
            {metric.value}
          </Chip>
        </Box>
      ))}
      <TaskList onDataReceived={handleDataReceived} />
      <CandidateData onDataReceived={handleCandidateReceived} />
    </Box>
  );
};

export default MetricsBox;
