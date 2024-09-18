import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function JobseekerDetails() {
  const { id } = useParams();
  const [jobseeker, setJobseeker] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4001/user/jobseekers/${id}`)
      .then(response => {
        setJobseeker(response.data);
      })
      .catch(error => {
        console.error('Error fetching jobseeker details:', error);
      });
  }, [id]);

  if (!jobseeker) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{jobseeker.fullname}</h2>
      <p>Email: {jobseeker.email}</p>
      {/* Add more fields as necessary */}
    </div>
  );
}

export default JobseekerDetails;
