/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {getBFCacheRestoreTime} from './bfcache.js';
import {generateUniqueID} from './generateUniqueID.js';
import {getActivationStart} from './getActivationStart.js';
import {getNavigationEntry} from './getNavigationEntry.js';
import {Metric} from '../types.js';

export const initMetric = (name: Metric['name'], value?: number): Metric => {
  const navEntry = getNavigationEntry();
  let navigationType: Metric['navigationType'] = 'navigate';

  if (getBFCacheRestoreTime() >= 0) {
    navigationType = 'back-forward-cache';
  } else if (navEntry) {
    if (document.prerendering || getActivationStart() > 0) {
      navigationType = 'prerender';
    } else if (document.wasDiscarded) {
      navigationType = 'restore';
    } else {
      navigationType = navEntry.type.replace(
        /_/g,
        '-'
      ) as Metric['navigationType'];
    }
  }

  return {
    name,
    value: typeof value === 'undefined' ? -1 : value,
    rating: 'good', // Will be updated if the value changes.
    delta: 0,
    entries: [],
    id: generateUniqueID(),
    navigationType,
  };
};
