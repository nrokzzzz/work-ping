
export const MENU_ITEMS = [
  {
    key: 'organizations',
    icon: 'mdi:office-building',
    label: 'Organizations',
    children: [
      {
        key: 'view-organizations',
        label: 'View Organizations',
        url: '/organization/view-organizations',
        parentKey: 'organizations',
      },
      {
        key: 'edit-organizations',
        label: 'Edit Organizations',
        parentKey: 'organizations',
        children: [
          {
            key: 'add-organization',
            label: 'Add Organization',
            url: '/organization/organization-details',
            parentKey: 'edit-organizations',
          },
          {
            key: 'update-organization',
            label: 'Update Organization',
            url: '/organization/update-view-organization',
            parentKey: 'edit-organizations',
          },
        ],
      },
    ],
  },
  {
    key: 'teams',
    icon: 'mdi:account-multiple',
    label: 'Teams',
    children: [
      {
        key: 'view-teams',
        label: 'View Teams',
        url: '/teams/view-teams',
        parentKey: 'teams',
      },
      {
        key: 'edit-teams',
        label: 'Edit Teams',
        parentKey: 'teams',
        children: [
          {
            key: 'add-teams',
            label: 'Add Teams',
            url: '/teams/edit-teams/add-teams',
            parentKey: 'edit-teams',
          },
          {
            key: 'update-teams',
            label: 'Update Teams',
            url: '/teams/edit-teams/update-teams',
            parentKey: 'edit-teams',
          },
        ],
      },
    ],
  },
  {
    key: 'employees',
    icon: 'mdi:account-group',
    label: 'Employees',
    children: [
      {
        key: 'view-employees',
        label: 'View Employees',
        url: '/employees/view-employees',
        parentKey: 'employees',
      },
      {
        key: 'edit-employees',
        label: 'Edit Employees',
        parentKey: 'employees',
        children: [
          {
            key: 'add-employee',
            label: 'Add Employee',
            url: '/employees/add-employees/single-employee-form',
            parentKey: 'edit-employees',
          },
          {
            key: 'update-employees',
            label: 'Update Employees',
            url: '/employees/employees-update-view',
            parentKey: 'edit-employees',
          },
        ],
      },
    ],
  },

  {
    key: 'Project-teams',
    icon: 'mdi:account-multiple',
    label: 'Project-Teams Bro',
    children: [
      {
        key: 'view-Projectteams',
        label: 'Project-Teams View',
        url: '/projects/view-projects',
        parentKey: 'Project-teams',
      },
      {
        key: 'edit-Projectteams',
        label: 'Edit Project-Teams',
        parentKey: 'Project-teams',
        children: [
          {
            key: 'add-teams',
            label: 'Add Project-Teams',
            url: '/projects/add-projects',
            parentKey: 'edit-Projectteams',
          },
          {
            key: 'update-teams',
            label: 'Update Project-Teams',
            url: '/projects/update-projects',
            parentKey: 'edit-Projectteams',
          },
        ],
      },
    ],
  }
];
