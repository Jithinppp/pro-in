i made a change

/
├── home -> shows login page
│
│
│
├── pm
│ ├── dashboard
│ ├── events
│ │ ├── create
│ │ ├── :eventId
│ │ └── :eventId/edit
│ ├── equipments
│ │ └── assign/:equipmentId
│ └── reports
│
├── tech
│ ├── dashboard
│ ├── events
│ │ ├── upcoming
│ │ └── past
│ └── equipments
│ └── :equipmentId
│
├── inventory
│ ├── dashboard
│ ├── equipments
│ │ ├── add
│ │ ├── :equipmentId
│ │ └── :equipmentId/edit
│ └── categories
│
├── equipments
│ └── search ← ✅ shared (PM + Tech)
│
├── unauthorized
└── \*
