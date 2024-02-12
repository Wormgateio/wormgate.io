'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import cn from './Sidebar.module.scss';
import Footer from "../Footer/Footer";

interface MenuItemProps {
    href: string;
    name: string;
    description: string;
}

function MenuItem(props: MenuItemProps) {
    const pathname = usePathname();
    const isActive = pathname === props.href;

    return (
        <Link className={clsx(cn.menuItem, isActive && cn.menuItemActive)} href={props.href}>
            <div className={cn.menuItemName}>
                <Image className={cn.menuItemIcon} src="/svg/menu-active.svg" alt="" width={30} height={30} />
                <span>{props.name}</span>
            </div>
            <div className={cn.menuItemDescr}>{props.description}</div>
        </Link>
    )
}

const menu = [
    {
        href: '/',
        name: 'Mint NFT',
        description: 'Make a mint our NFT'
    },
    {
        href: '/mint-own-nft',
        name: 'Mint own NFT',
        description: 'Create NFT from your own jpg, png picture'
    },
    {
        href: '/bridge',
        name: 'Bridge NFT',
        description: 'Make a mint our NFT'
    },
    {
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
                        <MenuItem key={item.name} href={item.href} name={item.name} description={item.description} />
                    ))}
                </nav>
            </div>

            <Footer />
        </div>
    )
}