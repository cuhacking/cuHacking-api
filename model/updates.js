const Updates = module.exports;

const version = 0;
const announcements = {};
const MOCK_ANNOUCEMENTS = {
  'id100': {
    title: 'Thanks for installing the app!',
    description: 'The app will help you get around the event, and will also keep you informed on all updates.',
    locationId: '', // This will be for when annoucements link to relevant places on the map
    deliveryTime: (new Date(2019, 11, 1)).getTime(),
    eventId: '' // This announcement does not have an attached event
  },
  'id101': {
    title: 'Be sure to head to the registration table!',
    description: 'The registration table should be easy to spot, right in the Atrium. Head there before anywhere else.',
    locationId: 'someLocationIdThatIhavenotworkedoutyet', // This will be for when annoucements link to relevant places on the map
    deliveryTime: (new Date(2019, 11, 7, 8, 0)).getTime(),
    eventId: 'id000'
  }
}

Updates.get = () => {
  return {
    version,
    // updates: announcements
    updates: MOCK_ANNOUCEMENTS
  }
};
