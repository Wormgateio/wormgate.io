'use client';

import React, { useEffect, useState } from 'react';
import styles from './MobileMenuLeftSide.module.scss';
import Image from 'next/image';
import Drawer from '../../../ui/Drawer/Drawer';
import Sidebar from '../../../layout/Sidebar/Sidebar';
import Logo from '../../../Logo/Logo';
import NetworkChainSelect from '../../../NetworkChainSelect/NetworkChainSelect';
import { usePathname } from 'next/navigation';
import { useMedia } from 'use-media';
import { MediaBreakpoint } from '@utils/mediaBreakpoints';

export default function MobileMenuLeftSide() {
  const pathname = usePathname();

  const isMobile = useMedia({ maxWidth: MediaBreakpoint.Mobile });

  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    setShowDrawer(false);
  }, [pathname]);

  const closeSidebarButton = <button className={styles.closeSidebarButton} onClick={() => setShowDrawer(false)} />;

  return (
    <div className={styles.root}>
      <button className={styles.burger} onClick={() => setShowDrawer(true)}>
        <Image src="/svg/ui/burger.svg" width={24} height={24} alt="" />
      </button>

      <Logo withCompanyName={false} imageClassName={styles.logo} />

      <NetworkChainSelect className={styles.chainSelect} />

      <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} placement="left">
        <Sidebar closeIcon={isMobile && closeSidebarButton} />
      </Drawer>
    </div>
  );
}
