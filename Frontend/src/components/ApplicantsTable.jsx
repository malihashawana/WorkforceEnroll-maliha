import React, { useEffect, useState } from 'react';
import axios from 'axios';




const APPLICANTS_API_END_POINT = 'http://localhost:4001/applications/${userId}';
const shortlistingStatus = ["Accepted", "Rejected"];




const ApplicantsTable = () => {
    const [applicants, setApplicants] = useState([]);




    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await axios.get(APPLICANTS_API_END_POINT);
                setApplicants(response.data.applications);
            } catch (error) {
                console.error('Error fetching applicants:', error);
                alert('Failed to load applicants');
            }
        };




        fetchApplicants();
    }, []);




    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICANTS_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                alert(res.data.message);
                setApplicants(prev =>
                    prev.map(app => app._id === id ? { ...app, status } : app)
                );
            }
        } catch (error) {
            alert('Error updating status: ' + error.response.data.message);
        }
    };




    return (
        <div>
            <table className="min-w-full table-auto">
                <caption>A list of your recent applicants</caption>
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Resume</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        applicants && applicants.map((item) => (
                            <tr key={item._id}>
                                <td>{item?.fullname}</td>
                                <td>{item?.email}</td>
                                <td>{item?.phoneNumber}</td>
                                <td>
                                    {
                                        item?.resume ? <a className="text-blue-600" href={item?.resume} target="_blank" rel="noopener noreferrer">View Resume</a> : 'NA'
                                    }
                                </td>
                                <td>{new Date(item?.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <select onChange={(e) => statusHandler(e.target.value, item._id)} value={item.status || "Select Status"}>
                                        <option disabled>Select Status</option>
                                        {shortlistingStatus.map((status, index) => (
                                            <option key={index} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};




export default ApplicantsTable;
