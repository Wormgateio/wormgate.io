import getPinataImageUrl from "../utils/getPinataImageUrl";

interface PinataImageProps {
    hash: string;
    fileName?: string;
    name?: string;
}

export default function PinataImage({ hash, name, fileName }: PinataImageProps) {
    return <img
        src={getPinataImageUrl(hash, fileName)}
        alt={name || ''}
    />
}