export function setCookie(name: string, value: string, days?: number): Promise<boolean> {
  return new Promise((resolve) => {
    let expires;
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    } else {
      expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
    resolve(true);
  });
}

export function getCookie(name: string): string | null {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  if (parts.length == 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function deleteCookie(name: string): void {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
