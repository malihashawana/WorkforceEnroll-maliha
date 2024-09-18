import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';




function CompanyDetails() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyName = queryParams.get('company_name');
  const companyEmail = queryParams.get('company_email');
  const companyAddress = queryParams.get('company_address');




  const [company, setCompany] = useState(null);




  useEffect(() => {
    axios.get('http://localhost:4001/user1/companies', {
      params: {
        company_name: companyName,
        company_email: companyEmail,
        company_address: companyAddress
      }
    })
    .then(response => {
      setCompany(response.data);
    })
    .catch(error => {
      console.error('Error fetching company details:', error);
    });
  }, [companyName, companyEmail, companyAddress]);




  if (!company) {
    return <div>Loading...</div>;
  }




  return (
    <div>
      <h2>{company.company_name}</h2>
      <p>Email: {company.company_email}</p>
      <p>Address: {company.company_address}</p>
      {/* Add more fields as necessary */}
    </div>
  );
}




export default CompanyDetails;