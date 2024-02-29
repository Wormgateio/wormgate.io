import React, { ReactNode } from "react";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import styles from "./layout.module.css";
import Script from "next/script";

import Header from "../components/layout/Header/Header";
import WalletProvider from "./wallet-provider";
import StyledComponentsRegistry from "../components/AntdRegistry";
import AccountDrawer from "../components/AccountDrawer/AccountDrawer";
import Sidebar from "../components/layout/Sidebar/Sidebar";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL),
  title: 'Mint Your Omnichain NFT on Womex.io',
  description: 'Join Womex.io, the first platform to mint, and bridge your NFTs with LayerZero. Dive into the new era of omnichain digital art.',
  images: `${process.env.APP_URL}/twitter-image.jpg`,
  twitter: {
    card: 'summary',
    title: 'Mint Your Omnichain NFT on Womex.io',
    description: 'Join Womex.io, the first platform to mint, and bridge your NFTs with LayerZero. Dive into the new era of omnichain digital art.',
    images: `${process.env.APP_URL}/twitter-image.jpg`,
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
        <html lang="en">
          <body className={inter.className}>
            <Script id="metrika-counter" strategy="afterInteractive">
              {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                  m[i].l=1*new Date();
                  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                  ym(96539505, "init", {
                        clickmap:true,
                        trackLinks:true,
                        accurateTrackBounce:true,
                        webvisor:true
                  });`
              }
            </Script>
            <noscript>
              <div>
                <img src="https://mc.yandex.ru/watch/96012912" style={{ position:'absolute', left:'-9999px' }} alt="" />
              </div>
            </noscript>

            <WalletProvider>
              <StyledComponentsRegistry>
                <div className={styles.bg}>
                    <div className={styles.bgHero} />
                </div>


                <div className={styles.wrapper}>
                  <aside className={styles.sidebar}>
                    <Sidebar />
                  </aside>

                  <div className={styles.inner}>
                    <header className={styles.wrapperHeader}>
                        <Header />
                    </header>

                    <main className={styles.main}>
                      <div className="container">
                        {children}
                      </div>
                    </main>
                  </div>
                </div>

                <AccountDrawer />
              </StyledComponentsRegistry>
            </WalletProvider>
            
          </body>
        </html>
  )
}
