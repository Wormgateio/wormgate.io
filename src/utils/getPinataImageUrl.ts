export default function getPinataImageUrl(hash: string, fileName: string = '') {
    let path = `${process.env.PINATA_GATEWAY}/ipfs/${hash}`;

    if (fileName) {
        path += `?filename=${fileName}`;
    }

    const divider = fileName ? '&' : '?';

    return `${path}${divider}pinataGatewayToken=${process.env.PINATA_GATEWAY_TOKEN}`
}