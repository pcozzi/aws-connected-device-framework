/*********************************************************************************************************************
 *  Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance    *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *      http://www.apache.org/licenses/LICENSE-2.0                                                                    *
 *                                                                                                                    *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 *********************************************************************************************************************/
import { logger } from '@awssolutions/simple-cdf-logger';
import { inject, injectable } from 'inversify';
import ow from 'ow';
import { TYPES } from '../../../di/types';
import { EmailTargetItem } from '../targets.models';
import { SNSTarget, SNSTargetCreation } from './sns.target';

@injectable()
export class EmailTarget extends SNSTarget implements SNSTargetCreation {
    private readonly PROTOCOL = 'email';

    constructor(
        @inject('aws.region') region: string,
        @inject('aws.accountId') accountId: string,
        @inject(TYPES.SNSFactory) snsFactory: () => AWS.SNS,
    ) {
        super(region, accountId, snsFactory);
    }

    public async create(config: EmailTargetItem, topicArn: string): Promise<string> {
        logger.debug(
            `email.target create: in: config:${JSON.stringify(config)}, topicArn:${topicArn}`,
        );

        // validate input
        ow(config, ow.object.nonEmpty);
        ow(config.address, ow.string.nonEmpty);

        const subscriptionArn = await super.subscribe(this.PROTOCOL, topicArn, config.address);
        config.subscriptionArn = subscriptionArn;

        logger.debug(`email.target create: exit:${config.address}`);
        return config.address;
    }
}
