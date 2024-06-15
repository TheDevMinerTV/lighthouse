/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from 'assert/strict';

import * as Lantern from '../lantern.js';
import {getComputationDataFromFixture} from './MetricTestUtils.js';
import {readJson} from '../../../test/test-utils.js';

const {FirstContentfulPaint, LargestContentfulPaint} = Lantern.Metrics;

const trace = readJson('../../../fixtures/artifacts/paul/trace.json', import.meta);

describe('Metrics: Lantern LCP', () => {
  it('should compute predicted value', async () => {
    const data = await getComputationDataFromFixture({trace});
    const result = await LargestContentfulPaint.compute(data, {
      fcpResult: await FirstContentfulPaint.compute(data),
    });

    expect({
      timing: Math.round(result.timing),
      optimistic: Math.round(result.optimisticEstimate.timeInMs),
      pessimistic: Math.round(result.pessimisticEstimate.timeInMs),
      optimisticNodeTimings: result.optimisticEstimate.nodeTimings.size,
      pessimisticNodeTimings: result.pessimisticEstimate.nodeTimings.size}).
toMatchInlineSnapshot(`
Object {
  "optimistic": 1457,
  "optimisticNodeTimings": 8,
  "pessimistic": 1616,
  "pessimisticNodeTimings": 9,
  "timing": 1536,
}
`);
    assert.ok(result.optimisticGraph, 'should have created optimistic graph');
    assert.ok(result.pessimisticGraph, 'should have created pessimistic graph');
  });
});