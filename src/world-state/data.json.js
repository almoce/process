async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}
const limit = 300
const countries = await json(`https://api.worldbank.org/v2/country?format=json&per_page=${limit}`);


const populations = await json('https://api.worldbank.org/v2/country/AW;AF;AO;AL;AD;AE;AR;AM;AS;AG;AU;AT;AZ;BI;BE;BJ;BF;BD;BG;BH;BS;BA;BY;BZ;BM;BO;BR;BB;BN;BT;BW;CF;CA;CH;JG;CL;CN;CI;CM;CD;CG;CO;KM;CV;CR;CU;CW;KY;CY;CZ;DE;DJ;DM;DK;DO;DZ;EC;EG;ER;ES;EE;ET;FI;FJ;FR;FO;FM;GA;GB;GE;GH;GI;GN;GM;GW;GQ;GR;GD;GL;GT;GU;GY;HK;HN;HR;HT;HU;ID;IM;IN;IE;IR;IQ;IS;IL;IT;JM;JO;JP;KZ;KE;KG;KH;KI;KN;KR;KW;LA;LB;LR;LY;LC;LI;LK;LS;LT;LU;LV;MO;MF;MA;MC;MD;MG;MV;MX;MH;MK;ML;MT;MM;ME;MN;MP;MZ;MR;MU;MW;MY;NA;NC;NE;NG;NI;NL;NO;NP;NR;NZ;OM;PK;PA;PE;PH;PW;PG;PL;PR;KP;PT;PY;PS;PF;QA;RO;RU;RW;SA;SD;SN;SG;SB;SL;SV;SM;SO;RS;SS;ST;SR;SK;SI;SE;SZ;SX;SC;SY;TC;TD;TG;TH;TJ;TM;TL;TO;TT;TN;TR;TV;TZ;UG;UA;UY;US;UZ;VC;VE;VG;VI;VN;VU;WS;XK;YE;ZA;ZM;ZW/indicator/SP.POP.TOTL?format=json&per_page=14105')
const popGrow = await json('https://api.worldbank.org/v2/country/AW;AF;AO;AL;AD;AE;AR;AM;AS;AG;AU;AT;AZ;BI;BE;BJ;BF;BD;BG;BH;BS;BA;BY;BZ;BM;BO;BR;BB;BN;BT;BW;CF;CA;CH;JG;CL;CN;CI;CM;CD;CG;CO;KM;CV;CR;CU;CW;KY;CY;CZ;DE;DJ;DM;DK;DO;DZ;EC;EG;ER;ES;EE;ET;FI;FJ;FR;FO;FM;GA;GB;GE;GH;GI;GN;GM;GW;GQ;GR;GD;GL;GT;GU;GY;HK;HN;HR;HT;HU;ID;IM;IN;IE;IR;IQ;IS;IL;IT;JM;JO;JP;KZ;KE;KG;KH;KI;KN;KR;KW;LA;LB;LR;LY;LC;LI;LK;LS;LT;LU;LV;MO;MF;MA;MC;MD;MG;MV;MX;MH;MK;ML;MT;MM;ME;MN;MP;MZ;MR;MU;MW;MY;NA;NC;NE;NG;NI;NL;NO;NP;NR;NZ;OM;PK;PA;PE;PH;PW;PG;PL;PR;KP;PT;PY;PS;PF;QA;RO;RU;RW;SA;SD;SN;SG;SB;SL;SV;SM;SO;RS;SS;ST;SR;SK;SI;SE;SZ;SX;SC;SY;TC;TD;TG;TH;TJ;TM;TL;TO;TT;TN;TR;TV;TZ;UG;UA;UY;US;UZ;VC;VE;VG;VI;VN;VU;WS;XK;YE;ZA;ZM;ZW/indicator/SP.POP.GROW?format=json&per_page=14105')
const countrymesh = await json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')

process.stdout.write(JSON.stringify({
	countries,
  populations,
  popGrow,
  countrymesh
}));