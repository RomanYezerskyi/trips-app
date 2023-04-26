export const environment = {
  production: true,
  serviceApi: '',

  emailConfirmation: 'http://localhost:4200/auth/emailconfirmation',
  resetPasswordUrl: 'http://localhost:4200/auth/resetpassword',

  //api
  baseApiUrl: 'https://localhost:6001/api/',
  baseIdentityServerUrl: 'https://localhost:5001/api/',

  //geoapify
  geoapifyApiUrl: 'https://api.geoapify.com/v1/geocode/',
  geoapifyFirstApiKey: '32849d6b3d3b480c9a60be1ce5891252',
  geoapifySecondApiKey: 'd06cb6573e1e488d92494d5296611f0c',
  geoapifyMarkerPoin: 'https://api.geoapify.com/v1/icon/?type=material&color=red&icon=point&iconType=awesome&apiKey=',
  geoapifyTileLayer: 'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=',

  //chat hub
  chatHubConnectionUrl: 'https://localhost:6001/chatHub',
  chatHubMethod: 'JoinToChatMessagesNotifications',
  chatHubHandlerMethod: 'BroadcastMessagesFromChats',

  //notifications hub
  notificationsHubConnectionUrl: 'https://localhost:6001/notify',
  notificationsHubMethod: 'JoinToNotificationsHub',
  notificationsHubHandlerMethod: 'BroadcastNotification',
};
