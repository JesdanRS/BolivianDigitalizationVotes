import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8090/',        // URL Keycloak
  realm: 'votaciones',                  // nombre de tu realm
  clientId: 'frontend',
});

export default keycloak;