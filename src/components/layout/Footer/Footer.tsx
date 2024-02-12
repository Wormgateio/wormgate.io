import Image from "next/image";
import styles from './Footer.module.scss';
import { ReactNode } from "react";
import clsx from "clsx";
import { Divider } from "antd";

interface FooterLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
}

function FooterLink({ href, children, className }: FooterLinkProps) {
    return (
        <a href={href} target="_blank" className={clsx(styles.link, className)}>
            {children}
        </a>
    );
}

export default function Footer() {
    return (
        <div className={styles.footer}>
            <div className={styles.socials}>
                <FooterLink href="#">
                    <Image src="/svg/socials/discord.svg" width={32} height={32} alt="Discord" />
                    <span>Discord</span>
                </FooterLink>

                <FooterLink href="https://twitter.com/GetMint_io">
                    <Image src="/svg/socials/twitter.svg" width={28} height={28} alt="Twitter" />
                    <span>Twitter</span>
                </FooterLink>

                <FooterLink href="https://getmint.gitbook.io/">
                    <Image src="/svg/socials/gitbook.svg" width={28} height={28} alt="GitBook" />
                    <span>GitBook</span>
                </FooterLink>

                <FooterLink href="https://medium.com/@GetMint_io">
                    <Image src="/svg/socials/medium.svg" width={28} height={28} alt="Medium" />
                    <span>Medium</span>
                </FooterLink>
            </div>

            <Divider className={styles.divider} />

            <FooterLink className={styles.poweredBy} href="https://layerzero.network/">
                <span>Powered by</span>
                <Image src="/svg/layer-zero.svg" width={111} height={30} alt="Layer Zero" />
            </FooterLink>
        </div>
    )
}