#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DailyLogStack } from '../lib/daily-log-stack';

const app = new cdk.App();
new DailyLogStack(app, 'DailyLogStack');