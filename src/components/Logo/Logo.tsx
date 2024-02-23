import styles from './Logo.module.css';
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <h1 className={styles.logo}>
            <Link href="/">
                <Image priority={true} src="/svg/logo.svg" width={203} height={60} alt="Womex" />
            </Link>
        </h1>
    )
}