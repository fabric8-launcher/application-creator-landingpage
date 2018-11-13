import DatabaseCapability from './database/DatabaseCapability';
import RestCapability from './rest/RestCapability';

const capabilitiesComponents = {
  rest: RestCapability,
  database: DatabaseCapability,
};

export default capabilitiesComponents;