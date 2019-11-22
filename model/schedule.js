const Schedule = module.exports;

const version = 0;
const events = {};
const MOCK_EVENTS = {
  'id000': {
    locationName: 'Atrium',
    locationId: '',
    title: 'Registration',
    description: 'Be sure to register before entering the event. Here you will receive cool swag!',
    startTime: (new Date(2019, 11, 7, 8, 30)).getTime(),
    endTime: (new Date(2019, 11, 7, 9, 0)).getTime(),
    type: ''
  },
  'id001': {
    locationName: 'RB 2000',
    locationId: '',
    title: 'Opening Ceremonies',
    description: 'Get the spiel on what the event is about.',
    startTime: (new Date(2019, 11, 7, 9, 0)).getTime(),
    endTime: (new Date(2019, 11, 7, 9, 30)).getTime(),
    type: ''
  },
  'id002': {
    locationName: 'Richcraft Hall',
    locationId: '',
    title: 'Hacking Begins!',
    description: 'Be sure to register before entering the event. Here you will receive cool swag!',
    startTime: (new Date(2019, 11, 7, 9, 30)).getTime(),
    endTime: (new Date(2019, 11, 7, 18, 0)).getTime(),
    type: ''
  },
  'id003': {
    locationName: 'RB 2004',
    locationId: '',
    title: 'Lunch',
    description: 'Pizza, on us!',
    startTime: (new Date(2019, 11, 7, 13, 0)).getTime(),
    endTime: (new Date(2019, 11, 7, 14, 0)).getTime(),
    type: ''
  },
  'id004': {
    locationName: 'RB 2301',
    locationId: '',
    title: 'GitHub Workshop',
    description: 'Learn how to collaborate using GitHub at this amazing workshop! Hosted by Wal Wal',
    startTime: (new Date(2019, 11, 7, 14, 30)).getTime(),
    endTime: (new Date(2019, 11, 7, 15, 30)).getTime(),
    type: ''
  }
}

Schedule.all = () => {
  return {
    version,
    // events
    events: MOCK_EVENTS
  }
};

Schedule.getEvent = id => {
  // return events[id]
  return MOCK_EVENTS[id]
};
