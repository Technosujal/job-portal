import fetch from 'node-fetch';

async function testJobCreation() {
  const url = 'http://localhost:5000/api/jobs';
  const jobData = {
    title: "Test Job",
    company: "Test Co",
    description: "Test Description",
    location: "Remote",
    salaryMin: 50000,
    salaryMax: 100000,
    category: "Software Development",
    requirements: "Test Requirements",
    type: "Full-time"
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Note: Authentication might be required!
      },
      body: JSON.stringify(jobData),
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testJobCreation();
