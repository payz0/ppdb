// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  
  mapbox: {
    accessToken: 'pk.eyJ1IjoicGF5em8iLCJhIjoiY2p1MnU2cDA1MDljZjQzanRkN2tsYngyciJ9.wfPngSrOo056dQTBLuoYcw'
    
  },
    ppdbToken : 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzbXAiOnsidXNlciI6InBheXowIiwicGFzcyI6ImV4ZWxmZXIiLCJza2xpbGwiOiJwcm9ncmFtZXIifSwiaWF0IjoxNTYwNTgxOTcxfQ.MkBtBAg-LrgL_2zR7PT8vWXAh1yqg-rzkwXgWa0xOro',
  // ApiUrlHttp: "//18.139.17.178:38702", //default
    smp1Http: "//103.31.250.70:23457", //smp1
    smp2Http: "//18.139.17.178:38701", // smp2
    smp11Http: "//18.139.17.178:34543", //smp11
    smp7Http: "//18.139.17.178:23456", //smp7
    ApiUrlHttps: "https://18.139.17.178:38701"
};
