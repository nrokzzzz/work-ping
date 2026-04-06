export const MENU_ITEMS = [
  {
    key: 'organizations',
    icon: 'mdi:office-building',
    label: 'Organizations',
    children: [
      {
        key: 'view-organizations',
        icon: 'mdi:format-list-bulleted',
        label: 'View All',
        url: '/organization/view-organizations',
        parentKey: 'organizations',
      },
      {
        key: 'edit-organizations',
        icon: 'mdi:cogs',
        label: 'Manage',
        parentKey: 'organizations',
        children: [
          {
            key: 'add-organization',
            label: 'Add New',
            icon: 'mdi:plus-circle-outline',
            url: '/organization/organization-details',
            parentKey: 'edit-organizations',
          },
          {
            key: 'update-organization',
            label: 'Update',
            icon: 'mdi:pencil-outline',
            url: '/organization/update-view-organization',
            parentKey: 'edit-organizations',
          },
        ],
      },
    ],
  },
  {
    key: 'teams',
    icon: 'mdi:account-group-outline',
    label: 'Teams',
    children: [
      {
        key: 'view-teams',
        icon: 'mdi:format-list-bulleted',
        label: 'View All',
        url: '/teams/view-teams',
        parentKey: 'teams',
      },
      {
        key: 'edit-teams',
        icon: 'mdi:cogs',
        label: 'Manage',
        parentKey: 'teams',
        children: [
          {
            key: 'add-teams',
            label: 'Add New',
            icon: 'mdi:plus-circle-outline',
            url: '/teams/edit-teams/add-teams',
            parentKey: 'edit-teams',
          },
          {
            key: 'update-teams',
            label: 'Update',
            icon: 'mdi:pencil-outline',
            url: '/teams/update-teams-view',
            parentKey: 'edit-teams',
          },
        ],
      },
    ],
  },
  {
    key: 'employees',
    icon: 'mdi:account-tie',
    label: 'Employees',
    children: [
      {
        key: 'view-employees',
        icon: 'mdi:format-list-bulleted',
        label: 'View All',
        url: '/employees/view-employees',
        parentKey: 'employees',
      },
      {
        key: 'edit-employees',
        icon: 'mdi:cogs',
        label: 'Manage',
        parentKey: 'employees',
        children: [
          {
            key: 'add-employee',
            label: 'Add New',
            icon: 'mdi:plus-circle-outline',
            url: '/employees/add-employees/single-employee-form',
            parentKey: 'edit-employees',
          },
          {
            key: 'update-employees',
            label: 'Update',
            icon: 'mdi:pencil-outline',
            url: '/employees/employees-update-view',
            parentKey: 'edit-employees',
          },
        ],
      },
    ],
  },
  {
    key: 'projects',
    icon: 'mdi:briefcase-variant-outline',
    label: 'Projects',
    children: [
      {
        key: 'view-projects',
        icon: 'mdi:format-list-bulleted',
        label: 'View All',
        url: '/projects/view-projects',
        parentKey: 'projects',
      },
      {
        key: 'edit-projects',
        icon: 'mdi:cogs',
        label: 'Manage',
        parentKey: 'projects',
        children: [
          {
            key: 'add-projects',
            label: 'Add New',
            icon: 'mdi:plus-circle-outline',
            url: '/projects/add-projects',
            parentKey: 'edit-projects',
          },
          {
            key: 'update-projects',
            label: 'Update',
            icon: 'mdi:pencil-outline',
            url: '/projects/update-projects',
            parentKey: 'edit-projects',
          },
        ],
      },
    ],
  },
  {
    key: 'holidays',
    icon: 'mdi:calendar-check-outline',
    label: 'Holidays',
    children: [
      {
        key: 'view-holidays',
        icon: 'mdi:format-list-bulleted',
        label: 'List',
        url: '/holidays/view-holidays',
        parentKey: 'holidays',
      },
      {
        key: 'manage-holidays',
        icon: 'mdi:cogs',
        label: 'Manage',
        url: '/holidays/manage-holidays',
        parentKey: 'holidays',
      },
    ],
  },
];
