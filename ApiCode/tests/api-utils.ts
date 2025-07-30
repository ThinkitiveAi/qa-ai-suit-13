/**
 * API Testing Utilities
 * Helper functions for Healthcare API testing
 */

export class ApiUtils {
  /**
   * Extract ID from API response with fallback logic
   */
  static extractId(response: any, idField: string): string | null {
    if (response && response[idField]) {
      return response[idField];
    }
    
    // Check if response is an array
    if (Array.isArray(response) && response.length > 0) {
      return response[0][idField] || null;
    }
    
    return null;
  }

  /**
   * Validate required fields in API response
   */
  static validateRequiredFields(response: any, fields: string[]): boolean {
    for (const field of fields) {
      if (!(field in response) || response[field] === null || response[field] === undefined) {
        console.error(`Missing or null required field: ${field}`);
        return false;
      }
    }
    return true;
  }

  /**
   * Format date for API consumption
   */
  static formatDateForAPI(date: Date): string {
    return date.toISOString();
  }

  /**
   * Generate timestamp for unique data
   */
  static generateTimestamp(): string {
    return Date.now().toString();
  }

  /**
   * Log request details
   */
  static logRequest(method: string, url: string, headers: any, payload?: any): void {
    console.log(`\n🔍 ${method} Request Details:`);
    console.log(`URL: ${url}`);
    console.log(`Headers:`, JSON.stringify(headers, null, 2));
    if (payload) {
      console.log(`Payload:`, JSON.stringify(payload, null, 2));
    }
  }

  /**
   * Log response details
   */
  static logResponse(status: number, headers: any, body: any): void {
    console.log(`\n📥 Response Details:`);
    console.log(`Status: ${status}`);
    console.log(`Headers:`, JSON.stringify(headers, null, 2));
    console.log(`Body:`, JSON.stringify(body, null, 2));
  }

  /**
   * Check if appointment time is within provider availability
   */
  static isAppointmentTimeValid(
    appointmentStart: string, 
    appointmentEnd: string,
    availabilityStart: string = "12:00:00",
    availabilityEnd: string = "13:00:00"
  ): boolean {
    const startTime = new Date(appointmentStart);
    const endTime = new Date(appointmentEnd);
    
    const startHour = startTime.getUTCHours();
    const startMinute = startTime.getUTCMinutes();
    const endHour = endTime.getUTCHours();
    const endMinute = endTime.getUTCMinutes();
    
    // Convert availability times to UTC (EST is UTC-5, so 12:00 EST = 17:00 UTC)
    const availStartHour = 17; // 12:00 EST = 17:00 UTC
    const availEndHour = 18;   // 13:00 EST = 18:00 UTC
    
    // Check if appointment start is within availability
    const appointmentStartValid = (startHour > availStartHour) || 
                                 (startHour === availStartHour && startMinute >= 0);
    
    // Check if appointment end is within availability
    const appointmentEndValid = (endHour < availEndHour) || 
                               (endHour === availEndHour && endMinute === 0);
    
    return appointmentStartValid && appointmentEndValid;
  }

  /**
   * Validate HTTP status codes
   */
  static isSuccessStatus(status: number): boolean {
    return status >= 200 && status < 300;
  }

  /**
   * Generate unique email for testing
   */
  static generateUniqueEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}_${timestamp}_${random}@mailer.com`;
  }

  /**
   * Generate unique phone number
   */
  static generateUniquePhone(): string {
    const random = Math.floor(Math.random() * 10000000000);
    return random.toString().padStart(10, '0');
  }

  /**
   * Generate unique NPI number
   */
  static generateUniqueNPI(): string {
    const random = Math.floor(Math.random() * 1000000000);
    return random.toString().padStart(10, '0');
  }

  /**
   * Wait for specified milliseconds
   */
  static async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Retry mechanism for API calls
   */
  static async retryApiCall<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall();
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }
        console.log(`Retry attempt ${i + 1}/${maxRetries} failed, waiting ${delayMs}ms...`);
        await this.wait(delayMs);
      }
    }
    throw new Error('Max retries exceeded');
  }

  /**
   * Deep clone object
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Mask sensitive data in logs
   */
  static maskSensitiveData(data: any, sensitiveFields: string[] = ['token', 'password', 'ssn']): any {
    const masked = this.deepClone(data);
    
    const maskRecursive = (obj: any) => {
      for (const key in obj) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
          obj[key] = '***MASKED***';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          maskRecursive(obj[key]);
        }
      }
    };
    
    maskRecursive(masked);
    return masked;
  }
}

/**
 * API Endpoints Configuration
 */
export const API_ENDPOINTS = {
  PROVIDER: '/api/master/provider',
  PROVIDER_AVAILABILITY: '/api/master/provider/availability-setting',
  PATIENT: '/api/master/patient',
  APPOINTMENT: '/api/master/appointment'
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

/**
 * Test Data Templates
 */
export const TEST_DATA_TEMPLATES = {
  PROVIDER: {
    roleType: "PROVIDER",
    active: false,
    admin_access: true,
    status: false,
    avatar: "",
    role: "PROVIDER",
    gender: "FEMALE",
    specialities: null,
    groupNpiNumber: "",
    licensedStates: null,
    licenseNumber: "",
    acceptedInsurances: null,
    experience: "",
    taxonomyNumber: "",
    workLocations: null,
    officeFaxNumber: "",
    areaFocus: "",
    hospitalAffiliation: "",
    ageGroupSeen: null,
    spokenLanguages: null,
    providerEmployment: "",
    insurance_verification: "",
    prior_authorization: "",
    secondOpinion: "",
    careService: null,
    bio: "",
    expertise: "",
    workExperience: "",
    licenceInformation: [
      { uuid: "", licenseState: "", licenseNumber: "" }
    ],
    deaInformation: [
      { deaState: "", deaNumber: "", deaTermDate: "", deaActiveDate: "" }
    ]
  },

  PATIENT: {
    phoneNotAvailable: true,
    emailNotAvailable: true,
    registrationDate: "",
    middleName: "",
    timezone: "IST",
    birthDate: "2001-08-16T18:30:00.000Z",
    gender: "FEMALE",
    ssn: "",
    mrn: "",
    languages: null,
    avatar: "",
    mobileNumber: "",
    faxNumber: "",
    homePhone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "",
      zipcode: ""
    },
    emailConsent: false,
    messageConsent: false,
    callConsent: false
  },

  APPOINTMENT: {
    mode: "VIRTUAL",
    customForms: null,
    visit_type: "",
    type: "NEW",
    paymentType: "CASH",
    insurance_type: "",
    note: "",
    authorization: "",
    forms: [],
    chiefComplaint: "appointment test",
    isRecurring: false,
    recurringFrequency: "daily",
    reminder_set: false,
    endType: "never",
    endAfter: 5,
    customFrequency: 1,
    customFrequencyUnit: "days",
    selectedWeekdays: [],
    reminder_before_number: 1,
    timezone: "CST",
    duration: 30
  }
} as const;

/**
 * Validation Patterns
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\d{10}$/,
  NPI: /^\d{10}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  DATE_ISO: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
} as const;
