'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import cn from './Sidebar.module.scss';
import Footer from '../Footer/Footer';
import { Space } from 'antd';
import SoonLabel from '../../SoonLabel/SoonLabel';
import LogoWithText from '../../Logo/Logo';

interface MenuItemProps {
  href: string;
  name: string | ReactNode;
  description: string;
  disabled?: boolean;
}

function MenuItem(props: MenuItemProps) {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  const content = (
    <div
      className={clsx(cn.menuItem, {
        [cn.menuItemActive]: isActive,
        [cn.menuItemDisabled]: props.disabled,
      })}
    >
      <div className={cn.menuItemName}>
        <Image className={cn.menuItemIcon} src="/svg/menu-active.svg" alt="" width={30} height={30} />
        <span className={cn.menuItemTitle}>{props.name}</span>
      </div>
      <div className={cn.menuItemDescription}>{props.description}</div>
    </div>
  );

  if (props.disabled) {
    return content;
  }

  return <Link href={props.href}>{content}</Link>;
}

const menu = [
  {
    key: 'mint',
    href: '/',
    name: 'Mint NFT',
    description: 'Make a mint our NFT',
  },
  /*{
        key: 'mintOwn',
        href: '/mint-own-nft',
        name: (
            <Space size={8}>Mint own NFT <SoonLabel /></Space>
        ),
        disabled: true,
        description: 'Create NFT from your own jpg, png picture'
    },*/
  {
    key: 'bridge',
    href: '/bridge',
    name: 'Bridge NFT',
    description: 'Seamlessly transfer NFTs across blockchains',
  },
  {
    key: 'refuel',
    href: '/refuel',
    name: 'Refuel',
    description: 'Send native tokens across networks',
  },
];

interface SidebarProps {
  closeIcon?: ReactNode;
}

export default function Sidebar({ closeIcon }: SidebarProps) {
  return (
    <div className={cn.sidebar}>
      <div className={cn.sidebarTop}>
        <div className={cn.logo}>
          <LogoWithText />

          {closeIcon}
        </div>

        <nav className={cn.menu}>
          {menu.map((item) => (
            <MenuItem key={item.key} href={item.href} name={item.name} description={item.description} />
          ))}
        </nav>
      </div>

      <Footer />
    </div>
  );
}
