import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8090/',        // URL Keycloak
  realm: 'votaciones-realm',                  // nombre de tu realm
  clientId: 'votaciones-client',
});

export default keycloak;