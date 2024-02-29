import { Flex } from 'antd';

import MobileMenuLeftSide from './components/MobileMenuLeftSide/MobileMenuLeftSide';
import MobileMenuRightSide from './components/MobileMenuRightSide/MobileMenuRightSide';

export default function MobileMenu() {
  return (
    <Flex justify="space-between">
      <MobileMenuLeftSide />
      <MobileMenuRightSide />
    </Flex>
  );
}
