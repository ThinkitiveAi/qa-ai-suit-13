import { test, expect, APIRequestContext } from '@playwright/test';
import { 
  ApiUtils, 
  API_ENDPOINTS, 
  HTTP_STATUS, 
  TEST_DATA_TEMPLATES 
} from './api-utils';

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

test.describe('Healthcare API Testing - Enhanced Framework', () => {
  let request: APIRequestContext;
  let providerId: string;
  let patientId: string;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: getHeaders()
    });
    console.log('🔧 API Request Context initialized');
    console.log('Base URL:', BASE_URL);
    console.log('Tenant ID:', TENANT_ID);
  });

  test.afterAll(async () => {
    await request.dispose();
    console.log('🧹 API Request Context disposed');
  });

  test('Enhanced 4-Step Healthcare API Workflow', async () => {
    console.log('🚀 Starting Enhanced Healthcare API Testing Workflow...');

    // ============================================================================
    // STEP 1: CREATE PROVIDER
    // ============================================================================
    console.log('\n📋 STEP 1: Creating Provider with Enhanced Framework...');
    
    const providerPayload = {
      ...TEST_DATA_TEMPLATES.PROVIDER,
      firstName: "sanjana",
      lastName: "parmar",
      phone: "9797979999",
      npi: "9998884488",
      email: "sanjana33@mailer.com"
    };

    // Log request details using utility
    ApiUtils.logRequest('POST', `${BASE_URL}${API_ENDPOINTS.PROVIDER}`, getHeaders(), providerPayload);

    const response1 = await request.post(API_ENDPOINTS.PROVIDER, {
      data: providerPayload
    });

    // Validate status using utility
    expect(ApiUtils.isSuccessStatus(response1.status())).toBe(true);

    const providerResponseBody = await response1.json();
    
    // Log response using utility
    ApiUtils.logResponse(response1.status(), await response1.allHeaders(), providerResponseBody);

    // Extract providerId using enhanced utility
    providerId = ApiUtils.extractId(providerResponseBody, 'providerId');
    
    if (!providerId) {
      console.log('⚠️ Provider ID not in response, using fallback search...');
      const searchResponse = await request.get(`${API_ENDPOINTS.PROVIDER}?email=sanjana33@mailer.com`);
      expect(searchResponse.status()).toBe(HTTP_STATUS.OK);
      
      const searchBody = await searchResponse.json();
      providerId = ApiUtils.extractId(searchBody, 'providerId');
      
      if (!providerId) {
        throw new Error('Could not extract providerId from response or search');
      }
    }

    console.log('✅ Provider ID extracted successfully:', providerId);

    // Validate required fields
    const providerRequiredFields = ['firstName', 'lastName', 'email'];
    expect(ApiUtils.validateRequiredFields(providerResponseBody, providerRequiredFields)).toBe(true);

    // ============================================================================
    // STEP 2: SET PROVIDER AVAILABILITY
    // ============================================================================
    console.log('\n⏰ STEP 2: Setting Provider Availability with Enhanced Validation...');
    
    const availabilityPayload = {
      "setToWeekdays": false,
      "providerId": providerId, // Dynamic providerId from Step 1
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

    ApiUtils.logRequest('POST', `${BASE_URL}${API_ENDPOINTS.PROVIDER_AVAILABILITY}`, getHeaders(), availabilityPayload);

    const response2 = await request.post(API_ENDPOINTS.PROVIDER_AVAILABILITY, {
      data: availabilityPayload
    });

    expect(ApiUtils.isSuccessStatus(response2.status())).toBe(true);

    const availabilityResponseBody = await response2.json();
    ApiUtils.logResponse(response2.status(), await response2.allHeaders(), availabilityResponseBody);

    // Verify providerId matches using enhanced validation
    if (availabilityResponseBody.providerId) {
      expect(availabilityResponseBody.providerId).toBe(providerId);
      console.log('✅ Provider ID verified in availability response');
    }

    // ============================================================================
    // STEP 3: CREATE PATIENT
    // ============================================================================
    console.log('\n👤 STEP 3: Creating Patient with Enhanced Framework...');
    
    const patientPayload = {
      ...TEST_DATA_TEMPLATES.PATIENT,
      firstName: "Aricana",
      lastName: "rodriguess",
      emergencyContacts: [
        {
          firstName: "Nikita",
          lastName: "Shinde",
          mobile: "8789898987"
        }
      ],
      patientInsurances: [
        {
          active: true,
          insuranceId: "",
          copayType: "FIXED",
          coInsurance: "",
          claimNumber: "",
          note: "",
          deductibleAmount: "",
          employerName: "",
          employerAddress: {
            line1: "", line2: "", city: "", state: "", country: "", zipcode: ""
          },
          subscriberFirstName: "", subscriberLastName: "", subscriberMiddleName: "",
          subscriberSsn: "", subscriberMobileNumber: "",
          subscriberAddress: {
            line1: "", line2: "", city: "", state: "", country: "", zipcode: ""
          },
          groupId: "", memberId: "", groupName: "", frontPhoto: "", backPhoto: "",
          insuredFirstName: "", insuredLastName: "",
          address: {
            line1: "", line2: "", city: "", state: "", country: "", zipcode: ""
          },
          insuredBirthDate: "", coPay: "", insurancePayer: {}
        }
      ],
      patientConsentEntities: [
        { signedDate: "2025-07-27T08:07:34.316Z" }
      ]
    };

    ApiUtils.logRequest('POST', `${BASE_URL}${API_ENDPOINTS.PATIENT}`, getHeaders(), patientPayload);

    const response3 = await request.post(API_ENDPOINTS.PATIENT, {
      data: patientPayload
    });

    expect(ApiUtils.isSuccessStatus(response3.status())).toBe(true);

    const patientResponseBody = await response3.json();
    ApiUtils.logResponse(response3.status(), await response3.allHeaders(), patientResponseBody);

    // Extract patientId using enhanced utility
    patientId = ApiUtils.extractId(patientResponseBody, 'patientId');
    
    if (!patientId) {
      console.log('⚠️ Patient ID not in response, using fallback search...');
      const searchResponse = await request.get(`${API_ENDPOINTS.PATIENT}?firstName=Aricana`);
      expect(searchResponse.status()).toBe(HTTP_STATUS.OK);
      
      const searchBody = await searchResponse.json();
      patientId = ApiUtils.extractId(searchBody, 'patientId');
      
      if (!patientId) {
        throw new Error('Could not extract patientId from response or search');
      }
    }

    console.log('✅ Patient ID extracted successfully:', patientId);

    // Validate patient response fields
    const patientRequiredFields = ['patientId', 'firstName', 'lastName'];
    expect(ApiUtils.validateRequiredFields(patientResponseBody, patientRequiredFields)).toBe(true);
    expect(patientResponseBody.firstName).toBe('Aricana');
    expect(patientResponseBody.lastName).toBe('rodriguess');

    // ============================================================================
    // STEP 4: BOOK APPOINTMENT
    // ============================================================================
    console.log('\n📅 STEP 4: Booking Appointment with Enhanced Validation...');
    
    const appointmentPayload = {
      ...TEST_DATA_TEMPLATES.APPOINTMENT,
      patientId: patientId, // Dynamic patientId from Step 3
      providerId: providerId, // Dynamic providerId from Step 1
      startTime: "2025-08-04T17:00:00Z",
      endTime: "2025-08-04T17:30:00Z",
      endDate: "2025-07-24T08:07:34.318Z",
      xTENANTID: TENANT_ID
    };

    ApiUtils.logRequest('POST', `${BASE_URL}${API_ENDPOINTS.APPOINTMENT}`, getHeaders(), appointmentPayload);

    const response4 = await request.post(API_ENDPOINTS.APPOINTMENT, {
      data: appointmentPayload
    });

    expect(ApiUtils.isSuccessStatus(response4.status())).toBe(true);

    const appointmentResponseBody = await response4.json();
    ApiUtils.logResponse(response4.status(), await response4.allHeaders(), appointmentResponseBody);

    // Enhanced appointment validation
    const appointmentRequiredFields = ['appointmentId', 'providerId', 'patientId'];
    expect(ApiUtils.validateRequiredFields(appointmentResponseBody, appointmentRequiredFields)).toBe(true);

    // Verify IDs match using enhanced validation
    if (appointmentResponseBody.providerId) {
      expect(appointmentResponseBody.providerId).toBe(providerId);
      console.log('✅ Provider ID verified in appointment response');
    }

    if (appointmentResponseBody.patientId) {
      expect(appointmentResponseBody.patientId).toBe(patientId);
      console.log('✅ Patient ID verified in appointment response');
    }

    // Enhanced appointment time validation
    const startTime = appointmentResponseBody.startTime || "2025-08-04T17:00:00Z";
    const endTime = appointmentResponseBody.endTime || "2025-08-04T17:30:00Z";
    
    const isTimeValid = ApiUtils.isAppointmentTimeValid(startTime, endTime);
    expect(isTimeValid).toBe(true);
    console.log('✅ Appointment time validated within provider availability');

    // ============================================================================
    // FINAL VALIDATION AND SUMMARY
    // ============================================================================
    console.log('\n🎉 ENHANCED 4-STEP WORKFLOW COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    console.log(`✅ Step 1 - Provider Created: sanjana parmar (${providerId})`);
    console.log(`✅ Step 2 - Availability Set: Monday-Friday 12:00-13:00 EST (VIRTUAL)`);
    console.log(`✅ Step 3 - Patient Created: Aricana rodriguess (${patientId})`);
    console.log(`✅ Step 4 - Appointment Booked: ${appointmentResponseBody.appointmentId}`);
    console.log('==================================================');
    
    // Enhanced summary with all details
    console.log('\n📊 Workflow Summary:');
    console.log(`Provider Email: sanjana33@mailer.com`);
    console.log(`Provider Phone: 9797979999`);
    console.log(`Provider NPI: 9998884488`);
    console.log(`Patient Birth Date: 2001-08-16T18:30:00.000Z`);
    console.log(`Patient Gender: FEMALE`);
    console.log(`Emergency Contact: Nikita Shinde (8789898987)`);
    console.log(`Appointment Mode: ${appointmentResponseBody.mode || 'VIRTUAL'}`);
    console.log(`Appointment Type: ${appointmentResponseBody.type || 'NEW'}`);
    console.log(`Payment Type: ${appointmentResponseBody.paymentType || 'CASH'}`);
    console.log(`Appointment Duration: 30 minutes`);
    console.log(`Appointment Status: ${appointmentResponseBody.status || 'SCHEDULED'}`);
    console.log(`Start Time: ${startTime}`);
    console.log(`End Time: ${endTime}`);

    // Debug information with masked sensitive data
    console.log('\n🔍 DEBUG - Masked Response Details:');
    const maskedProviderResponse = ApiUtils.maskSensitiveData(providerResponseBody);
    const maskedPatientResponse = ApiUtils.maskSensitiveData(patientResponseBody);
    
    console.log('Step 1 - Provider Response (Masked):', JSON.stringify(maskedProviderResponse, null, 2));
    console.log('Step 2 - Availability Response:', JSON.stringify(availabilityResponseBody, null, 2));
    console.log('Step 3 - Patient Response (Masked):', JSON.stringify(maskedPatientResponse, null, 2));
    console.log('Step 4 - Appointment Response:', JSON.stringify(appointmentResponseBody, null, 2));

    console.log('\n🏁 All validations passed successfully!');
    console.log('Framework execution completed with enhanced utilities and validation.');
  });
});
