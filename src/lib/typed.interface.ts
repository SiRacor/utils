/* eslint-disable @typescript-eslint/no-namespace */

import { NullSafe } from './utils';

const { nvl } = NullSafe;

export interface TypedInterface {
  uids: unknown
}

export namespace TypedInterface {

  export function isA(obj: unknown, s_uid?: unknown): boolean {
    return obj !== null && typeof obj === 'object' &&
    typeof ((obj as Record<string, unknown>)['uids']) === 'string'
    && ((obj as Record<string, unknown>)['uids']  + '').includes(s_uid + '');
  }
}

