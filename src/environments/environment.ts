// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: "http://10.180.210.21:3000",
  apiUrl : "http://localhost:3000",
  socketServer : "http://localhost:3005",
  // socketServer : "http://10.180.210.21:3005",
  cognito: {
    region : "eu-west-2",
    userPoolId: 'eu-west-2_xpVpljinf',
    userPoolWebClientId: '4ljj2hsotq84l46pekpb46gc5c',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
