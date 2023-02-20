import { NullSafe } from './utils';
import pkg from 'date-and-time';
const { format, parse } = pkg;


const { nsce, nvl } = NullSafe;

export class DateTime {

  public static ddDmmDyyyy(input: string | null): Date | null;
  public static ddDmmDyyyy(input: Date | null):  string | null;
  public static ddDmmDyyyy(input: Date | string | null): Date | string | null {
    return DateTime.parseOrFormat(input, DatePattern.ddDmmDyyyy);
  }

  public static ddDmmDyyyyShhCmm(input: string | null): Date | null;
  public static ddDmmDyyyyShhCmm(input: Date | null):  string | null;
  public static ddDmmDyyyyShhCmm(input: Date | string | null): Date | string | null {
    return DateTime.parseOrFormat(input, DatePattern.ddDmmDyyyyShhCmm);
  }

  public static ddDmmDyyyyShhCmmCss(input: string | null): Date | null;
  public static ddDmmDyyyyShhCmmCss(input: Date | null):  string | null;
  public static ddDmmDyyyyShhCmmCss(input: Date | string | null): Date | string | null {
    return DateTime.parseOrFormat(input, DatePattern.ddDmmDyyyyShhCmmCss);
  }

  public static dd_mm_yyyy(input: string | null): Date | null;
  public static dd_mm_yyyy(input: Date | null):  string | null;
  public static dd_mm_yyyy(input: Date | string | null): Date | string | null {
    return DateTime.parseOrFormat(input, DatePattern.dd_mm_yyyy);
  }

  public static yyyy_mm_dd(input: string | null): Date | null;
  public static yyyy_mm_dd(input: Date | null):  string | null;
  public static yyyy_mm_dd(input: Date | string | null): Date | string | null {
    return DateTime.parseOrFormat(input, DatePattern.yyyy_mm_dd);
  }

  public static yyyymmdd(input: string | null): Date | null;
  public static yyyymmdd(input: Date | null):  string | null;
  public static yyyymmdd(input: Date | string | null): Date | string | null {
    return DateTime.parseOrFormat(input, DatePattern.yyyymmdd);
  }

  public static yyyymmddShhmmss(input: string | null): Date | null;
  public static yyyymmddShhmmss(input: Date | null):  string | null;
  public static yyyymmddShhmmss(input: Date | string | null): Date | string | null {
    return DateTime.parseOrFormat(input, DatePattern.yyyymmddShhmmss);
  }

  public static yyyymmdd_hhmmss(input: string | null): Date | null;
  public static yyyymmdd_hhmmss(input: Date | null):  string | null;
  public static yyyymmdd_hhmmss(input: Date | string | null): Date | string | null {
    return DateTime.parseOrFormat(input, DatePattern.yyyymmdd_hhmmss);
  }

  public static parse(input: string | null, pattern?: DatePattern | null): Date | null {
    return DateTime.parseOrFormat(input, nvl(pattern));
  }

  public static format(input: Date | null, pattern?: DatePattern | null): string | null {
    return DateTime.parseOrFormat(input, nvl(pattern));
  }

  protected static parseOrFormat(input: Date | null, pattern?: DatePattern | null): string | null
  protected static parseOrFormat(input: string | null, pattern?: DatePattern | null): Date| null
  protected static parseOrFormat(input: Date | string | null, pattern?: DatePattern | null): Date | string | null
  protected static parseOrFormat(input: Date | string | null, pattern?: DatePattern | null): Date | string | null {

    if (!nsce(input)) {
      return null;
    }

    pattern = nvl(pattern, DatePattern.ddDmmDyyyy);

    if (input instanceof Date) {
      return format(input, pattern);
    } else {
      const ret = parse(input + '', pattern);
      return !isNaN(new Number(ret).valueOf()) ? ret : null;
    }
  }
}

export enum DatePattern {
  ddDmmDyyyy = 'DD.MM.YYYY',
  ddDmmDyyyyShhCmm = 'DD.MM.YYYY HH:mm',
  ddDmmDyyyyShhCmmCss = 'DD.MM.YYYY HH:mm:ss',
  dd_mm_yyyy = 'DD-MM-YYYY',
  yyyy_mm_dd = 'YYYY-MM-DD',
  yyyymmdd = 'YYYYMMDD',
  yyyymmddShhmmss = 'YYYYMMDD HHmmss',
  yyyymmdd_hhmmss = 'YYYYMMDD-HHmmss'
}
