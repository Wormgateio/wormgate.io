'use client';

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import cn from './Sidebar.module.scss';
import Footer from "../Footer/Footer";
import { Space } from "antd";
import SoonLabel from "../../SoonLabel/SoonLabel";

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
        <div className={clsx(cn.menuItem, {
            [cn.menuItemActive]: isActive,
            [cn.menuItemDisabled]: props.disabled
        })}>
            <div className={cn.menuItemName}>
                <Image className={cn.menuItemIcon} src="/svg/menu-active.svg" alt="" width={30} height={30} />
                <span>{props.name}</span>
            </div>
            <div className={cn.menuItemDescr}>{props.description}</div>
        </div>
    );

    if (props.disabled) {
        return content;
    }

    return (
        <Link href={props.href}>
            {content}
        </Link>
    )
}

const menu = [
    {
        key: 'mint',
        href: '/',
        name: 'Mint NFT',
        description: 'Make a mint our NFT'
    },
    {
        key: 'mintOwn',
        href: '/mint-own-nft',
        name: (
            <Space size={8}>Mint own NFT <SoonLabel /></Space>
        ),
        disabled: true,
        description: 'Create NFT from your own jpg, png picture'
    },
    {
        key: 'bridge',
        href: '/bridge',
        name: 'Bridge NFT',
        description: 'Make a mint our NFT'
    },
    {
        key: 'refuel',
        href: '/refuel',
        name: 'Refuel',
        description: 'Make a mint our NFT'
    }
];

export default function Sidebar() {
    return (
        <div className={cn.sidebar}>
            <div className={cn.sidebarTop}>
                <a className={cn.logo} href="/">Womex.io</a>

                <nav className={cn.menu}>
                    {menu.map(item => (
                        <MenuItem
                            key={item.key}
                            href={item.href}
                            name={item.name}
                            description={item.description}
                            disabled={item.disabled}
                        />
                    ))}
                </nav>
            </div>

            <Footer />
        </div>
    )
}