import { BaseStack, BaseStackProps } from './base-stack';
import { Construct } from 'constructs';
import { PROD_CONFIG } from '../config/environment-config';

export class ProdStack extends BaseStack {
  constructor(scope: Construct, id: string, props?: Omit<BaseStackProps, 'config'>) {
    super(scope, id, {
      ...props,
      config: PROD_CONFIG,
      stackName: 'AcentraProdStack',
      description: 'Production environment for Acentra application',
    });
  }
}
