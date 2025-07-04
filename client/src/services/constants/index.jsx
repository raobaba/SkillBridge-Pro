// Enums
import React from "react";

const viewEnum = {
  tile: "TILE",
  list: "LIST",
};

const SIDEBAR_STATES = {
  EXPANDED: "expanded",
  COLLAPSED: "collapsed",
};

const TOKEN_KEY = "token";
const sizeEnum = {
  doubleExtraSmall: "xxs",
  extraSmall: "xs",
  small: "sm",
  medium: "md",
  large: "lg",
  extraLarge: "xl",
};

const positionEnum = {
  left: "left",
  right: "right",
};

const exportFormatEnum = {
  csv: "CSV",
  excel: "EXCEL",
};

const exportEnum = {
  idle: "IDLE",
  loading: "LOADING",
  succeeded: "SUCCEEDED",
};

const datePickerEnum = {
  startDate: "START_DATE",
  endDate: "END_DATE",
};

const sortingEnum = {
  ascending: "ASC",
  descending: "DESC",
};

const inputTypeEnum = {
  password: "password",
  text: "text",
};

const timePeriodEnum = {
  sameDay: "SAME_DAY",
  days90: "NINETY_DAYS",
  months12: "TWELVE_MONTHS",
  months24: "TWENTY_FOUR_MONTHS",
};

// icon

const chevIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      fillRule="evenodd"
      d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const chevRight = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      fillRule="evenodd"
      d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
      clipRule="evenodd"
    />
  </svg>
);
const USER_STATUS = {
  NEW: "new",
  ONBOARDING: "onboarding",
  ACTIVE: "active",
  INACTIVE: "inactive",
  AGENT: "agent",
  ADMIN: "admin",
  LICENSE_UNDER_REVIEW: "AGT_STG6",
  REJECT: "AGT_STG5",
  APPROVED: "AGT_STG4",
  UNDER_REVIEW: "AGT_STG3",
  VERIFIED: "AGT_STG7",
  LICENSE_REJECTED: "AGT_STG8"
};
const ROLE = [
  {
    id: 1,
    name: "Individual",
  },
  {
    id: 2,
    name: "Non-Individual",
  },
];

const RESIDENTIAL_STATUS = [
  { name: "Yes", code: 1, slug: "yes" },
  { name: "No", code: 0, slug: "no" },
];
const MARITAL_STATUS = [
  {
    id: 1,
    name: "SINGLE",
  },
  {
    id: 2,
    name: "MARRIED",
  },
  {
    id: 3,
    name: "DIVORCED",
  },
  {
    id: 4,
    name: "WIDOWED",
  },
];

const countryOptions = [
  { name: "🇺🇸 +1", dialCode: "+1" },
  { name: "🇮🇳 +91", dialCode: "+91" },
  { name: "🇬🇧 +44", dialCode: "+44" },
  { name: "🇨🇦 +1", dialCode: "+1" },
];

const getStatusChip = (value) => {
  if (value === "Approved") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-green-600/10 px-3 text-center text-sm font-semibold text-green-600">
        {value}
      </div>
    );
  }

  if (value === "Unfit") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-red-600/10 px-3 text-center text-sm font-semibold text-red-600">
        {value}
      </div>
    );
  }

  if (value === "Rejected") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-red-600/10 px-3 text-center text-sm font-semibold text-red-600">
        {value}
      </div>
    );
  }

  if (value?.startsWith("Expires in")) {
    return (
      <span className="grid h-6 w-min items-center rounded-2xl bg-orange-100 px-3 text-center text-sm font-semibold text-amber-600">
        {value}
      </span>
    );
  }
  if (value === "--") {
    return <div className="ml-3">{value}</div>;
  }

  return <span>{value}</span>;
};

const agentHeaderList = [
  {
    field: "name",
    header: "Agent Name",
    clickable: true,
    render: (value, row) => (
      <div className="flex items-center gap-2">
        <img
          src={row.agentImg}
          alt={value}
          className="h-6 w-6 rounded-full object-cover"
        />
        <span>{value}</span>
      </div>
    ),
    onClick: (row) => console.log(`Clicked on ${row.name}`),
  },
  {
    field: "code",
    header: "Code",
  },
  {
    field: "email",
    header: "Email",
    clickable: true,
    onClick: (row) => console.log(`Clicked on ${row.email}`),
  },
  {
    field: "level",
    header: "Level",
  },
  {
    field: "aml",
    header: "AML",
    render: (value) => getStatusChip(value),
  },
  {
    field: "license",
    header: "License",
    render: (value) => getStatusChip(value),
  },
  {
    field: "eAndO",
    header: "E&O",
    render: (value) => getStatusChip(value),
  },
  {
    field: "ceStatus",
    header: "CE Status",
    render: (value) => getStatusChip(value),
  },
  {
    field: "status",
    header: "Status",
    render: (value) => getStatusChip(value),
  },
  {
    field: "contractRequests",
    header: "Contract Requests",
  },

  // {
  //   field: "updatedOn",
  //   header: "Updated On",
  //   render: (value) => new Date(value).toLocaleDateString(),
  // },
];

const gridFormatEnum = {
  amount: "AMOUNT",
  amountWithCurrency: "AMOUNT_CURR",
  date: "DATE",
};
const dialogEnum = {
  approverAction: {
    override: "OVERRIDE_ACTION",
  },
};

const innerHeaders = [...agentHeaderList];

const UNAUTHENTICATE_ROUTES = ["/sign-in", "/unuthorized"];

const SUFFIX_OPTIONS = [
  { name: "Sr", key: "Sr" },
  { name: "Jr", key: "Jr" },
];

const GENDER_OPTIONS = [
  { name: "Male", key: "M" },
  { name: "Female", key: "F" },
  { name: "Other", key: "O" },
];
const TITLE_OPTIONS = [
  { name: "Mr", key: "Mr" },
  { name: "Ms", key: "Ms" },
  { name: "Mrs", key: "Mrs" },
];

const desktopTabs = [
  { name: "Certificates", displayName: "Certificates" },
  { name: "Documents", displayName: "Documents" },
  { name: "TransactionHistory", displayName: "Transaction History" },
  { name: "CarrierAppointments", displayName: "Carrier Appointments" },
];

const mobileTabs = [
  { name: "Certificates", displayName: "Certificates" },
  { name: "Profile", displayName: "Profile" },
  { name: "Documents", displayName: "Documents" },
  { name: "TransactionHistory", displayName: "Transaction History" },
  { name: "CarrierAppointments", displayName: "Carrier Appointments" },
];

const ADVERTISE_SCREEN = [
  { name: "Login", value: "login" },
  { name: "Landing", value: "landing" },
  { name: "Agent Dashboard", value: "agentDashboard" }
]
const ADVERTISE_STATUS = [
  {name: "Active", value:true},
  {name: "Deactive", value:false},
]



export {
  viewEnum,
  sizeEnum,
  positionEnum,
  exportFormatEnum,
  sortingEnum,
  datePickerEnum,
  inputTypeEnum,
  timePeriodEnum,
  exportEnum,
  chevIcon,
  chevRight,
  TOKEN_KEY,
  USER_STATUS,
  ROLE,
  MARITAL_STATUS,
  countryOptions,
  agentHeaderList,
  innerHeaders,
  gridFormatEnum,
  dialogEnum,
  SIDEBAR_STATES,
  UNAUTHENTICATE_ROUTES,
  TITLE_OPTIONS,
  SUFFIX_OPTIONS,
  GENDER_OPTIONS,
  desktopTabs,
  mobileTabs,
  RESIDENTIAL_STATUS,
  ADVERTISE_SCREEN,
  ADVERTISE_STATUS,
};
