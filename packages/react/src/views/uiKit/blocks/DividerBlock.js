import React, { memo } from 'react';
import { Divider } from '../../../components/Divider';

const DividerBlock = ({ className }) => <Divider className={className} />;

export default memo(DividerBlock);
