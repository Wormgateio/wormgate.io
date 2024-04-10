import Image from "next/image";

interface NftImageProps {
    fileName?: string;
    name?: string;
}

export default function NftImage({ name, fileName }: NftImageProps) {

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative'}}>
            <Image src={`/nfts/${fileName}`} alt={name || ''} layout="fill" objectFit="cover" />
        </div>
    )
}