export const tags = [
  {
    id: 'gs_list_manufacturer',
    type: 'String',
    label: 'Fabricant',
    pim: 'supplier',
    from: ['PROVIDED_BY', 'products'],
  },
  {
    id: 'FM_SerialNumber',
    type: 'String',
    label: 'Réf. ERP',
    pim: 'identifier',
  },
  {
    id: 'FM_InventoryNumber',
    type: 'String',
    label: 'Réf. Géria',
    pim: 'oldsku',
  },
  {
    id: 'gs_list_note',
    type: 'String',
    label: 'Description',
    pim: 'description',
  }
]
