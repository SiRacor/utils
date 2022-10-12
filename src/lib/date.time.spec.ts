import { DateTime, DatePattern } from './date.time';
import { Assert } from './assert';
const { ddDmmDyyyy, ddDmmDyyyyShhCmm, ddDmmDyyyyShhCmmCss,
  dd_mm_yyyy, yyyy_mm_dd, yyyymmdd, yyyymmddShhmmss, yyyymmdd_hhmmss, format, parse } = DateTime;
const { assertEq, assertTrue } = Assert;

describe('DateTime', () => {

  it('ddDmmDyyyy', () => {

    assertEq(ddDmmDyyyy('10.10.2000'), new Date('2000-10-10 00:00:00'));
    assertEq(ddDmmDyyyy(new Date('2000-10-10 00:00:00')), '10.10.2000');

  });

  it('ddDmmDyyyyShhCmm', () => {

    assertEq(ddDmmDyyyyShhCmm('10.10.2000 10:01'), new Date('2000-10-10 10:01:00'));
    assertEq(ddDmmDyyyyShhCmm(new Date('2000-10-10 10:01:00')), '10.10.2000 10:01');

  });

  it('ddDmmDyyyyShhCmmCss', () => {

    assertEq(ddDmmDyyyyShhCmmCss('10.10.2000 10:01:05'), new Date('2000-10-10 10:01:05'));
    assertEq(ddDmmDyyyyShhCmmCss(new Date('2000-10-10 10:01:05')), '10.10.2000 10:01:05');

  });

  it('dd_mm_yyyy', () => {

    assertEq(dd_mm_yyyy('10-10-2000'), new Date('2000-10-10 00:00'));
    assertEq(dd_mm_yyyy(new Date('2000-10-10 00:00')), '10-10-2000');

  });

  it('yyyy_mm_dd', () => {

    assertEq(yyyy_mm_dd('2000-10-10'), new Date('2000-10-10 00:00'));
    assertEq(yyyy_mm_dd(new Date('2000-10-10 00:00')), '2000-10-10');

  });

  it('yyyymmdd', () => {

    assertEq(yyyymmdd('20001010'), new Date('2000-10-10 00:00'));
    assertEq(yyyymmdd(new Date('2000-10-10 00:00')), '20001010');

  });

  it('yyyymmdd', () => {

    assertEq(yyyymmdd('20001010'), new Date('2000-10-10 00:00'));
    assertEq(yyyymmdd(new Date('2000-10-10 00:00')), '20001010');

  });

  it('yyyymmddShhmmss', () => {

    assertEq(yyyymmddShhmmss('20001010 090807'), new Date('2000-10-10 09:08:07'));
    assertEq(yyyymmddShhmmss(new Date('2000-10-10 09:08:07')), '20001010 090807');

  });

  it('yyyymmdd_hhmmss', () => {

    assertEq(yyyymmdd_hhmmss('20001010-090807'), new Date('2000-10-10 09:08:07'));
    assertEq(yyyymmdd_hhmmss(new Date('2000-10-10 09:08:07')), '20001010-090807');

  });

  it('parse and format', () => {

    assertEq(parse(null), null);
    assertEq(format(null), null);

    assertEq(parse('10.10.2000'), new Date('2000-10-10 00:00'));
    assertEq(format(new Date('2000-10-10 09:08:07')), '10.10.2000');

    assertEq(parse('20001010-090807', DatePattern.yyyymmdd_hhmmss), new Date('2000-10-10 09:08:07'));
    assertEq(format(new Date('2000-10-10 09:08:07'), DatePattern.yyyymmdd_hhmmss), '20001010-090807');

  });

  it('isNaN', () => {
    assertEq(parse('we'), null);
  });
});
