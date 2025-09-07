/**
 * ---------------------------------
 * File: constants.utils.js
 * Description:
 * This file defines several constant values used across the application.
 * These constants help to standardize key identifiers for various application components, including:
 * - Device types (Android, iOS, Web)
 * - Agent status (New, Onboarding, Active, Inactive)
 * - User types (e.g., Agent)
 * - A list of agent-specific module codes for various features (e.g., Agent Dashboard, Commissions, etc.)
 *
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 *
 * Notes:
 * - `DEVICE_TYPES`: Defines the supported platforms for the application.
 * - `AGENT_STATUS`: Represents the various states an agent can be in within the system.
 * - `USER_TYPE`: Identifies the types of users, such as "Agent" (AGT).
 * - `AGENT_MODULE_CODE`: List of module codes representing different functionalities for agents.
 * ---------------------------------
 */

const DEVICE_TYPES = {
  Android: "Android",
  Ios: "Ios",
  Web: "Web",
};
const AGENT_STATUS = {
  NEW: "new",
  ONBOARDING: "onboarding",
  ACTIVE: "active",
  INACTIVE: "inactive",
};
const USER_TYPE = {
  AGENT: "AGT",
  ADMIN: "ADM",
  BACK_OFFICE: "BO"
};

const AGENT_MODULE_CODE = [
  // "ADM-DB", // Admin Dashboard | ADM-DB
  // "ADM-CR", // Carriers | ADM-CR
  // "ADM-LIC", // License | ADM-LIC
  // "ADM-UM", // User-Management | ADM-UM
  // "ADM-TM", // Team-Management | ADM-TM

  "AGT-DB", // Agent ashboard | AGT-DB
  "AGT-COM", // Commissions | AGT-COM
  "AGT-CPL", // Compliance | AGT-CPL
  "AGT-CP", // Contests & Promotions | AGT-CP
  "AGT-BS", // Business Submissions | AGT-BS
  "AGT-CM", // Client Management | AGT-CM
  "AGT-TR", // Team Reports | AGT-TR
  "AGT-OB", // Onboarding | AGT-OB
  "AGT-CR", // Carriers | AGT-CR
];

const AGENT_DATA_STATUS = {
  "Active": "ACT",
  "Inactive": "EXP",
  "Expired": "EXP",
  "Suspended": "EXP",
  "Expiring Soon": 'EXPS',
}

const USER_CREATED_THROUGH = {
  SIGNUP: "signup", //Tevah
  API: "api" // GFI SureLC
}

const AGENT_LICENSE_FIELD_MAPPING = {
  licenseStatus: { field: 'licenseDate', valueKey: 'expires' },
  amlStatus: { field: 'amlDate', valueKey: 'expirationDate' },
  eoStatus: { field: 'eoDate', valueKey: 'expiresOn' }
}

const SIGN_ACTION={
  ADMIN_LOGIN: 'Admin login',
  AGENT_LOGIN: 'Agent login',
  CREATE_AGENT: 'Create agent',
  AGENT_TERMINATED: "Agent Terminated"
}


module.exports = {
  DEVICE_TYPES,
  AGENT_STATUS,
  USER_TYPE,
  AGENT_MODULE_CODE,
  AGENT_DATA_STATUS,
  USER_CREATED_THROUGH,
  AGENT_LICENSE_FIELD_MAPPING,
  SIGN_ACTION,
};
