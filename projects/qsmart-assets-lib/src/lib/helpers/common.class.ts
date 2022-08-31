export const customDecimal = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const calcPercent = (num: number, percent: number) => {
  const result = num * (percent / 100);
  const total = num + result;
  return customDecimal(total);
};

export class qsmartCommonClass {
  static emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static passwordPattern: string = '^(?!.* )(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[*\\-#@!/]).{0,}$';

  static padNumber(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  static removeTrailingZeros(value: any) {
    if (value != null) return Number(value) / 1.0;
    else return value;
  }

  static groupBy(arr: any, prop: any) {
    const map = new Map(Array.from(arr, (obj: any) => [obj[prop], []]));
    arr.forEach((obj: any) => {
      return map?.get(obj[prop])?.push(obj as never);
    });
    return Array.from(map.values());
  }
}
