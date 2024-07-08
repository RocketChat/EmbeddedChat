import React, { memo } from 'react';
import { Divider } from '@embeddedchat/ui-elements';

const DividerBlock = ({ className }) => <Divider className={className} />;

export default memo(DividerBlock);
