// Parse vCard content
export const parseVCard = (content: string) => {
  const lines = content.split(/\r?\n/);
  const data: Record<string, string> = {};
  
  for (const line of lines) {
    if (line.startsWith('FN:')) data.name = line.slice(3);
    else if (line.startsWith('TEL:') || line.startsWith('TEL;')) {
      const tel = line.split(':')[1];
      if (tel) data.phone = tel;
    }
    else if (line.startsWith('EMAIL:') || line.startsWith('EMAIL;')) {
      const email = line.split(':')[1];
      if (email) data.email = email;
    }
    else if (line.startsWith('ORG:')) data.org = line.slice(4);
    else if (line.startsWith('TITLE:')) data.title = line.slice(6);
    else if (line.startsWith('URL:')) data.url = line.slice(4);
    else if (line.startsWith('ADR:') || line.startsWith('ADR;')) {
      const adr = line.split(':')[1];
      if (adr) data.address = adr.replace(/;/g, ', ').replace(/,\s*,/g, ',').trim();
    }
  }
  
  return data;
};

// Parse WiFi content
export const parseWiFi = (content: string) => {
  const match = content.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);/i);
  if (match) {
    return { type: match[1], ssid: match[2], password: match[3] };
  }
  return null;
};
