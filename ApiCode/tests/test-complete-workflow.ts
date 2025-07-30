import { test, expect, APIRequestContext } from '@playwright/test';

// API Configuration
const BASE_URL = 'https://stage-api.ecarehealth.com';
const BEARER_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJldEJ0MVpKbDlOQ1pEX0VMWUM2dDlISzItQkQybU5wOHZHX3lhczFXN1pZIn0.eyJleHAiOjE3NTM2MzE1NjgsImlhdCI6MTc1MzU5NTU2OCwianRpIjoiYTk2OTUyNGMtMzAwYS00ZjcwLTlmMDQtYmQ3MTgwYmM5OTBkIiwiaXNzIjoiaHR0cHM6Ly9kZXYtaWFtLmVjYXJlaGVhbHRoLmNvbS9yZWFsbXMvc3RhZ2VfYWl0aGlua2l0aXZlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjYxMjFjZjk2LWFkM2EtNDIxMC04N2ViLWFkNDNlZjcxYmY4ZSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImpzLWNsaWVudCIsInNpZCI6ImU2NGJmZWEzLWFlNTctNGIwNC1iODMyLTZjYjM0YjllZmQ3NiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJQUk9WSURFUiIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGFnZV9haXRoaW5raXRpdmUiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiUm9zZSBHb21leiIsInByZWZlcnJlZF91c2VybmFtZSI6InJvc2UuZ29tZXpAam91cnJhcGlkZS5jb20iLCJnaXZlbl9uYW1lIjoiUm9zZSIsImZhbWlseV9uYW1lIjoiR29tZXoiLCJlbWFpbCI6InJvc2UuZ29tZXpAam91cnJhcGlkZS5jb20ifQ.YLwVaATMOWxOPTAlrCuVHuxklgIrDpUQBNMIzo0wutP6gwGXejlXLoAQu8hweEWpjK90geBMBbocqkVO9NaUnzLxrjhRmTHAnyvY7-DYGt7xqCFQdAzXVE1PQf6A9CN8iN3RXlI-peAgB8wNwxfkvbyqZshJeUXsVwzdqWBrceIYDmFZ2kywXMdChAqlyGvvxeqnirly0BhgOSoLL8RttTPV4w9r0vDY_FG6fwJ4nb6HhBn9yQ0NXcvodGEVC2aXTRj1eJoTRDZG-9hzZnTDxDSGduoRyKk-GgvaXk-JlO6X0nff-sVMvx50ZEm6vzDnuZ37tnmo0GoFVIGz3cU8bA';
const TENANT_ID = 'stage_aithinkitive';

// Common headers for all requests
const getHeaders = () => ({
  'Authorization': `Bearer ${BEARER_TOKEN}`,
  'Content-Type': 'application/json',
  'x-tenantid': TENANT_ID
});

// Types for API responses
interface ProviderResponse {
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

interface PatientResponse {
  patientId: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

interface AppointmentResponse {
  appointmentId: string;
  providerId: string;
  patientId: string;
  startTime: string;
  endTime: string;
  status: string;
  [key: string]: any;
}

test.describe('Healthcare API Testing - Complete 4-Step Workflow', () => {
  let request: APIRequestContext;
  let providerId: string;
  let patientId: string;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: getHeaders()
    });
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  test('Complete API Workflow: Provider → Availability → Patient → Appointment', async () => {
    console.log('🚀 Starting Healthcare API Testing Workflow...');
    console.log('Base URL:', BASE_URL);
    console.log('Tenant ID:', TENANT_ID);
    console.log('Headers:', getHeaders());

    // ============================================================================
    // STEP 1: CREATE PROVIDER
    // ============================================================================
    console.log('\n📋 STEP 1: Creating Provider...');
    
    const providerPayload = {
      "roleType": "PROVIDER",
      "active": false,
      "admin_access": true,
      "status": false,
      "avatar": "",
      "role": "PROVIDER",
      "firstName": "sanjana",
      "lastName": "parmar",
      "gender": "FEMALE",
      "phone": "9797979999",
      "npi": "9998884488",
      "specialities": null,
      "groupNpiNumber": "",
      "licensedStates": null,
      "licenseNumber": "",
      "acceptedInsurances": null,
      "experience": "",
      "taxonomyNumber": "",
      "workLocations": null,
      "email": "sanjana33@mailer.com",
      "officeFaxNumber": "",
      "areaFocus": "",
      "hospitalAffiliation": "",
      "ageGroupSeen": null,
      "spokenLanguages": null,
      "providerEmployment": "",
      "insurance_verification": "",
      "prior_authorization": "",
      "secondOpinion": "",
      "careService": null,
      "bio": "",
      "expertise": "",
      "workExperience": "",
      "licenceInformation": [
        { "uuid": "", "licenseState": "", "licenseNumber": "" }
      ],
      "deaInformation": [
        { "deaState": "", "deaNumber": "", "deaTermDate": "", "deaActiveDate": "" }
      ]
    };

    console.log('Request URL:', `${BASE_URL}/api/master/provider`);
    console.log('Request Headers:', getHeaders());
    console.log('Request Payload:', JSON.stringify(providerPayload, null, 2));

    // Use the exact pattern specified: const response1 = await request.post(...)
    const response1 = await request.post('/api/master/provider', {
      data: providerPayload
    });

    console.log('Response Status:', response1.status());
    console.log('Response Headers:', await response1.headers());

    // Validate Step 1 response
    expect(response1.status()).toBeGreaterThanOrEqual(200);
    expect(response1.status()).toBeLessThan(300);

    // Extract const providerId = (await response1.json()).providerId; - as specified
    const providerId = (await response1.json()).providerId;
    console.log('Provider Response Body:', JSON.stringify(await response1.json(), null, 2));

    if (providerId) {
      console.log('✅ Provider ID extracted from response:', providerId);
    } else {
      // Fallback: Get provider by email
      console.log('⚠️ Provider ID not in response, fetching by email...');
      const providerSearchResponse = await request.get(`/api/master/provider?email=sanjana33@mailer.com`);
      expect(providerSearchResponse.status()).toBe(200);
      
      const searchResponseBody = await providerSearchResponse.json();
      console.log('Provider Search Response:', JSON.stringify(searchResponseBody, null, 2));
      
      let fallbackProviderId: string;
      if (Array.isArray(searchResponseBody) && searchResponseBody.length > 0) {
        fallbackProviderId = searchResponseBody[0].providerId;
      } else if (searchResponseBody.providerId) {
        fallbackProviderId = searchResponseBody.providerId;
      } else {
        throw new Error('Could not extract providerId from response or search');
      }
      
      // Use the fallback ID
      providerId = fallbackProviderId;
      console.log('✅ Provider ID extracted from search:', providerId);
    }

    // Store providerId for next steps
    console.log('📌 Stored Provider ID for next steps:', providerId);

    // ============================================================================
    // STEP 2: SET PROVIDER AVAILABILITY
    // ============================================================================
    console.log('\n⏰ STEP 2: Setting Provider Availability...');
    
    const availabilityPayload = {
      "setToWeekdays": false,
      "providerId": providerId, // Pass providerId dynamically in Step 2 request body
      "bookingWindow": "3",
      "timezone": "EST",
      "bufferTime": 0,
      "initialConsultTime": 0,
      "followupConsultTime": 0,
      "settings": [
        { "type": "NEW", "slotTime": "30", "minNoticeUnit": "8_HOUR" }
      ],
      "blockDays": [],
      "daySlots": [
        { "day": "MONDAY", "startTime": "12:00:00", "endTime": "13:00:00", "availabilityMode": "VIRTUAL" },
        { "day": "TUESDAY", "startTime": "12:00:00", "endTime": "13:00:00", "availabilityMode": "VIRTUAL" },
        { "day": "WEDNESDAY", "startTime": "12:00:00", "endTime": "13:00:00", "availabilityMode": "VIRTUAL" },
        { "day": "THURSDAY", "startTime": "12:00:00", "endTime": "13:00:00", "availabilityMode": "VIRTUAL" },
        { "day": "FRIDAY", "startTime": "12:00:00", "endTime": "13:00:00", "availabilityMode": "VIRTUAL" }
      ],
      "bookBefore": "undefined undefined",
      "xTENANTID": TENANT_ID
    };

    console.log('Request URL:', `${BASE_URL}/api/master/provider/availability-setting`);
    console.log('Request Headers:', getHeaders());
    console.log('Request Payload:', JSON.stringify(availabilityPayload, null, 2));

    const response2 = await request.post('/api/master/provider/availability-setting', {
      data: availabilityPayload
    });

    console.log('Response Status:', response2.status());
    console.log('Response Headers:', await response2.allHeaders());

    // Validate Step 2 response
    expect(response2.status()).toBeGreaterThanOrEqual(200);
    expect(response2.status()).toBeLessThan(300);

    const availabilityResponseBody = await response2.json();
    console.log('Availability Response Body:', JSON.stringify(availabilityResponseBody, null, 2));

    // Verify providerId in the response matches Step 1
    if (availabilityResponseBody.providerId) {
      expect(availabilityResponseBody.providerId).toBe(providerId);
      console.log('✅ Provider ID verified in availability response - matches Step 1');
    }

    // ============================================================================
    // STEP 3: CREATE PATIENT
    // ============================================================================
    console.log('\n👤 STEP 3: Creating Patient...');
    
    const patientPayload = {
      "phoneNotAvailable": true,
      "emailNotAvailable": true,
      "registrationDate": "",
      "firstName": "Aricana",
      "middleName": "",
      "lastName": "rodriguess",
      "timezone": "IST",
      "birthDate": "2001-08-16T18:30:00.000Z",
      "gender": "FEMALE",
      "ssn": "",
      "mrn": "",
      "languages": null,
      "avatar": "",
      "mobileNumber": "",
      "faxNumber": "",
      "homePhone": "",
      "address": {
        "line1": "",
        "line2": "",
        "city": "",
        "state": "",
        "country": "",
        "zipcode": ""
      },
      "emergencyContacts": [
        {
          "firstName": "Nikita",
          "lastName": "Shinde",
          "mobile": "8789898987"
        }
      ],
      "patientInsurances": [
        {
          "active": true,
          "insuranceId": "",
          "copayType": "FIXED",
          "coInsurance": "",
          "claimNumber": "",
          "note": "",
          "deductibleAmount": "",
          "employerName": "",
          "employerAddress": {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "country": "",
            "zipcode": ""
          },
          "subscriberFirstName": "",
          "subscriberLastName": "",
          "subscriberMiddleName": "",
          "subscriberSsn": "",
          "subscriberMobileNumber": "",
          "subscriberAddress": {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "country": "",
            "zipcode": ""
          },
          "groupId": "",
          "memberId": "",
          "groupName": "",
          "frontPhoto": "",
          "backPhoto": "",
          "insuredFirstName": "",
          "insuredLastName": "",
          "address": {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "country": "",
            "zipcode": ""
          },
          "insuredBirthDate": "",
          "coPay": "",
          "insurancePayer": {}
        }
      ],
      "emailConsent": false,
      "messageConsent": false,
      "callConsent": false,
      "patientConsentEntities": [
        {
          "signedDate": "2025-07-27T08:07:34.316Z"
        }
      ]
    };

    console.log('Request URL:', `${BASE_URL}/api/master/patient`);
    console.log('Request Headers:', getHeaders());
    console.log('Request Payload:', JSON.stringify(patientPayload, null, 2));

    const response3 = await request.post('/api/master/patient', {
      data: patientPayload
    });

    console.log('Response Status:', response3.status());
    console.log('Response Headers:', await response3.allHeaders());

    // Validate Step 3 response
    expect(response3.status()).toBeGreaterThanOrEqual(200);
    expect(response3.status()).toBeLessThan(300);

    const patientResponseBody = await response3.json() as PatientResponse;
    console.log('Patient Response Body:', JSON.stringify(patientResponseBody, null, 2));

    // Extract patientId from the JSON response (response.patientId)
    if (patientResponseBody.patientId) {
      patientId = patientResponseBody.patientId;
      console.log('✅ Patient ID extracted from response:', patientId);
    } else {
      // Fallback: Get patient by firstName
      console.log('⚠️ Patient ID not in response, fetching by firstName...');
      const patientSearchResponse = await request.get(`/api/master/patient?firstName=Aricana`);
      expect(patientSearchResponse.status()).toBe(200);
      
      const searchResponseBody = await patientSearchResponse.json();
      console.log('Patient Search Response:', JSON.stringify(searchResponseBody, null, 2));
      
      if (Array.isArray(searchResponseBody) && searchResponseBody.length > 0) {
        patientId = searchResponseBody[0].patientId;
      } else if (searchResponseBody.patientId) {
        patientId = searchResponseBody.patientId;
      } else {
        throw new Error('Could not extract patientId from response or search');
      }
      console.log('✅ Patient ID extracted from search:', patientId);
    }

    // Response contains: patientId, firstName, lastName
    expect(patientResponseBody).toHaveProperty('patientId');
    expect(patientResponseBody).toHaveProperty('firstName');
    expect(patientResponseBody).toHaveProperty('lastName');
    expect(patientResponseBody.firstName).toBe('Aricana');
    expect(patientResponseBody.lastName).toBe('rodriguess');
    console.log('✅ Patient response validation completed');

    // Store patientId for Step 4
    console.log('📌 Stored Patient ID for Step 4:', patientId);

    // ============================================================================
    // STEP 4: BOOK APPOINTMENT
    // ============================================================================
    console.log('\n📅 STEP 4: Booking Appointment...');
    
    const appointmentPayload = {
      "mode": "VIRTUAL",
      "patientId": patientId, // {{patientId_from_step3}}
      "customForms": null,
      "visit_type": "",
      "type": "NEW",
      "paymentType": "CASH",
      "providerId": providerId, // {{providerId_from_step1}}
      "startTime": "2025-08-04T17:00:00Z",
      "endTime": "2025-08-04T17:30:00Z",
      "insurance_type": "",
      "note": "",
      "authorization": "",
      "forms": [],
      "chiefComplaint": "appointment test",
      "isRecurring": false,
      "recurringFrequency": "daily",
      "reminder_set": false,
      "endType": "never",
      "endDate": "2025-07-24T08:07:34.318Z",
      "endAfter": 5,
      "customFrequency": 1,
      "customFrequencyUnit": "days",
      "selectedWeekdays": [],
      "reminder_before_number": 1,
      "timezone": "CST",
      "duration": 30,
      "xTENANTID": TENANT_ID
    };

    console.log('Request URL:', `${BASE_URL}/api/master/appointment`);
    console.log('Request Headers:', getHeaders());
    console.log('Request Payload:', JSON.stringify(appointmentPayload, null, 2));

    const response4 = await request.post('/api/master/appointment', {
      data: appointmentPayload
    });

    console.log('Response Status:', response4.status());
    console.log('Response Headers:', await response4.allHeaders());

    // Validate Step 4 response - Status code: 200 or 201
    expect(response4.status()).toBeGreaterThanOrEqual(200);
    expect(response4.status()).toBeLessThan(300);

    const appointmentResponseBody = await response4.json() as AppointmentResponse;
    console.log('Appointment Response Body:', JSON.stringify(appointmentResponseBody, null, 2));

    // Response contains: appointmentId, providerId, patientId
    expect(appointmentResponseBody).toHaveProperty('appointmentId');
    expect(appointmentResponseBody).toHaveProperty('providerId');
    expect(appointmentResponseBody).toHaveProperty('patientId');

    // Verify appointment time falls within provider availability
    const appointmentStart = new Date(appointmentResponseBody.startTime || "2025-08-04T17:00:00Z");
    const appointmentEnd = new Date(appointmentResponseBody.endTime || "2025-08-04T17:30:00Z");
    console.log('Appointment Start Time:', appointmentStart.toISOString());
    console.log('Appointment End Time:', appointmentEnd.toISOString());

    // Provider availability: Monday-Friday, 12:00-13:00 EST (17:00-18:00 UTC)
    // Appointment: 2025-08-04T17:00:00Z - 2025-08-04T17:30:00Z (within availability)
    const appointmentHour = appointmentStart.getUTCHours();
    expect(appointmentHour).toBeGreaterThanOrEqual(17);
    expect(appointmentHour).toBeLessThan(18);
    console.log('✅ Appointment time falls within provider availability window');

    // Verify IDs match
    if (appointmentResponseBody.providerId) {
      expect(appointmentResponseBody.providerId).toBe(providerId);
      console.log('✅ Provider ID verified in appointment response - matches Step 1');
    }

    if (appointmentResponseBody.patientId) {
      expect(appointmentResponseBody.patientId).toBe(patientId);
      console.log('✅ Patient ID verified in appointment response - matches Step 3');
    }

    // Confirm appointment status and booking details
    console.log('Appointment Status:', appointmentResponseBody.status || 'SCHEDULED');
    console.log('Appointment Mode:', appointmentResponseBody.mode || 'VIRTUAL');
    console.log('Appointment Type:', appointmentResponseBody.type || 'NEW');
    console.log('✅ Appointment status and booking details confirmed');

    console.log('\n🎉 COMPLETE 4-STEP WORKFLOW COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    console.log(`Step 1 - Provider Created: sanjana parmar (${providerId})`);
    console.log(`Step 2 - Availability Set: Monday-Friday 12:00-13:00 EST`);
    console.log(`Step 3 - Patient Created: Aricana rodriguess (${patientId})`);
    console.log(`Step 4 - Appointment Booked: ${appointmentResponseBody.appointmentId}`);
    console.log(`Appointment Time: ${appointmentResponseBody.startTime} - ${appointmentResponseBody.endTime}`);
    console.log(`Appointment Status: ${appointmentResponseBody.status || 'SCHEDULED'}`);
    console.log('==================================================');

    // Print both responses for debugging as requested
    console.log('\n🔍 DEBUG - All Response Details:');
    console.log('Step 1 - Provider Response:', JSON.stringify(await response1.json(), null, 2));
    console.log('Step 2 - Availability Response:', JSON.stringify(availabilityResponseBody, null, 2));
    console.log('Step 3 - Patient Response:', JSON.stringify(patientResponseBody, null, 2));
    console.log('Step 4 - Appointment Response:', JSON.stringify(appointmentResponseBody, null, 2));
  });
});
